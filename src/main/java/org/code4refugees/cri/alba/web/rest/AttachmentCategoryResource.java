package org.code4refugees.cri.alba.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.code4refugees.cri.alba.domain.AttachmentCategory;
import org.code4refugees.cri.alba.repository.AttachmentCategoryRepository;
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
 * REST controller for managing {@link org.code4refugees.cri.alba.domain.AttachmentCategory}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AttachmentCategoryResource {

    private final Logger log = LoggerFactory.getLogger(AttachmentCategoryResource.class);

    private static final String ENTITY_NAME = "attachmentCategory";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AttachmentCategoryRepository attachmentCategoryRepository;

    public AttachmentCategoryResource(AttachmentCategoryRepository attachmentCategoryRepository) {
        this.attachmentCategoryRepository = attachmentCategoryRepository;
    }

    /**
     * {@code POST  /attachment-categories} : Create a new attachmentCategory.
     *
     * @param attachmentCategory the attachmentCategory to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new attachmentCategory, or with status {@code 400 (Bad Request)} if the attachmentCategory has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/attachment-categories")
    public ResponseEntity<AttachmentCategory> createAttachmentCategory(@RequestBody AttachmentCategory attachmentCategory)
        throws URISyntaxException {
        log.debug("REST request to save AttachmentCategory : {}", attachmentCategory);
        if (attachmentCategory.getId() != null) {
            throw new BadRequestAlertException("A new attachmentCategory cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AttachmentCategory result = attachmentCategoryRepository.save(attachmentCategory);
        return ResponseEntity
            .created(new URI("/api/attachment-categories/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /attachment-categories/:id} : Updates an existing attachmentCategory.
     *
     * @param id the id of the attachmentCategory to save.
     * @param attachmentCategory the attachmentCategory to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated attachmentCategory,
     * or with status {@code 400 (Bad Request)} if the attachmentCategory is not valid,
     * or with status {@code 500 (Internal Server Error)} if the attachmentCategory couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/attachment-categories/{id}")
    public ResponseEntity<AttachmentCategory> updateAttachmentCategory(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AttachmentCategory attachmentCategory
    ) throws URISyntaxException {
        log.debug("REST request to update AttachmentCategory : {}, {}", id, attachmentCategory);
        if (attachmentCategory.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, attachmentCategory.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!attachmentCategoryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AttachmentCategory result = attachmentCategoryRepository.save(attachmentCategory);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, attachmentCategory.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /attachment-categories/:id} : Partial updates given fields of an existing attachmentCategory, field will ignore if it is null
     *
     * @param id the id of the attachmentCategory to save.
     * @param attachmentCategory the attachmentCategory to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated attachmentCategory,
     * or with status {@code 400 (Bad Request)} if the attachmentCategory is not valid,
     * or with status {@code 404 (Not Found)} if the attachmentCategory is not found,
     * or with status {@code 500 (Internal Server Error)} if the attachmentCategory couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/attachment-categories/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AttachmentCategory> partialUpdateAttachmentCategory(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AttachmentCategory attachmentCategory
    ) throws URISyntaxException {
        log.debug("REST request to partial update AttachmentCategory partially : {}, {}", id, attachmentCategory);
        if (attachmentCategory.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, attachmentCategory.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!attachmentCategoryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AttachmentCategory> result = attachmentCategoryRepository
            .findById(attachmentCategory.getId())
            .map(existingAttachmentCategory -> {
                if (attachmentCategory.getDescription() != null) {
                    existingAttachmentCategory.setDescription(attachmentCategory.getDescription());
                }

                return existingAttachmentCategory;
            })
            .map(attachmentCategoryRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, attachmentCategory.getId().toString())
        );
    }

    /**
     * {@code GET  /attachment-categories} : get all the attachmentCategories.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of attachmentCategories in body.
     */
    @GetMapping("/attachment-categories")
    public List<AttachmentCategory> getAllAttachmentCategories() {
        log.debug("REST request to get all AttachmentCategories");
        return attachmentCategoryRepository.findAll();
    }

    /**
     * {@code GET  /attachment-categories/:id} : get the "id" attachmentCategory.
     *
     * @param id the id of the attachmentCategory to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the attachmentCategory, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/attachment-categories/{id}")
    public ResponseEntity<AttachmentCategory> getAttachmentCategory(@PathVariable Long id) {
        log.debug("REST request to get AttachmentCategory : {}", id);
        Optional<AttachmentCategory> attachmentCategory = attachmentCategoryRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(attachmentCategory);
    }

    /**
     * {@code DELETE  /attachment-categories/:id} : delete the "id" attachmentCategory.
     *
     * @param id the id of the attachmentCategory to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/attachment-categories/{id}")
    public ResponseEntity<Void> deleteAttachmentCategory(@PathVariable Long id) {
        log.debug("REST request to delete AttachmentCategory : {}", id);
        attachmentCategoryRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
