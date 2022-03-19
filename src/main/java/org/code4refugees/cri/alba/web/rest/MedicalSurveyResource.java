package org.code4refugees.cri.alba.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.code4refugees.cri.alba.domain.MedicalSurvey;
import org.code4refugees.cri.alba.repository.MedicalSurveyRepository;
import org.code4refugees.cri.alba.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link org.code4refugees.cri.alba.domain.MedicalSurvey}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MedicalSurveyResource {

    private final Logger log = LoggerFactory.getLogger(MedicalSurveyResource.class);

    private static final String ENTITY_NAME = "medicalSurvey";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MedicalSurveyRepository medicalSurveyRepository;

    public MedicalSurveyResource(MedicalSurveyRepository medicalSurveyRepository) {
        this.medicalSurveyRepository = medicalSurveyRepository;
    }

    /**
     * {@code POST  /medical-surveys} : Create a new medicalSurvey.
     *
     * @param medicalSurvey the medicalSurvey to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new medicalSurvey, or with status {@code 400 (Bad Request)} if the medicalSurvey has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/medical-surveys")
    public ResponseEntity<MedicalSurvey> createMedicalSurvey(@RequestBody MedicalSurvey medicalSurvey) throws URISyntaxException {
        log.debug("REST request to save MedicalSurvey : {}", medicalSurvey);
        if (medicalSurvey.getId() != null) {
            throw new BadRequestAlertException("A new medicalSurvey cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MedicalSurvey result = medicalSurveyRepository.save(medicalSurvey);
        return ResponseEntity
            .created(new URI("/api/medical-surveys/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /medical-surveys/:id} : Updates an existing medicalSurvey.
     *
     * @param id the id of the medicalSurvey to save.
     * @param medicalSurvey the medicalSurvey to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated medicalSurvey,
     * or with status {@code 400 (Bad Request)} if the medicalSurvey is not valid,
     * or with status {@code 500 (Internal Server Error)} if the medicalSurvey couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/medical-surveys/{id}")
    public ResponseEntity<MedicalSurvey> updateMedicalSurvey(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody MedicalSurvey medicalSurvey
    ) throws URISyntaxException {
        log.debug("REST request to update MedicalSurvey : {}, {}", id, medicalSurvey);
        if (medicalSurvey.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, medicalSurvey.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!medicalSurveyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        MedicalSurvey result = medicalSurveyRepository.save(medicalSurvey);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, medicalSurvey.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /medical-surveys/:id} : Partial updates given fields of an existing medicalSurvey, field will ignore if it is null
     *
     * @param id the id of the medicalSurvey to save.
     * @param medicalSurvey the medicalSurvey to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated medicalSurvey,
     * or with status {@code 400 (Bad Request)} if the medicalSurvey is not valid,
     * or with status {@code 404 (Not Found)} if the medicalSurvey is not found,
     * or with status {@code 500 (Internal Server Error)} if the medicalSurvey couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/medical-surveys/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<MedicalSurvey> partialUpdateMedicalSurvey(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody MedicalSurvey medicalSurvey
    ) throws URISyntaxException {
        log.debug("REST request to partial update MedicalSurvey partially : {}, {}", id, medicalSurvey);
        if (medicalSurvey.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, medicalSurvey.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!medicalSurveyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<MedicalSurvey> result = medicalSurveyRepository
            .findById(medicalSurvey.getId())
            .map(existingMedicalSurvey -> {
                if (medicalSurvey.getOngoingIllnesses() != null) {
                    existingMedicalSurvey.setOngoingIllnesses(medicalSurvey.getOngoingIllnesses());
                }
                if (medicalSurvey.getOngoingTreatments() != null) {
                    existingMedicalSurvey.setOngoingTreatments(medicalSurvey.getOngoingTreatments());
                }

                return existingMedicalSurvey;
            })
            .map(medicalSurveyRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, medicalSurvey.getId().toString())
        );
    }

    /**
     * {@code GET  /medical-surveys} : get all the medicalSurveys.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of medicalSurveys in body.
     */
    @GetMapping("/medical-surveys")
    public List<MedicalSurvey> getAllMedicalSurveys() {
        log.debug("REST request to get all MedicalSurveys");
        return medicalSurveyRepository.findAll();
    }

    /**
     * {@code GET  /medical-surveys/:id} : get the "id" medicalSurvey.
     *
     * @param id the id of the medicalSurvey to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the medicalSurvey, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/medical-surveys/{id}")
    public ResponseEntity<MedicalSurvey> getMedicalSurvey(@PathVariable Long id) {
        log.debug("REST request to get MedicalSurvey : {}", id);
        Optional<MedicalSurvey> medicalSurvey = medicalSurveyRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(medicalSurvey);
    }

    /**
     * {@code DELETE  /medical-surveys/:id} : delete the "id" medicalSurvey.
     *
     * @param id the id of the medicalSurvey to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/medical-surveys/{id}")
    public ResponseEntity<Void> deleteMedicalSurvey(@PathVariable Long id) {
        log.debug("REST request to delete MedicalSurvey : {}", id);
        medicalSurveyRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
