package org.code4refugees.cri.alba.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.code4refugees.cri.alba.IntegrationTest;
import org.code4refugees.cri.alba.domain.Refugee;
import org.code4refugees.cri.alba.domain.enumeration.Edulevel;
import org.code4refugees.cri.alba.domain.enumeration.Gender;
import org.code4refugees.cri.alba.domain.enumeration.Religion;
import org.code4refugees.cri.alba.repository.RefugeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link RefugeeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class RefugeeResourceIT {

    private static final String DEFAULT_QRCODE_UUID = "AAAAAAAAAA";
    private static final String UPDATED_QRCODE_UUID = "BBBBBBBBBB";

    private static final Edulevel DEFAULT_EDUCATIONAL_LEVEL = Edulevel.NO_SCHOOL;
    private static final Edulevel UPDATED_EDUCATIONAL_LEVEL = Edulevel.PRIMARY;

    private static final Boolean DEFAULT_MANDATORY_TUTORED = false;
    private static final Boolean UPDATED_MANDATORY_TUTORED = true;

    private static final LocalDate DEFAULT_BIRTH_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_BIRTH_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final Boolean DEFAULT_DISABLED_PERSON = false;
    private static final Boolean UPDATED_DISABLED_PERSON = true;

    private static final Religion DEFAULT_RELIGION = Religion.CHRISTIAN;
    private static final Religion UPDATED_RELIGION = Religion.MUSLIM;

    private static final Gender DEFAULT_GENDER = Gender.M;
    private static final Gender UPDATED_GENDER = Gender.F;

    private static final String ENTITY_API_URL = "/api/refugees";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RefugeeRepository refugeeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRefugeeMockMvc;

    private Refugee refugee;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Refugee createEntity(EntityManager em) {
        Refugee refugee = new Refugee()
            .qrcodeUUID(DEFAULT_QRCODE_UUID)
            .educationalLevel(DEFAULT_EDUCATIONAL_LEVEL)
            .mandatoryTutored(DEFAULT_MANDATORY_TUTORED)
            .birthDate(DEFAULT_BIRTH_DATE)
            .disabledPerson(DEFAULT_DISABLED_PERSON)
            .religion(DEFAULT_RELIGION)
            .gender(DEFAULT_GENDER);
        return refugee;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Refugee createUpdatedEntity(EntityManager em) {
        Refugee refugee = new Refugee()
            .qrcodeUUID(UPDATED_QRCODE_UUID)
            .educationalLevel(UPDATED_EDUCATIONAL_LEVEL)
            .mandatoryTutored(UPDATED_MANDATORY_TUTORED)
            .birthDate(UPDATED_BIRTH_DATE)
            .disabledPerson(UPDATED_DISABLED_PERSON)
            .religion(UPDATED_RELIGION)
            .gender(UPDATED_GENDER);
        return refugee;
    }

    @BeforeEach
    public void initTest() {
        refugee = createEntity(em);
    }

    @Test
    @Transactional
    void createRefugee() throws Exception {
        int databaseSizeBeforeCreate = refugeeRepository.findAll().size();
        // Create the Refugee
        restRefugeeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(refugee)))
            .andExpect(status().isCreated());

        // Validate the Refugee in the database
        List<Refugee> refugeeList = refugeeRepository.findAll();
        assertThat(refugeeList).hasSize(databaseSizeBeforeCreate + 1);
        Refugee testRefugee = refugeeList.get(refugeeList.size() - 1);
        assertThat(testRefugee.getQrcodeUUID()).isEqualTo(DEFAULT_QRCODE_UUID);
        assertThat(testRefugee.getEducationalLevel()).isEqualTo(DEFAULT_EDUCATIONAL_LEVEL);
        assertThat(testRefugee.getMandatoryTutored()).isEqualTo(DEFAULT_MANDATORY_TUTORED);
        assertThat(testRefugee.getBirthDate()).isEqualTo(DEFAULT_BIRTH_DATE);
        assertThat(testRefugee.getDisabledPerson()).isEqualTo(DEFAULT_DISABLED_PERSON);
        assertThat(testRefugee.getReligion()).isEqualTo(DEFAULT_RELIGION);
        assertThat(testRefugee.getGender()).isEqualTo(DEFAULT_GENDER);
    }

    @Test
    @Transactional
    void createRefugeeWithExistingId() throws Exception {
        // Create the Refugee with an existing ID
        refugee.setId(1L);

        int databaseSizeBeforeCreate = refugeeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRefugeeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(refugee)))
            .andExpect(status().isBadRequest());

        // Validate the Refugee in the database
        List<Refugee> refugeeList = refugeeRepository.findAll();
        assertThat(refugeeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllRefugees() throws Exception {
        // Initialize the database
        refugeeRepository.saveAndFlush(refugee);

        // Get all the refugeeList
        restRefugeeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(refugee.getId().intValue())))
            .andExpect(jsonPath("$.[*].qrcodeUUID").value(hasItem(DEFAULT_QRCODE_UUID)))
            .andExpect(jsonPath("$.[*].educationalLevel").value(hasItem(DEFAULT_EDUCATIONAL_LEVEL.toString())))
            .andExpect(jsonPath("$.[*].mandatoryTutored").value(hasItem(DEFAULT_MANDATORY_TUTORED.booleanValue())))
            .andExpect(jsonPath("$.[*].birthDate").value(hasItem(DEFAULT_BIRTH_DATE.toString())))
            .andExpect(jsonPath("$.[*].disabledPerson").value(hasItem(DEFAULT_DISABLED_PERSON.booleanValue())))
            .andExpect(jsonPath("$.[*].religion").value(hasItem(DEFAULT_RELIGION.toString())))
            .andExpect(jsonPath("$.[*].gender").value(hasItem(DEFAULT_GENDER.toString())));
    }

    @Test
    @Transactional
    void getRefugee() throws Exception {
        // Initialize the database
        refugeeRepository.saveAndFlush(refugee);

        // Get the refugee
        restRefugeeMockMvc
            .perform(get(ENTITY_API_URL_ID, refugee.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(refugee.getId().intValue()))
            .andExpect(jsonPath("$.qrcodeUUID").value(DEFAULT_QRCODE_UUID))
            .andExpect(jsonPath("$.educationalLevel").value(DEFAULT_EDUCATIONAL_LEVEL.toString()))
            .andExpect(jsonPath("$.mandatoryTutored").value(DEFAULT_MANDATORY_TUTORED.booleanValue()))
            .andExpect(jsonPath("$.birthDate").value(DEFAULT_BIRTH_DATE.toString()))
            .andExpect(jsonPath("$.disabledPerson").value(DEFAULT_DISABLED_PERSON.booleanValue()))
            .andExpect(jsonPath("$.religion").value(DEFAULT_RELIGION.toString()))
            .andExpect(jsonPath("$.gender").value(DEFAULT_GENDER.toString()));
    }

    @Test
    @Transactional
    void getNonExistingRefugee() throws Exception {
        // Get the refugee
        restRefugeeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewRefugee() throws Exception {
        // Initialize the database
        refugeeRepository.saveAndFlush(refugee);

        int databaseSizeBeforeUpdate = refugeeRepository.findAll().size();

        // Update the refugee
        Refugee updatedRefugee = refugeeRepository.findById(refugee.getId()).get();
        // Disconnect from session so that the updates on updatedRefugee are not directly saved in db
        em.detach(updatedRefugee);
        updatedRefugee
            .qrcodeUUID(UPDATED_QRCODE_UUID)
            .educationalLevel(UPDATED_EDUCATIONAL_LEVEL)
            .mandatoryTutored(UPDATED_MANDATORY_TUTORED)
            .birthDate(UPDATED_BIRTH_DATE)
            .disabledPerson(UPDATED_DISABLED_PERSON)
            .religion(UPDATED_RELIGION)
            .gender(UPDATED_GENDER);

        restRefugeeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRefugee.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedRefugee))
            )
            .andExpect(status().isOk());

        // Validate the Refugee in the database
        List<Refugee> refugeeList = refugeeRepository.findAll();
        assertThat(refugeeList).hasSize(databaseSizeBeforeUpdate);
        Refugee testRefugee = refugeeList.get(refugeeList.size() - 1);
        assertThat(testRefugee.getQrcodeUUID()).isEqualTo(UPDATED_QRCODE_UUID);
        assertThat(testRefugee.getEducationalLevel()).isEqualTo(UPDATED_EDUCATIONAL_LEVEL);
        assertThat(testRefugee.getMandatoryTutored()).isEqualTo(UPDATED_MANDATORY_TUTORED);
        assertThat(testRefugee.getBirthDate()).isEqualTo(UPDATED_BIRTH_DATE);
        assertThat(testRefugee.getDisabledPerson()).isEqualTo(UPDATED_DISABLED_PERSON);
        assertThat(testRefugee.getReligion()).isEqualTo(UPDATED_RELIGION);
        assertThat(testRefugee.getGender()).isEqualTo(UPDATED_GENDER);
    }

    @Test
    @Transactional
    void putNonExistingRefugee() throws Exception {
        int databaseSizeBeforeUpdate = refugeeRepository.findAll().size();
        refugee.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRefugeeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, refugee.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(refugee))
            )
            .andExpect(status().isBadRequest());

        // Validate the Refugee in the database
        List<Refugee> refugeeList = refugeeRepository.findAll();
        assertThat(refugeeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRefugee() throws Exception {
        int databaseSizeBeforeUpdate = refugeeRepository.findAll().size();
        refugee.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRefugeeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(refugee))
            )
            .andExpect(status().isBadRequest());

        // Validate the Refugee in the database
        List<Refugee> refugeeList = refugeeRepository.findAll();
        assertThat(refugeeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRefugee() throws Exception {
        int databaseSizeBeforeUpdate = refugeeRepository.findAll().size();
        refugee.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRefugeeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(refugee)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Refugee in the database
        List<Refugee> refugeeList = refugeeRepository.findAll();
        assertThat(refugeeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRefugeeWithPatch() throws Exception {
        // Initialize the database
        refugeeRepository.saveAndFlush(refugee);

        int databaseSizeBeforeUpdate = refugeeRepository.findAll().size();

        // Update the refugee using partial update
        Refugee partialUpdatedRefugee = new Refugee();
        partialUpdatedRefugee.setId(refugee.getId());

        partialUpdatedRefugee
            .educationalLevel(UPDATED_EDUCATIONAL_LEVEL)
            .mandatoryTutored(UPDATED_MANDATORY_TUTORED)
            .birthDate(UPDATED_BIRTH_DATE)
            .gender(UPDATED_GENDER);

        restRefugeeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRefugee.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRefugee))
            )
            .andExpect(status().isOk());

        // Validate the Refugee in the database
        List<Refugee> refugeeList = refugeeRepository.findAll();
        assertThat(refugeeList).hasSize(databaseSizeBeforeUpdate);
        Refugee testRefugee = refugeeList.get(refugeeList.size() - 1);
        assertThat(testRefugee.getQrcodeUUID()).isEqualTo(DEFAULT_QRCODE_UUID);
        assertThat(testRefugee.getEducationalLevel()).isEqualTo(UPDATED_EDUCATIONAL_LEVEL);
        assertThat(testRefugee.getMandatoryTutored()).isEqualTo(UPDATED_MANDATORY_TUTORED);
        assertThat(testRefugee.getBirthDate()).isEqualTo(UPDATED_BIRTH_DATE);
        assertThat(testRefugee.getDisabledPerson()).isEqualTo(DEFAULT_DISABLED_PERSON);
        assertThat(testRefugee.getReligion()).isEqualTo(DEFAULT_RELIGION);
        assertThat(testRefugee.getGender()).isEqualTo(UPDATED_GENDER);
    }

    @Test
    @Transactional
    void fullUpdateRefugeeWithPatch() throws Exception {
        // Initialize the database
        refugeeRepository.saveAndFlush(refugee);

        int databaseSizeBeforeUpdate = refugeeRepository.findAll().size();

        // Update the refugee using partial update
        Refugee partialUpdatedRefugee = new Refugee();
        partialUpdatedRefugee.setId(refugee.getId());

        partialUpdatedRefugee
            .qrcodeUUID(UPDATED_QRCODE_UUID)
            .educationalLevel(UPDATED_EDUCATIONAL_LEVEL)
            .mandatoryTutored(UPDATED_MANDATORY_TUTORED)
            .birthDate(UPDATED_BIRTH_DATE)
            .disabledPerson(UPDATED_DISABLED_PERSON)
            .religion(UPDATED_RELIGION)
            .gender(UPDATED_GENDER);

        restRefugeeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRefugee.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRefugee))
            )
            .andExpect(status().isOk());

        // Validate the Refugee in the database
        List<Refugee> refugeeList = refugeeRepository.findAll();
        assertThat(refugeeList).hasSize(databaseSizeBeforeUpdate);
        Refugee testRefugee = refugeeList.get(refugeeList.size() - 1);
        assertThat(testRefugee.getQrcodeUUID()).isEqualTo(UPDATED_QRCODE_UUID);
        assertThat(testRefugee.getEducationalLevel()).isEqualTo(UPDATED_EDUCATIONAL_LEVEL);
        assertThat(testRefugee.getMandatoryTutored()).isEqualTo(UPDATED_MANDATORY_TUTORED);
        assertThat(testRefugee.getBirthDate()).isEqualTo(UPDATED_BIRTH_DATE);
        assertThat(testRefugee.getDisabledPerson()).isEqualTo(UPDATED_DISABLED_PERSON);
        assertThat(testRefugee.getReligion()).isEqualTo(UPDATED_RELIGION);
        assertThat(testRefugee.getGender()).isEqualTo(UPDATED_GENDER);
    }

    @Test
    @Transactional
    void patchNonExistingRefugee() throws Exception {
        int databaseSizeBeforeUpdate = refugeeRepository.findAll().size();
        refugee.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRefugeeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, refugee.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(refugee))
            )
            .andExpect(status().isBadRequest());

        // Validate the Refugee in the database
        List<Refugee> refugeeList = refugeeRepository.findAll();
        assertThat(refugeeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRefugee() throws Exception {
        int databaseSizeBeforeUpdate = refugeeRepository.findAll().size();
        refugee.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRefugeeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(refugee))
            )
            .andExpect(status().isBadRequest());

        // Validate the Refugee in the database
        List<Refugee> refugeeList = refugeeRepository.findAll();
        assertThat(refugeeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRefugee() throws Exception {
        int databaseSizeBeforeUpdate = refugeeRepository.findAll().size();
        refugee.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRefugeeMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(refugee)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Refugee in the database
        List<Refugee> refugeeList = refugeeRepository.findAll();
        assertThat(refugeeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRefugee() throws Exception {
        // Initialize the database
        refugeeRepository.saveAndFlush(refugee);

        int databaseSizeBeforeDelete = refugeeRepository.findAll().size();

        // Delete the refugee
        restRefugeeMockMvc
            .perform(delete(ENTITY_API_URL_ID, refugee.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Refugee> refugeeList = refugeeRepository.findAll();
        assertThat(refugeeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
