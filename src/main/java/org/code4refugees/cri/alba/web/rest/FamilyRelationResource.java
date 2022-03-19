package org.code4refugees.cri.alba.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.code4refugees.cri.alba.domain.FamilyRelation;
import org.code4refugees.cri.alba.repository.FamilyRelationRepository;
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
 * REST controller for managing {@link org.code4refugees.cri.alba.domain.FamilyRelation}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FamilyRelationResource {

    private final Logger log = LoggerFactory.getLogger(FamilyRelationResource.class);

    private static final String ENTITY_NAME = "familyRelation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FamilyRelationRepository familyRelationRepository;

    public FamilyRelationResource(FamilyRelationRepository familyRelationRepository) {
        this.familyRelationRepository = familyRelationRepository;
    }

    /**
     * {@code POST  /family-relations} : Create a new familyRelation.
     *
     * @param familyRelation the familyRelation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new familyRelation, or with status {@code 400 (Bad Request)} if the familyRelation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/family-relations")
    public ResponseEntity<FamilyRelation> createFamilyRelation(@RequestBody FamilyRelation familyRelation) throws URISyntaxException {
        log.debug("REST request to save FamilyRelation : {}", familyRelation);
        if (familyRelation.getId() != null) {
            throw new BadRequestAlertException("A new familyRelation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        FamilyRelation result = familyRelationRepository.save(familyRelation);
        return ResponseEntity
            .created(new URI("/api/family-relations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /family-relations/:id} : Updates an existing familyRelation.
     *
     * @param id the id of the familyRelation to save.
     * @param familyRelation the familyRelation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated familyRelation,
     * or with status {@code 400 (Bad Request)} if the familyRelation is not valid,
     * or with status {@code 500 (Internal Server Error)} if the familyRelation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/family-relations/{id}")
    public ResponseEntity<FamilyRelation> updateFamilyRelation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody FamilyRelation familyRelation
    ) throws URISyntaxException {
        log.debug("REST request to update FamilyRelation : {}, {}", id, familyRelation);
        if (familyRelation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, familyRelation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!familyRelationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        FamilyRelation result = familyRelationRepository.save(familyRelation);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, familyRelation.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /family-relations/:id} : Partial updates given fields of an existing familyRelation, field will ignore if it is null
     *
     * @param id the id of the familyRelation to save.
     * @param familyRelation the familyRelation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated familyRelation,
     * or with status {@code 400 (Bad Request)} if the familyRelation is not valid,
     * or with status {@code 404 (Not Found)} if the familyRelation is not found,
     * or with status {@code 500 (Internal Server Error)} if the familyRelation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/family-relations/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<FamilyRelation> partialUpdateFamilyRelation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody FamilyRelation familyRelation
    ) throws URISyntaxException {
        log.debug("REST request to partial update FamilyRelation partially : {}, {}", id, familyRelation);
        if (familyRelation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, familyRelation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!familyRelationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<FamilyRelation> result = familyRelationRepository
            .findById(familyRelation.getId())
            .map(existingFamilyRelation -> {
                if (familyRelation.getNotes() != null) {
                    existingFamilyRelation.setNotes(familyRelation.getNotes());
                }
                if (familyRelation.getRelType() != null) {
                    existingFamilyRelation.setRelType(familyRelation.getRelType());
                }

                return existingFamilyRelation;
            })
            .map(familyRelationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, familyRelation.getId().toString())
        );
    }

    /**
     * {@code GET  /family-relations} : get all the familyRelations.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of familyRelations in body.
     */
    @GetMapping("/family-relations")
    public List<FamilyRelation> getAllFamilyRelations() {
        log.debug("REST request to get all FamilyRelations");
        return familyRelationRepository.findAll();
    }

    /**
     * {@code GET  /family-relations/:id} : get the "id" familyRelation.
     *
     * @param id the id of the familyRelation to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the familyRelation, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/family-relations/{id}")
    public ResponseEntity<FamilyRelation> getFamilyRelation(@PathVariable Long id) {
        log.debug("REST request to get FamilyRelation : {}", id);
        Optional<FamilyRelation> familyRelation = familyRelationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(familyRelation);
    }

    /**
     * {@code DELETE  /family-relations/:id} : delete the "id" familyRelation.
     *
     * @param id the id of the familyRelation to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/family-relations/{id}")
    public ResponseEntity<Void> deleteFamilyRelation(@PathVariable Long id) {
        log.debug("REST request to delete FamilyRelation : {}", id);
        familyRelationRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
