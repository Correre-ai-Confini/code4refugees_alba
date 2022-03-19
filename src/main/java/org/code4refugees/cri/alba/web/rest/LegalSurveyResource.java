package org.code4refugees.cri.alba.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.code4refugees.cri.alba.domain.LegalSurvey;
import org.code4refugees.cri.alba.repository.LegalSurveyRepository;
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
 * REST controller for managing {@link org.code4refugees.cri.alba.domain.LegalSurvey}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class LegalSurveyResource {

    private final Logger log = LoggerFactory.getLogger(LegalSurveyResource.class);

    private static final String ENTITY_NAME = "legalSurvey";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LegalSurveyRepository legalSurveyRepository;

    public LegalSurveyResource(LegalSurveyRepository legalSurveyRepository) {
        this.legalSurveyRepository = legalSurveyRepository;
    }

    /**
     * {@code POST  /legal-surveys} : Create a new legalSurvey.
     *
     * @param legalSurvey the legalSurvey to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new legalSurvey, or with status {@code 400 (Bad Request)} if the legalSurvey has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/legal-surveys")
    public ResponseEntity<LegalSurvey> createLegalSurvey(@RequestBody LegalSurvey legalSurvey) throws URISyntaxException {
        log.debug("REST request to save LegalSurvey : {}", legalSurvey);
        if (legalSurvey.getId() != null) {
            throw new BadRequestAlertException("A new legalSurvey cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LegalSurvey result = legalSurveyRepository.save(legalSurvey);
        return ResponseEntity
            .created(new URI("/api/legal-surveys/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /legal-surveys/:id} : Updates an existing legalSurvey.
     *
     * @param id the id of the legalSurvey to save.
     * @param legalSurvey the legalSurvey to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated legalSurvey,
     * or with status {@code 400 (Bad Request)} if the legalSurvey is not valid,
     * or with status {@code 500 (Internal Server Error)} if the legalSurvey couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/legal-surveys/{id}")
    public ResponseEntity<LegalSurvey> updateLegalSurvey(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody LegalSurvey legalSurvey
    ) throws URISyntaxException {
        log.debug("REST request to update LegalSurvey : {}, {}", id, legalSurvey);
        if (legalSurvey.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, legalSurvey.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!legalSurveyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        LegalSurvey result = legalSurveyRepository.save(legalSurvey);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, legalSurvey.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /legal-surveys/:id} : Partial updates given fields of an existing legalSurvey, field will ignore if it is null
     *
     * @param id the id of the legalSurvey to save.
     * @param legalSurvey the legalSurvey to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated legalSurvey,
     * or with status {@code 400 (Bad Request)} if the legalSurvey is not valid,
     * or with status {@code 404 (Not Found)} if the legalSurvey is not found,
     * or with status {@code 500 (Internal Server Error)} if the legalSurvey couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/legal-surveys/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<LegalSurvey> partialUpdateLegalSurvey(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody LegalSurvey legalSurvey
    ) throws URISyntaxException {
        log.debug("REST request to partial update LegalSurvey partially : {}, {}", id, legalSurvey);
        if (legalSurvey.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, legalSurvey.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!legalSurveyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<LegalSurvey> result = legalSurveyRepository
            .findById(legalSurvey.getId())
            .map(existingLegalSurvey -> {
                if (legalSurvey.getNotes() != null) {
                    existingLegalSurvey.setNotes(legalSurvey.getNotes());
                }
                if (legalSurvey.getIssues() != null) {
                    existingLegalSurvey.setIssues(legalSurvey.getIssues());
                }

                return existingLegalSurvey;
            })
            .map(legalSurveyRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, legalSurvey.getId().toString())
        );
    }

    /**
     * {@code GET  /legal-surveys} : get all the legalSurveys.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of legalSurveys in body.
     */
    @GetMapping("/legal-surveys")
    public List<LegalSurvey> getAllLegalSurveys() {
        log.debug("REST request to get all LegalSurveys");
        return legalSurveyRepository.findAll();
    }

    /**
     * {@code GET  /legal-surveys/:id} : get the "id" legalSurvey.
     *
     * @param id the id of the legalSurvey to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the legalSurvey, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/legal-surveys/{id}")
    public ResponseEntity<LegalSurvey> getLegalSurvey(@PathVariable Long id) {
        log.debug("REST request to get LegalSurvey : {}", id);
        Optional<LegalSurvey> legalSurvey = legalSurveyRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(legalSurvey);
    }

    /**
     * {@code DELETE  /legal-surveys/:id} : delete the "id" legalSurvey.
     *
     * @param id the id of the legalSurvey to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/legal-surveys/{id}")
    public ResponseEntity<Void> deleteLegalSurvey(@PathVariable Long id) {
        log.debug("REST request to delete LegalSurvey : {}", id);
        legalSurveyRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
