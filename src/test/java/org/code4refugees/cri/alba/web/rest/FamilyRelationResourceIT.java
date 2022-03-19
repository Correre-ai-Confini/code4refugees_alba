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
import org.code4refugees.cri.alba.domain.FamilyRelation;
import org.code4refugees.cri.alba.domain.enumeration.FamilyRelationType;
import org.code4refugees.cri.alba.repository.FamilyRelationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link FamilyRelationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FamilyRelationResourceIT {

    private static final String DEFAULT_NOTES = "AAAAAAAAAA";
    private static final String UPDATED_NOTES = "BBBBBBBBBB";

    private static final FamilyRelationType DEFAULT_REL_TYPE = FamilyRelationType.SON;
    private static final FamilyRelationType UPDATED_REL_TYPE = FamilyRelationType.NEPHEW;

    private static final String ENTITY_API_URL = "/api/family-relations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FamilyRelationRepository familyRelationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFamilyRelationMockMvc;

    private FamilyRelation familyRelation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FamilyRelation createEntity(EntityManager em) {
        FamilyRelation familyRelation = new FamilyRelation().notes(DEFAULT_NOTES).relType(DEFAULT_REL_TYPE);
        return familyRelation;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FamilyRelation createUpdatedEntity(EntityManager em) {
        FamilyRelation familyRelation = new FamilyRelation().notes(UPDATED_NOTES).relType(UPDATED_REL_TYPE);
        return familyRelation;
    }

    @BeforeEach
    public void initTest() {
        familyRelation = createEntity(em);
    }

    @Test
    @Transactional
    void createFamilyRelation() throws Exception {
        int databaseSizeBeforeCreate = familyRelationRepository.findAll().size();
        // Create the FamilyRelation
        restFamilyRelationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(familyRelation))
            )
            .andExpect(status().isCreated());

        // Validate the FamilyRelation in the database
        List<FamilyRelation> familyRelationList = familyRelationRepository.findAll();
        assertThat(familyRelationList).hasSize(databaseSizeBeforeCreate + 1);
        FamilyRelation testFamilyRelation = familyRelationList.get(familyRelationList.size() - 1);
        assertThat(testFamilyRelation.getNotes()).isEqualTo(DEFAULT_NOTES);
        assertThat(testFamilyRelation.getRelType()).isEqualTo(DEFAULT_REL_TYPE);
    }

    @Test
    @Transactional
    void createFamilyRelationWithExistingId() throws Exception {
        // Create the FamilyRelation with an existing ID
        familyRelation.setId(1L);

        int databaseSizeBeforeCreate = familyRelationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFamilyRelationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(familyRelation))
            )
            .andExpect(status().isBadRequest());

        // Validate the FamilyRelation in the database
        List<FamilyRelation> familyRelationList = familyRelationRepository.findAll();
        assertThat(familyRelationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllFamilyRelations() throws Exception {
        // Initialize the database
        familyRelationRepository.saveAndFlush(familyRelation);

        // Get all the familyRelationList
        restFamilyRelationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(familyRelation.getId().intValue())))
            .andExpect(jsonPath("$.[*].notes").value(hasItem(DEFAULT_NOTES)))
            .andExpect(jsonPath("$.[*].relType").value(hasItem(DEFAULT_REL_TYPE.toString())));
    }

    @Test
    @Transactional
    void getFamilyRelation() throws Exception {
        // Initialize the database
        familyRelationRepository.saveAndFlush(familyRelation);

        // Get the familyRelation
        restFamilyRelationMockMvc
            .perform(get(ENTITY_API_URL_ID, familyRelation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(familyRelation.getId().intValue()))
            .andExpect(jsonPath("$.notes").value(DEFAULT_NOTES))
            .andExpect(jsonPath("$.relType").value(DEFAULT_REL_TYPE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingFamilyRelation() throws Exception {
        // Get the familyRelation
        restFamilyRelationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewFamilyRelation() throws Exception {
        // Initialize the database
        familyRelationRepository.saveAndFlush(familyRelation);

        int databaseSizeBeforeUpdate = familyRelationRepository.findAll().size();

        // Update the familyRelation
        FamilyRelation updatedFamilyRelation = familyRelationRepository.findById(familyRelation.getId()).get();
        // Disconnect from session so that the updates on updatedFamilyRelation are not directly saved in db
        em.detach(updatedFamilyRelation);
        updatedFamilyRelation.notes(UPDATED_NOTES).relType(UPDATED_REL_TYPE);

        restFamilyRelationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFamilyRelation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFamilyRelation))
            )
            .andExpect(status().isOk());

        // Validate the FamilyRelation in the database
        List<FamilyRelation> familyRelationList = familyRelationRepository.findAll();
        assertThat(familyRelationList).hasSize(databaseSizeBeforeUpdate);
        FamilyRelation testFamilyRelation = familyRelationList.get(familyRelationList.size() - 1);
        assertThat(testFamilyRelation.getNotes()).isEqualTo(UPDATED_NOTES);
        assertThat(testFamilyRelation.getRelType()).isEqualTo(UPDATED_REL_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingFamilyRelation() throws Exception {
        int databaseSizeBeforeUpdate = familyRelationRepository.findAll().size();
        familyRelation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFamilyRelationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, familyRelation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(familyRelation))
            )
            .andExpect(status().isBadRequest());

        // Validate the FamilyRelation in the database
        List<FamilyRelation> familyRelationList = familyRelationRepository.findAll();
        assertThat(familyRelationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFamilyRelation() throws Exception {
        int databaseSizeBeforeUpdate = familyRelationRepository.findAll().size();
        familyRelation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFamilyRelationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(familyRelation))
            )
            .andExpect(status().isBadRequest());

        // Validate the FamilyRelation in the database
        List<FamilyRelation> familyRelationList = familyRelationRepository.findAll();
        assertThat(familyRelationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFamilyRelation() throws Exception {
        int databaseSizeBeforeUpdate = familyRelationRepository.findAll().size();
        familyRelation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFamilyRelationMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(familyRelation)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the FamilyRelation in the database
        List<FamilyRelation> familyRelationList = familyRelationRepository.findAll();
        assertThat(familyRelationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFamilyRelationWithPatch() throws Exception {
        // Initialize the database
        familyRelationRepository.saveAndFlush(familyRelation);

        int databaseSizeBeforeUpdate = familyRelationRepository.findAll().size();

        // Update the familyRelation using partial update
        FamilyRelation partialUpdatedFamilyRelation = new FamilyRelation();
        partialUpdatedFamilyRelation.setId(familyRelation.getId());

        partialUpdatedFamilyRelation.relType(UPDATED_REL_TYPE);

        restFamilyRelationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFamilyRelation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFamilyRelation))
            )
            .andExpect(status().isOk());

        // Validate the FamilyRelation in the database
        List<FamilyRelation> familyRelationList = familyRelationRepository.findAll();
        assertThat(familyRelationList).hasSize(databaseSizeBeforeUpdate);
        FamilyRelation testFamilyRelation = familyRelationList.get(familyRelationList.size() - 1);
        assertThat(testFamilyRelation.getNotes()).isEqualTo(DEFAULT_NOTES);
        assertThat(testFamilyRelation.getRelType()).isEqualTo(UPDATED_REL_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateFamilyRelationWithPatch() throws Exception {
        // Initialize the database
        familyRelationRepository.saveAndFlush(familyRelation);

        int databaseSizeBeforeUpdate = familyRelationRepository.findAll().size();

        // Update the familyRelation using partial update
        FamilyRelation partialUpdatedFamilyRelation = new FamilyRelation();
        partialUpdatedFamilyRelation.setId(familyRelation.getId());

        partialUpdatedFamilyRelation.notes(UPDATED_NOTES).relType(UPDATED_REL_TYPE);

        restFamilyRelationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFamilyRelation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFamilyRelation))
            )
            .andExpect(status().isOk());

        // Validate the FamilyRelation in the database
        List<FamilyRelation> familyRelationList = familyRelationRepository.findAll();
        assertThat(familyRelationList).hasSize(databaseSizeBeforeUpdate);
        FamilyRelation testFamilyRelation = familyRelationList.get(familyRelationList.size() - 1);
        assertThat(testFamilyRelation.getNotes()).isEqualTo(UPDATED_NOTES);
        assertThat(testFamilyRelation.getRelType()).isEqualTo(UPDATED_REL_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingFamilyRelation() throws Exception {
        int databaseSizeBeforeUpdate = familyRelationRepository.findAll().size();
        familyRelation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFamilyRelationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, familyRelation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(familyRelation))
            )
            .andExpect(status().isBadRequest());

        // Validate the FamilyRelation in the database
        List<FamilyRelation> familyRelationList = familyRelationRepository.findAll();
        assertThat(familyRelationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFamilyRelation() throws Exception {
        int databaseSizeBeforeUpdate = familyRelationRepository.findAll().size();
        familyRelation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFamilyRelationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(familyRelation))
            )
            .andExpect(status().isBadRequest());

        // Validate the FamilyRelation in the database
        List<FamilyRelation> familyRelationList = familyRelationRepository.findAll();
        assertThat(familyRelationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFamilyRelation() throws Exception {
        int databaseSizeBeforeUpdate = familyRelationRepository.findAll().size();
        familyRelation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFamilyRelationMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(familyRelation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FamilyRelation in the database
        List<FamilyRelation> familyRelationList = familyRelationRepository.findAll();
        assertThat(familyRelationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFamilyRelation() throws Exception {
        // Initialize the database
        familyRelationRepository.saveAndFlush(familyRelation);

        int databaseSizeBeforeDelete = familyRelationRepository.findAll().size();

        // Delete the familyRelation
        restFamilyRelationMockMvc
            .perform(delete(ENTITY_API_URL_ID, familyRelation.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<FamilyRelation> familyRelationList = familyRelationRepository.findAll();
        assertThat(familyRelationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
