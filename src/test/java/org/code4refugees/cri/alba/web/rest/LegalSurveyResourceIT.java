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
import org.code4refugees.cri.alba.domain.LegalSurvey;
import org.code4refugees.cri.alba.repository.LegalSurveyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link LegalSurveyResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LegalSurveyResourceIT {

    private static final String DEFAULT_NOTES = "AAAAAAAAAA";
    private static final String UPDATED_NOTES = "BBBBBBBBBB";

    private static final String DEFAULT_ISSUES = "AAAAAAAAAA";
    private static final String UPDATED_ISSUES = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/legal-surveys";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LegalSurveyRepository legalSurveyRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLegalSurveyMockMvc;

    private LegalSurvey legalSurvey;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LegalSurvey createEntity(EntityManager em) {
        LegalSurvey legalSurvey = new LegalSurvey().notes(DEFAULT_NOTES).issues(DEFAULT_ISSUES);
        return legalSurvey;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LegalSurvey createUpdatedEntity(EntityManager em) {
        LegalSurvey legalSurvey = new LegalSurvey().notes(UPDATED_NOTES).issues(UPDATED_ISSUES);
        return legalSurvey;
    }

    @BeforeEach
    public void initTest() {
        legalSurvey = createEntity(em);
    }

    @Test
    @Transactional
    void createLegalSurvey() throws Exception {
        int databaseSizeBeforeCreate = legalSurveyRepository.findAll().size();
        // Create the LegalSurvey
        restLegalSurveyMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(legalSurvey)))
            .andExpect(status().isCreated());

        // Validate the LegalSurvey in the database
        List<LegalSurvey> legalSurveyList = legalSurveyRepository.findAll();
        assertThat(legalSurveyList).hasSize(databaseSizeBeforeCreate + 1);
        LegalSurvey testLegalSurvey = legalSurveyList.get(legalSurveyList.size() - 1);
        assertThat(testLegalSurvey.getNotes()).isEqualTo(DEFAULT_NOTES);
        assertThat(testLegalSurvey.getIssues()).isEqualTo(DEFAULT_ISSUES);
    }

    @Test
    @Transactional
    void createLegalSurveyWithExistingId() throws Exception {
        // Create the LegalSurvey with an existing ID
        legalSurvey.setId(1L);

        int databaseSizeBeforeCreate = legalSurveyRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLegalSurveyMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(legalSurvey)))
            .andExpect(status().isBadRequest());

        // Validate the LegalSurvey in the database
        List<LegalSurvey> legalSurveyList = legalSurveyRepository.findAll();
        assertThat(legalSurveyList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllLegalSurveys() throws Exception {
        // Initialize the database
        legalSurveyRepository.saveAndFlush(legalSurvey);

        // Get all the legalSurveyList
        restLegalSurveyMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(legalSurvey.getId().intValue())))
            .andExpect(jsonPath("$.[*].notes").value(hasItem(DEFAULT_NOTES)))
            .andExpect(jsonPath("$.[*].issues").value(hasItem(DEFAULT_ISSUES)));
    }

    @Test
    @Transactional
    void getLegalSurvey() throws Exception {
        // Initialize the database
        legalSurveyRepository.saveAndFlush(legalSurvey);

        // Get the legalSurvey
        restLegalSurveyMockMvc
            .perform(get(ENTITY_API_URL_ID, legalSurvey.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(legalSurvey.getId().intValue()))
            .andExpect(jsonPath("$.notes").value(DEFAULT_NOTES))
            .andExpect(jsonPath("$.issues").value(DEFAULT_ISSUES));
    }

    @Test
    @Transactional
    void getNonExistingLegalSurvey() throws Exception {
        // Get the legalSurvey
        restLegalSurveyMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewLegalSurvey() throws Exception {
        // Initialize the database
        legalSurveyRepository.saveAndFlush(legalSurvey);

        int databaseSizeBeforeUpdate = legalSurveyRepository.findAll().size();

        // Update the legalSurvey
        LegalSurvey updatedLegalSurvey = legalSurveyRepository.findById(legalSurvey.getId()).get();
        // Disconnect from session so that the updates on updatedLegalSurvey are not directly saved in db
        em.detach(updatedLegalSurvey);
        updatedLegalSurvey.notes(UPDATED_NOTES).issues(UPDATED_ISSUES);

        restLegalSurveyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLegalSurvey.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLegalSurvey))
            )
            .andExpect(status().isOk());

        // Validate the LegalSurvey in the database
        List<LegalSurvey> legalSurveyList = legalSurveyRepository.findAll();
        assertThat(legalSurveyList).hasSize(databaseSizeBeforeUpdate);
        LegalSurvey testLegalSurvey = legalSurveyList.get(legalSurveyList.size() - 1);
        assertThat(testLegalSurvey.getNotes()).isEqualTo(UPDATED_NOTES);
        assertThat(testLegalSurvey.getIssues()).isEqualTo(UPDATED_ISSUES);
    }

    @Test
    @Transactional
    void putNonExistingLegalSurvey() throws Exception {
        int databaseSizeBeforeUpdate = legalSurveyRepository.findAll().size();
        legalSurvey.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLegalSurveyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, legalSurvey.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(legalSurvey))
            )
            .andExpect(status().isBadRequest());

        // Validate the LegalSurvey in the database
        List<LegalSurvey> legalSurveyList = legalSurveyRepository.findAll();
        assertThat(legalSurveyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLegalSurvey() throws Exception {
        int databaseSizeBeforeUpdate = legalSurveyRepository.findAll().size();
        legalSurvey.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLegalSurveyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(legalSurvey))
            )
            .andExpect(status().isBadRequest());

        // Validate the LegalSurvey in the database
        List<LegalSurvey> legalSurveyList = legalSurveyRepository.findAll();
        assertThat(legalSurveyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLegalSurvey() throws Exception {
        int databaseSizeBeforeUpdate = legalSurveyRepository.findAll().size();
        legalSurvey.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLegalSurveyMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(legalSurvey)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the LegalSurvey in the database
        List<LegalSurvey> legalSurveyList = legalSurveyRepository.findAll();
        assertThat(legalSurveyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLegalSurveyWithPatch() throws Exception {
        // Initialize the database
        legalSurveyRepository.saveAndFlush(legalSurvey);

        int databaseSizeBeforeUpdate = legalSurveyRepository.findAll().size();

        // Update the legalSurvey using partial update
        LegalSurvey partialUpdatedLegalSurvey = new LegalSurvey();
        partialUpdatedLegalSurvey.setId(legalSurvey.getId());

        partialUpdatedLegalSurvey.notes(UPDATED_NOTES).issues(UPDATED_ISSUES);

        restLegalSurveyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLegalSurvey.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLegalSurvey))
            )
            .andExpect(status().isOk());

        // Validate the LegalSurvey in the database
        List<LegalSurvey> legalSurveyList = legalSurveyRepository.findAll();
        assertThat(legalSurveyList).hasSize(databaseSizeBeforeUpdate);
        LegalSurvey testLegalSurvey = legalSurveyList.get(legalSurveyList.size() - 1);
        assertThat(testLegalSurvey.getNotes()).isEqualTo(UPDATED_NOTES);
        assertThat(testLegalSurvey.getIssues()).isEqualTo(UPDATED_ISSUES);
    }

    @Test
    @Transactional
    void fullUpdateLegalSurveyWithPatch() throws Exception {
        // Initialize the database
        legalSurveyRepository.saveAndFlush(legalSurvey);

        int databaseSizeBeforeUpdate = legalSurveyRepository.findAll().size();

        // Update the legalSurvey using partial update
        LegalSurvey partialUpdatedLegalSurvey = new LegalSurvey();
        partialUpdatedLegalSurvey.setId(legalSurvey.getId());

        partialUpdatedLegalSurvey.notes(UPDATED_NOTES).issues(UPDATED_ISSUES);

        restLegalSurveyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLegalSurvey.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLegalSurvey))
            )
            .andExpect(status().isOk());

        // Validate the LegalSurvey in the database
        List<LegalSurvey> legalSurveyList = legalSurveyRepository.findAll();
        assertThat(legalSurveyList).hasSize(databaseSizeBeforeUpdate);
        LegalSurvey testLegalSurvey = legalSurveyList.get(legalSurveyList.size() - 1);
        assertThat(testLegalSurvey.getNotes()).isEqualTo(UPDATED_NOTES);
        assertThat(testLegalSurvey.getIssues()).isEqualTo(UPDATED_ISSUES);
    }

    @Test
    @Transactional
    void patchNonExistingLegalSurvey() throws Exception {
        int databaseSizeBeforeUpdate = legalSurveyRepository.findAll().size();
        legalSurvey.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLegalSurveyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, legalSurvey.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(legalSurvey))
            )
            .andExpect(status().isBadRequest());

        // Validate the LegalSurvey in the database
        List<LegalSurvey> legalSurveyList = legalSurveyRepository.findAll();
        assertThat(legalSurveyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLegalSurvey() throws Exception {
        int databaseSizeBeforeUpdate = legalSurveyRepository.findAll().size();
        legalSurvey.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLegalSurveyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(legalSurvey))
            )
            .andExpect(status().isBadRequest());

        // Validate the LegalSurvey in the database
        List<LegalSurvey> legalSurveyList = legalSurveyRepository.findAll();
        assertThat(legalSurveyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLegalSurvey() throws Exception {
        int databaseSizeBeforeUpdate = legalSurveyRepository.findAll().size();
        legalSurvey.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLegalSurveyMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(legalSurvey))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the LegalSurvey in the database
        List<LegalSurvey> legalSurveyList = legalSurveyRepository.findAll();
        assertThat(legalSurveyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLegalSurvey() throws Exception {
        // Initialize the database
        legalSurveyRepository.saveAndFlush(legalSurvey);

        int databaseSizeBeforeDelete = legalSurveyRepository.findAll().size();

        // Delete the legalSurvey
        restLegalSurveyMockMvc
            .perform(delete(ENTITY_API_URL_ID, legalSurvey.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<LegalSurvey> legalSurveyList = legalSurveyRepository.findAll();
        assertThat(legalSurveyList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
