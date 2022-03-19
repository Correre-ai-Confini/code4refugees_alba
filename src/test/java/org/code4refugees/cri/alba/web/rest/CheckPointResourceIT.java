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
import org.code4refugees.cri.alba.domain.CheckPoint;
import org.code4refugees.cri.alba.repository.CheckPointRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link CheckPointResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CheckPointResourceIT {

    private static final String DEFAULT_FRIENDLYNAME = "AAAAAAAAAA";
    private static final String UPDATED_FRIENDLYNAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/check-points";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CheckPointRepository checkPointRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCheckPointMockMvc;

    private CheckPoint checkPoint;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CheckPoint createEntity(EntityManager em) {
        CheckPoint checkPoint = new CheckPoint().friendlyname(DEFAULT_FRIENDLYNAME);
        return checkPoint;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CheckPoint createUpdatedEntity(EntityManager em) {
        CheckPoint checkPoint = new CheckPoint().friendlyname(UPDATED_FRIENDLYNAME);
        return checkPoint;
    }

    @BeforeEach
    public void initTest() {
        checkPoint = createEntity(em);
    }

    @Test
    @Transactional
    void createCheckPoint() throws Exception {
        int databaseSizeBeforeCreate = checkPointRepository.findAll().size();
        // Create the CheckPoint
        restCheckPointMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(checkPoint)))
            .andExpect(status().isCreated());

        // Validate the CheckPoint in the database
        List<CheckPoint> checkPointList = checkPointRepository.findAll();
        assertThat(checkPointList).hasSize(databaseSizeBeforeCreate + 1);
        CheckPoint testCheckPoint = checkPointList.get(checkPointList.size() - 1);
        assertThat(testCheckPoint.getFriendlyname()).isEqualTo(DEFAULT_FRIENDLYNAME);
    }

    @Test
    @Transactional
    void createCheckPointWithExistingId() throws Exception {
        // Create the CheckPoint with an existing ID
        checkPoint.setId(1L);

        int databaseSizeBeforeCreate = checkPointRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCheckPointMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(checkPoint)))
            .andExpect(status().isBadRequest());

        // Validate the CheckPoint in the database
        List<CheckPoint> checkPointList = checkPointRepository.findAll();
        assertThat(checkPointList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkFriendlynameIsRequired() throws Exception {
        int databaseSizeBeforeTest = checkPointRepository.findAll().size();
        // set the field null
        checkPoint.setFriendlyname(null);

        // Create the CheckPoint, which fails.

        restCheckPointMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(checkPoint)))
            .andExpect(status().isBadRequest());

        List<CheckPoint> checkPointList = checkPointRepository.findAll();
        assertThat(checkPointList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllCheckPoints() throws Exception {
        // Initialize the database
        checkPointRepository.saveAndFlush(checkPoint);

        // Get all the checkPointList
        restCheckPointMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(checkPoint.getId().intValue())))
            .andExpect(jsonPath("$.[*].friendlyname").value(hasItem(DEFAULT_FRIENDLYNAME)));
    }

    @Test
    @Transactional
    void getCheckPoint() throws Exception {
        // Initialize the database
        checkPointRepository.saveAndFlush(checkPoint);

        // Get the checkPoint
        restCheckPointMockMvc
            .perform(get(ENTITY_API_URL_ID, checkPoint.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(checkPoint.getId().intValue()))
            .andExpect(jsonPath("$.friendlyname").value(DEFAULT_FRIENDLYNAME));
    }

    @Test
    @Transactional
    void getNonExistingCheckPoint() throws Exception {
        // Get the checkPoint
        restCheckPointMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewCheckPoint() throws Exception {
        // Initialize the database
        checkPointRepository.saveAndFlush(checkPoint);

        int databaseSizeBeforeUpdate = checkPointRepository.findAll().size();

        // Update the checkPoint
        CheckPoint updatedCheckPoint = checkPointRepository.findById(checkPoint.getId()).get();
        // Disconnect from session so that the updates on updatedCheckPoint are not directly saved in db
        em.detach(updatedCheckPoint);
        updatedCheckPoint.friendlyname(UPDATED_FRIENDLYNAME);

        restCheckPointMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCheckPoint.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCheckPoint))
            )
            .andExpect(status().isOk());

        // Validate the CheckPoint in the database
        List<CheckPoint> checkPointList = checkPointRepository.findAll();
        assertThat(checkPointList).hasSize(databaseSizeBeforeUpdate);
        CheckPoint testCheckPoint = checkPointList.get(checkPointList.size() - 1);
        assertThat(testCheckPoint.getFriendlyname()).isEqualTo(UPDATED_FRIENDLYNAME);
    }

    @Test
    @Transactional
    void putNonExistingCheckPoint() throws Exception {
        int databaseSizeBeforeUpdate = checkPointRepository.findAll().size();
        checkPoint.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCheckPointMockMvc
            .perform(
                put(ENTITY_API_URL_ID, checkPoint.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(checkPoint))
            )
            .andExpect(status().isBadRequest());

        // Validate the CheckPoint in the database
        List<CheckPoint> checkPointList = checkPointRepository.findAll();
        assertThat(checkPointList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCheckPoint() throws Exception {
        int databaseSizeBeforeUpdate = checkPointRepository.findAll().size();
        checkPoint.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCheckPointMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(checkPoint))
            )
            .andExpect(status().isBadRequest());

        // Validate the CheckPoint in the database
        List<CheckPoint> checkPointList = checkPointRepository.findAll();
        assertThat(checkPointList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCheckPoint() throws Exception {
        int databaseSizeBeforeUpdate = checkPointRepository.findAll().size();
        checkPoint.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCheckPointMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(checkPoint)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the CheckPoint in the database
        List<CheckPoint> checkPointList = checkPointRepository.findAll();
        assertThat(checkPointList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCheckPointWithPatch() throws Exception {
        // Initialize the database
        checkPointRepository.saveAndFlush(checkPoint);

        int databaseSizeBeforeUpdate = checkPointRepository.findAll().size();

        // Update the checkPoint using partial update
        CheckPoint partialUpdatedCheckPoint = new CheckPoint();
        partialUpdatedCheckPoint.setId(checkPoint.getId());

        restCheckPointMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCheckPoint.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCheckPoint))
            )
            .andExpect(status().isOk());

        // Validate the CheckPoint in the database
        List<CheckPoint> checkPointList = checkPointRepository.findAll();
        assertThat(checkPointList).hasSize(databaseSizeBeforeUpdate);
        CheckPoint testCheckPoint = checkPointList.get(checkPointList.size() - 1);
        assertThat(testCheckPoint.getFriendlyname()).isEqualTo(DEFAULT_FRIENDLYNAME);
    }

    @Test
    @Transactional
    void fullUpdateCheckPointWithPatch() throws Exception {
        // Initialize the database
        checkPointRepository.saveAndFlush(checkPoint);

        int databaseSizeBeforeUpdate = checkPointRepository.findAll().size();

        // Update the checkPoint using partial update
        CheckPoint partialUpdatedCheckPoint = new CheckPoint();
        partialUpdatedCheckPoint.setId(checkPoint.getId());

        partialUpdatedCheckPoint.friendlyname(UPDATED_FRIENDLYNAME);

        restCheckPointMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCheckPoint.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCheckPoint))
            )
            .andExpect(status().isOk());

        // Validate the CheckPoint in the database
        List<CheckPoint> checkPointList = checkPointRepository.findAll();
        assertThat(checkPointList).hasSize(databaseSizeBeforeUpdate);
        CheckPoint testCheckPoint = checkPointList.get(checkPointList.size() - 1);
        assertThat(testCheckPoint.getFriendlyname()).isEqualTo(UPDATED_FRIENDLYNAME);
    }

    @Test
    @Transactional
    void patchNonExistingCheckPoint() throws Exception {
        int databaseSizeBeforeUpdate = checkPointRepository.findAll().size();
        checkPoint.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCheckPointMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, checkPoint.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(checkPoint))
            )
            .andExpect(status().isBadRequest());

        // Validate the CheckPoint in the database
        List<CheckPoint> checkPointList = checkPointRepository.findAll();
        assertThat(checkPointList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCheckPoint() throws Exception {
        int databaseSizeBeforeUpdate = checkPointRepository.findAll().size();
        checkPoint.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCheckPointMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(checkPoint))
            )
            .andExpect(status().isBadRequest());

        // Validate the CheckPoint in the database
        List<CheckPoint> checkPointList = checkPointRepository.findAll();
        assertThat(checkPointList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCheckPoint() throws Exception {
        int databaseSizeBeforeUpdate = checkPointRepository.findAll().size();
        checkPoint.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCheckPointMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(checkPoint))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CheckPoint in the database
        List<CheckPoint> checkPointList = checkPointRepository.findAll();
        assertThat(checkPointList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCheckPoint() throws Exception {
        // Initialize the database
        checkPointRepository.saveAndFlush(checkPoint);

        int databaseSizeBeforeDelete = checkPointRepository.findAll().size();

        // Delete the checkPoint
        restCheckPointMockMvc
            .perform(delete(ENTITY_API_URL_ID, checkPoint.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CheckPoint> checkPointList = checkPointRepository.findAll();
        assertThat(checkPointList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
