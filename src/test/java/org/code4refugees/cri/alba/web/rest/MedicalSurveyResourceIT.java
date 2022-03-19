package org.code4refugees.cri.alba.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.code4refugees.cri.alba.IntegrationTest;
import org.code4refugees.cri.alba.domain.MedicalSurvey;
import org.code4refugees.cri.alba.repository.MedicalSurveyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link MedicalSurveyResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MedicalSurveyResourceIT {

    private static final String DEFAULT_ONGOING_ILLNESSES = "AAAAAAAAAA";
    private static final String UPDATED_ONGOING_ILLNESSES = "BBBBBBBBBB";

    private static final String DEFAULT_ONGOING_TREATMENTS = "AAAAAAAAAA";
    private static final String UPDATED_ONGOING_TREATMENTS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/medical-surveys";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MedicalSurveyRepository medicalSurveyRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMedicalSurveyMockMvc;

    private MedicalSurvey medicalSurvey;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MedicalSurvey createEntity(EntityManager em) {
        MedicalSurvey medicalSurvey = new MedicalSurvey()
            .ongoingIllnesses(DEFAULT_ONGOING_ILLNESSES)
            .ongoingTreatments(DEFAULT_ONGOING_TREATMENTS);
        return medicalSurvey;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MedicalSurvey createUpdatedEntity(EntityManager em) {
        MedicalSurvey medicalSurvey = new MedicalSurvey()
            .ongoingIllnesses(UPDATED_ONGOING_ILLNESSES)
            .ongoingTreatments(UPDATED_ONGOING_TREATMENTS);
        return medicalSurvey;
    }

    @BeforeEach
    public void initTest() {
        medicalSurvey = createEntity(em);
    }

    @Test
    @Transactional
    void createMedicalSurvey() throws Exception {
        int databaseSizeBeforeCreate = medicalSurveyRepository.findAll().size();
        // Create the MedicalSurvey
        restMedicalSurveyMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(medicalSurvey)))
            .andExpect(status().isCreated());

        // Validate the MedicalSurvey in the database
        List<MedicalSurvey> medicalSurveyList = medicalSurveyRepository.findAll();
        assertThat(medicalSurveyList).hasSize(databaseSizeBeforeCreate + 1);
        MedicalSurvey testMedicalSurvey = medicalSurveyList.get(medicalSurveyList.size() - 1);
        assertThat(testMedicalSurvey.getOngoingIllnesses()).isEqualTo(DEFAULT_ONGOING_ILLNESSES);
        assertThat(testMedicalSurvey.getOngoingTreatments()).isEqualTo(DEFAULT_ONGOING_TREATMENTS);
    }

    @Test
    @Transactional
    void createMedicalSurveyWithExistingId() throws Exception {
        // Create the MedicalSurvey with an existing ID
        medicalSurvey.setId(1L);

        int databaseSizeBeforeCreate = medicalSurveyRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMedicalSurveyMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(medicalSurvey)))
            .andExpect(status().isBadRequest());

        // Validate the MedicalSurvey in the database
        List<MedicalSurvey> medicalSurveyList = medicalSurveyRepository.findAll();
        assertThat(medicalSurveyList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMedicalSurveys() throws Exception {
        // Initialize the database
        medicalSurveyRepository.saveAndFlush(medicalSurvey);

        // Get all the medicalSurveyList
        restMedicalSurveyMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(medicalSurvey.getId().intValue())))
            .andExpect(jsonPath("$.[*].ongoingIllnesses").value(hasItem(DEFAULT_ONGOING_ILLNESSES)))
            .andExpect(jsonPath("$.[*].ongoingTreatments").value(hasItem(DEFAULT_ONGOING_TREATMENTS)));
    }

    @Test
    @Transactional
    void getMedicalSurvey() throws Exception {
        // Initialize the database
        medicalSurveyRepository.saveAndFlush(medicalSurvey);

        // Get the medicalSurvey
        restMedicalSurveyMockMvc
            .perform(get(ENTITY_API_URL_ID, medicalSurvey.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(medicalSurvey.getId().intValue()))
            .andExpect(jsonPath("$.ongoingIllnesses").value(DEFAULT_ONGOING_ILLNESSES))
            .andExpect(jsonPath("$.ongoingTreatments").value(DEFAULT_ONGOING_TREATMENTS));
    }

    @Test
    @Transactional
    void getNonExistingMedicalSurvey() throws Exception {
        // Get the medicalSurvey
        restMedicalSurveyMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewMedicalSurvey() throws Exception {
        // Initialize the database
        medicalSurveyRepository.saveAndFlush(medicalSurvey);

        int databaseSizeBeforeUpdate = medicalSurveyRepository.findAll().size();

        // Update the medicalSurvey
        MedicalSurvey updatedMedicalSurvey = medicalSurveyRepository.findById(medicalSurvey.getId()).get();
        // Disconnect from session so that the updates on updatedMedicalSurvey are not directly saved in db
        em.detach(updatedMedicalSurvey);
        updatedMedicalSurvey.ongoingIllnesses(UPDATED_ONGOING_ILLNESSES).ongoingTreatments(UPDATED_ONGOING_TREATMENTS);

        restMedicalSurveyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMedicalSurvey.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMedicalSurvey))
            )
            .andExpect(status().isOk());

        // Validate the MedicalSurvey in the database
        List<MedicalSurvey> medicalSurveyList = medicalSurveyRepository.findAll();
        assertThat(medicalSurveyList).hasSize(databaseSizeBeforeUpdate);
        MedicalSurvey testMedicalSurvey = medicalSurveyList.get(medicalSurveyList.size() - 1);
        assertThat(testMedicalSurvey.getOngoingIllnesses()).isEqualTo(UPDATED_ONGOING_ILLNESSES);
        assertThat(testMedicalSurvey.getOngoingTreatments()).isEqualTo(UPDATED_ONGOING_TREATMENTS);
    }

    @Test
    @Transactional
    void putNonExistingMedicalSurvey() throws Exception {
        int databaseSizeBeforeUpdate = medicalSurveyRepository.findAll().size();
        medicalSurvey.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMedicalSurveyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, medicalSurvey.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(medicalSurvey))
            )
            .andExpect(status().isBadRequest());

        // Validate the MedicalSurvey in the database
        List<MedicalSurvey> medicalSurveyList = medicalSurveyRepository.findAll();
        assertThat(medicalSurveyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMedicalSurvey() throws Exception {
        int databaseSizeBeforeUpdate = medicalSurveyRepository.findAll().size();
        medicalSurvey.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMedicalSurveyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(medicalSurvey))
            )
            .andExpect(status().isBadRequest());

        // Validate the MedicalSurvey in the database
        List<MedicalSurvey> medicalSurveyList = medicalSurveyRepository.findAll();
        assertThat(medicalSurveyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMedicalSurvey() throws Exception {
        int databaseSizeBeforeUpdate = medicalSurveyRepository.findAll().size();
        medicalSurvey.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMedicalSurveyMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(medicalSurvey)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the MedicalSurvey in the database
        List<MedicalSurvey> medicalSurveyList = medicalSurveyRepository.findAll();
        assertThat(medicalSurveyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMedicalSurveyWithPatch() throws Exception {
        // Initialize the database
        medicalSurveyRepository.saveAndFlush(medicalSurvey);

        int databaseSizeBeforeUpdate = medicalSurveyRepository.findAll().size();

        // Update the medicalSurvey using partial update
        MedicalSurvey partialUpdatedMedicalSurvey = new MedicalSurvey();
        partialUpdatedMedicalSurvey.setId(medicalSurvey.getId());

        partialUpdatedMedicalSurvey.ongoingIllnesses(UPDATED_ONGOING_ILLNESSES).ongoingTreatments(UPDATED_ONGOING_TREATMENTS);

        restMedicalSurveyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMedicalSurvey.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMedicalSurvey))
            )
            .andExpect(status().isOk());

        // Validate the MedicalSurvey in the database
        List<MedicalSurvey> medicalSurveyList = medicalSurveyRepository.findAll();
        assertThat(medicalSurveyList).hasSize(databaseSizeBeforeUpdate);
        MedicalSurvey testMedicalSurvey = medicalSurveyList.get(medicalSurveyList.size() - 1);
        assertThat(testMedicalSurvey.getOngoingIllnesses()).isEqualTo(UPDATED_ONGOING_ILLNESSES);
        assertThat(testMedicalSurvey.getOngoingTreatments()).isEqualTo(UPDATED_ONGOING_TREATMENTS);
    }

    @Test
    @Transactional
    void fullUpdateMedicalSurveyWithPatch() throws Exception {
        // Initialize the database
        medicalSurveyRepository.saveAndFlush(medicalSurvey);

        int databaseSizeBeforeUpdate = medicalSurveyRepository.findAll().size();

        // Update the medicalSurvey using partial update
        MedicalSurvey partialUpdatedMedicalSurvey = new MedicalSurvey();
        partialUpdatedMedicalSurvey.setId(medicalSurvey.getId());

        partialUpdatedMedicalSurvey.ongoingIllnesses(UPDATED_ONGOING_ILLNESSES).ongoingTreatments(UPDATED_ONGOING_TREATMENTS);

        restMedicalSurveyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMedicalSurvey.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMedicalSurvey))
            )
            .andExpect(status().isOk());

        // Validate the MedicalSurvey in the database
        List<MedicalSurvey> medicalSurveyList = medicalSurveyRepository.findAll();
        assertThat(medicalSurveyList).hasSize(databaseSizeBeforeUpdate);
        MedicalSurvey testMedicalSurvey = medicalSurveyList.get(medicalSurveyList.size() - 1);
        assertThat(testMedicalSurvey.getOngoingIllnesses()).isEqualTo(UPDATED_ONGOING_ILLNESSES);
        assertThat(testMedicalSurvey.getOngoingTreatments()).isEqualTo(UPDATED_ONGOING_TREATMENTS);
    }

    @Test
    @Transactional
    void patchNonExistingMedicalSurvey() throws Exception {
        int databaseSizeBeforeUpdate = medicalSurveyRepository.findAll().size();
        medicalSurvey.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMedicalSurveyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, medicalSurvey.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(medicalSurvey))
            )
            .andExpect(status().isBadRequest());

        // Validate the MedicalSurvey in the database
        List<MedicalSurvey> medicalSurveyList = medicalSurveyRepository.findAll();
        assertThat(medicalSurveyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMedicalSurvey() throws Exception {
        int databaseSizeBeforeUpdate = medicalSurveyRepository.findAll().size();
        medicalSurvey.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMedicalSurveyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(medicalSurvey))
            )
            .andExpect(status().isBadRequest());

        // Validate the MedicalSurvey in the database
        List<MedicalSurvey> medicalSurveyList = medicalSurveyRepository.findAll();
        assertThat(medicalSurveyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMedicalSurvey() throws Exception {
        int databaseSizeBeforeUpdate = medicalSurveyRepository.findAll().size();
        medicalSurvey.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMedicalSurveyMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(medicalSurvey))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the MedicalSurvey in the database
        List<MedicalSurvey> medicalSurveyList = medicalSurveyRepository.findAll();
        assertThat(medicalSurveyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMedicalSurvey() throws Exception {
        // Initialize the database
        medicalSurveyRepository.saveAndFlush(medicalSurvey);

        int databaseSizeBeforeDelete = medicalSurveyRepository.findAll().size();

        // Delete the medicalSurvey
        restMedicalSurveyMockMvc
            .perform(delete(ENTITY_API_URL_ID, medicalSurvey.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<MedicalSurvey> medicalSurveyList = medicalSurveyRepository.findAll();
        assertThat(medicalSurveyList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
