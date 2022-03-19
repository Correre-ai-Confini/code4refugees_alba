package org.code4refugees.cri.alba.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.code4refugees.cri.alba.domain.Refugee;
import org.code4refugees.cri.alba.repository.RefugeeRepository;
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
 * REST controller for managing {@link org.code4refugees.cri.alba.domain.Refugee}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class RefugeeResource {

    private final Logger log = LoggerFactory.getLogger(RefugeeResource.class);

    private static final String ENTITY_NAME = "refugee";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RefugeeRepository refugeeRepository;

    public RefugeeResource(RefugeeRepository refugeeRepository) {
        this.refugeeRepository = refugeeRepository;
    }

    /**
     * {@code POST  /refugees} : Create a new refugee.
     *
     * @param refugee the refugee to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new refugee, or with status {@code 400 (Bad Request)} if the refugee has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/refugees")
    public ResponseEntity<Refugee> createRefugee(@RequestBody Refugee refugee) throws URISyntaxException {
        log.debug("REST request to save Refugee : {}", refugee);
        if (refugee.getId() != null) {
            throw new BadRequestAlertException("A new refugee cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Refugee result = refugeeRepository.save(refugee);
        return ResponseEntity
            .created(new URI("/api/refugees/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /refugees/:id} : Updates an existing refugee.
     *
     * @param id the id of the refugee to save.
     * @param refugee the refugee to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated refugee,
     * or with status {@code 400 (Bad Request)} if the refugee is not valid,
     * or with status {@code 500 (Internal Server Error)} if the refugee couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/refugees/{id}")
    public ResponseEntity<Refugee> updateRefugee(@PathVariable(value = "id", required = false) final Long id, @RequestBody Refugee refugee)
        throws URISyntaxException {
        log.debug("REST request to update Refugee : {}, {}", id, refugee);
        if (refugee.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, refugee.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!refugeeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Refugee result = refugeeRepository.save(refugee);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, refugee.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /refugees/:id} : Partial updates given fields of an existing refugee, field will ignore if it is null
     *
     * @param id the id of the refugee to save.
     * @param refugee the refugee to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated refugee,
     * or with status {@code 400 (Bad Request)} if the refugee is not valid,
     * or with status {@code 404 (Not Found)} if the refugee is not found,
     * or with status {@code 500 (Internal Server Error)} if the refugee couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/refugees/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Refugee> partialUpdateRefugee(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Refugee refugee
    ) throws URISyntaxException {
        log.debug("REST request to partial update Refugee partially : {}, {}", id, refugee);
        if (refugee.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, refugee.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!refugeeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Refugee> result = refugeeRepository
            .findById(refugee.getId())
            .map(existingRefugee -> {
                if (refugee.getQrcodeUUID() != null) {
                    existingRefugee.setQrcodeUUID(refugee.getQrcodeUUID());
                }
                if (refugee.getEducationalLevel() != null) {
                    existingRefugee.setEducationalLevel(refugee.getEducationalLevel());
                }
                if (refugee.getMandatoryTutored() != null) {
                    existingRefugee.setMandatoryTutored(refugee.getMandatoryTutored());
                }
                if (refugee.getBirthDate() != null) {
                    existingRefugee.setBirthDate(refugee.getBirthDate());
                }
                if (refugee.getDisabledPerson() != null) {
                    existingRefugee.setDisabledPerson(refugee.getDisabledPerson());
                }
                if (refugee.getReligion() != null) {
                    existingRefugee.setReligion(refugee.getReligion());
                }
                if (refugee.getGender() != null) {
                    existingRefugee.setGender(refugee.getGender());
                }

                return existingRefugee;
            })
            .map(refugeeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, refugee.getId().toString())
        );
    }

    /**
     * {@code GET  /refugees} : get all the refugees.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of refugees in body.
     */
    @GetMapping("/refugees")
    public List<Refugee> getAllRefugees() {
        log.debug("REST request to get all Refugees");
        return refugeeRepository.findAll();
    }

    /**
     * {@code GET  /refugees/:id} : get the "id" refugee.
     *
     * @param id the id of the refugee to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the refugee, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/refugees/{id}")
    public ResponseEntity<Refugee> getRefugee(@PathVariable Long id) {
        log.debug("REST request to get Refugee : {}", id);
        Optional<Refugee> refugee = refugeeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(refugee);
    }

    /**
     * {@code DELETE  /refugees/:id} : delete the "id" refugee.
     *
     * @param id the id of the refugee to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/refugees/{id}")
    public ResponseEntity<Void> deleteRefugee(@PathVariable Long id) {
        log.debug("REST request to delete Refugee : {}", id);
        refugeeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
