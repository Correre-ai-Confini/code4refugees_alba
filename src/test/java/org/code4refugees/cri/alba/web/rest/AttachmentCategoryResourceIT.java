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
import org.code4refugees.cri.alba.domain.AttachmentCategory;
import org.code4refugees.cri.alba.repository.AttachmentCategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link AttachmentCategoryResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AttachmentCategoryResourceIT {

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/attachment-categories";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AttachmentCategoryRepository attachmentCategoryRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAttachmentCategoryMockMvc;

    private AttachmentCategory attachmentCategory;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AttachmentCategory createEntity(EntityManager em) {
        AttachmentCategory attachmentCategory = new AttachmentCategory().description(DEFAULT_DESCRIPTION);
        return attachmentCategory;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AttachmentCategory createUpdatedEntity(EntityManager em) {
        AttachmentCategory attachmentCategory = new AttachmentCategory().description(UPDATED_DESCRIPTION);
        return attachmentCategory;
    }

    @BeforeEach
    public void initTest() {
        attachmentCategory = createEntity(em);
    }

    @Test
    @Transactional
    void createAttachmentCategory() throws Exception {
        int databaseSizeBeforeCreate = attachmentCategoryRepository.findAll().size();
        // Create the AttachmentCategory
        restAttachmentCategoryMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(attachmentCategory))
            )
            .andExpect(status().isCreated());

        // Validate the AttachmentCategory in the database
        List<AttachmentCategory> attachmentCategoryList = attachmentCategoryRepository.findAll();
        assertThat(attachmentCategoryList).hasSize(databaseSizeBeforeCreate + 1);
        AttachmentCategory testAttachmentCategory = attachmentCategoryList.get(attachmentCategoryList.size() - 1);
        assertThat(testAttachmentCategory.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createAttachmentCategoryWithExistingId() throws Exception {
        // Create the AttachmentCategory with an existing ID
        attachmentCategory.setId(1L);

        int databaseSizeBeforeCreate = attachmentCategoryRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAttachmentCategoryMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(attachmentCategory))
            )
            .andExpect(status().isBadRequest());

        // Validate the AttachmentCategory in the database
        List<AttachmentCategory> attachmentCategoryList = attachmentCategoryRepository.findAll();
        assertThat(attachmentCategoryList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAttachmentCategories() throws Exception {
        // Initialize the database
        attachmentCategoryRepository.saveAndFlush(attachmentCategory);

        // Get all the attachmentCategoryList
        restAttachmentCategoryMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(attachmentCategory.getId().intValue())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getAttachmentCategory() throws Exception {
        // Initialize the database
        attachmentCategoryRepository.saveAndFlush(attachmentCategory);

        // Get the attachmentCategory
        restAttachmentCategoryMockMvc
            .perform(get(ENTITY_API_URL_ID, attachmentCategory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(attachmentCategory.getId().intValue()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingAttachmentCategory() throws Exception {
        // Get the attachmentCategory
        restAttachmentCategoryMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAttachmentCategory() throws Exception {
        // Initialize the database
        attachmentCategoryRepository.saveAndFlush(attachmentCategory);

        int databaseSizeBeforeUpdate = attachmentCategoryRepository.findAll().size();

        // Update the attachmentCategory
        AttachmentCategory updatedAttachmentCategory = attachmentCategoryRepository.findById(attachmentCategory.getId()).get();
        // Disconnect from session so that the updates on updatedAttachmentCategory are not directly saved in db
        em.detach(updatedAttachmentCategory);
        updatedAttachmentCategory.description(UPDATED_DESCRIPTION);

        restAttachmentCategoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAttachmentCategory.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAttachmentCategory))
            )
            .andExpect(status().isOk());

        // Validate the AttachmentCategory in the database
        List<AttachmentCategory> attachmentCategoryList = attachmentCategoryRepository.findAll();
        assertThat(attachmentCategoryList).hasSize(databaseSizeBeforeUpdate);
        AttachmentCategory testAttachmentCategory = attachmentCategoryList.get(attachmentCategoryList.size() - 1);
        assertThat(testAttachmentCategory.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingAttachmentCategory() throws Exception {
        int databaseSizeBeforeUpdate = attachmentCategoryRepository.findAll().size();
        attachmentCategory.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAttachmentCategoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, attachmentCategory.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(attachmentCategory))
            )
            .andExpect(status().isBadRequest());

        // Validate the AttachmentCategory in the database
        List<AttachmentCategory> attachmentCategoryList = attachmentCategoryRepository.findAll();
        assertThat(attachmentCategoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAttachmentCategory() throws Exception {
        int databaseSizeBeforeUpdate = attachmentCategoryRepository.findAll().size();
        attachmentCategory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAttachmentCategoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(attachmentCategory))
            )
            .andExpect(status().isBadRequest());

        // Validate the AttachmentCategory in the database
        List<AttachmentCategory> attachmentCategoryList = attachmentCategoryRepository.findAll();
        assertThat(attachmentCategoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAttachmentCategory() throws Exception {
        int databaseSizeBeforeUpdate = attachmentCategoryRepository.findAll().size();
        attachmentCategory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAttachmentCategoryMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(attachmentCategory))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AttachmentCategory in the database
        List<AttachmentCategory> attachmentCategoryList = attachmentCategoryRepository.findAll();
        assertThat(attachmentCategoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAttachmentCategoryWithPatch() throws Exception {
        // Initialize the database
        attachmentCategoryRepository.saveAndFlush(attachmentCategory);

        int databaseSizeBeforeUpdate = attachmentCategoryRepository.findAll().size();

        // Update the attachmentCategory using partial update
        AttachmentCategory partialUpdatedAttachmentCategory = new AttachmentCategory();
        partialUpdatedAttachmentCategory.setId(attachmentCategory.getId());

        partialUpdatedAttachmentCategory.description(UPDATED_DESCRIPTION);

        restAttachmentCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAttachmentCategory.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAttachmentCategory))
            )
            .andExpect(status().isOk());

        // Validate the AttachmentCategory in the database
        List<AttachmentCategory> attachmentCategoryList = attachmentCategoryRepository.findAll();
        assertThat(attachmentCategoryList).hasSize(databaseSizeBeforeUpdate);
        AttachmentCategory testAttachmentCategory = attachmentCategoryList.get(attachmentCategoryList.size() - 1);
        assertThat(testAttachmentCategory.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateAttachmentCategoryWithPatch() throws Exception {
        // Initialize the database
        attachmentCategoryRepository.saveAndFlush(attachmentCategory);

        int databaseSizeBeforeUpdate = attachmentCategoryRepository.findAll().size();

        // Update the attachmentCategory using partial update
        AttachmentCategory partialUpdatedAttachmentCategory = new AttachmentCategory();
        partialUpdatedAttachmentCategory.setId(attachmentCategory.getId());

        partialUpdatedAttachmentCategory.description(UPDATED_DESCRIPTION);

        restAttachmentCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAttachmentCategory.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAttachmentCategory))
            )
            .andExpect(status().isOk());

        // Validate the AttachmentCategory in the database
        List<AttachmentCategory> attachmentCategoryList = attachmentCategoryRepository.findAll();
        assertThat(attachmentCategoryList).hasSize(databaseSizeBeforeUpdate);
        AttachmentCategory testAttachmentCategory = attachmentCategoryList.get(attachmentCategoryList.size() - 1);
        assertThat(testAttachmentCategory.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingAttachmentCategory() throws Exception {
        int databaseSizeBeforeUpdate = attachmentCategoryRepository.findAll().size();
        attachmentCategory.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAttachmentCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, attachmentCategory.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(attachmentCategory))
            )
            .andExpect(status().isBadRequest());

        // Validate the AttachmentCategory in the database
        List<AttachmentCategory> attachmentCategoryList = attachmentCategoryRepository.findAll();
        assertThat(attachmentCategoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAttachmentCategory() throws Exception {
        int databaseSizeBeforeUpdate = attachmentCategoryRepository.findAll().size();
        attachmentCategory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAttachmentCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(attachmentCategory))
            )
            .andExpect(status().isBadRequest());

        // Validate the AttachmentCategory in the database
        List<AttachmentCategory> attachmentCategoryList = attachmentCategoryRepository.findAll();
        assertThat(attachmentCategoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAttachmentCategory() throws Exception {
        int databaseSizeBeforeUpdate = attachmentCategoryRepository.findAll().size();
        attachmentCategory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAttachmentCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(attachmentCategory))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AttachmentCategory in the database
        List<AttachmentCategory> attachmentCategoryList = attachmentCategoryRepository.findAll();
        assertThat(attachmentCategoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAttachmentCategory() throws Exception {
        // Initialize the database
        attachmentCategoryRepository.saveAndFlush(attachmentCategory);

        int databaseSizeBeforeDelete = attachmentCategoryRepository.findAll().size();

        // Delete the attachmentCategory
        restAttachmentCategoryMockMvc
            .perform(delete(ENTITY_API_URL_ID, attachmentCategory.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AttachmentCategory> attachmentCategoryList = attachmentCategoryRepository.findAll();
        assertThat(attachmentCategoryList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
