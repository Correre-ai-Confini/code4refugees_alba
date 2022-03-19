package org.code4refugees.cri.alba.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.code4refugees.cri.alba.domain.Registration;
import org.code4refugees.cri.alba.repository.RegistrationRepository;
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
 * REST controller for managing {@link org.code4refugees.cri.alba.domain.Registration}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class RegistrationResource {

    private final Logger log = LoggerFactory.getLogger(RegistrationResource.class);

    private static final String ENTITY_NAME = "registration";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RegistrationRepository registrationRepository;

    public RegistrationResource(RegistrationRepository registrationRepository) {
        this.registrationRepository = registrationRepository;
    }

    /**
     * {@code POST  /registrations} : Create a new registration.
     *
     * @param registration the registration to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new registration, or with status {@code 400 (Bad Request)} if the registration has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/registrations")
    public ResponseEntity<Registration> createRegistration(@RequestBody Registration registration) throws URISyntaxException {
        log.debug("REST request to save Registration : {}", registration);
        if (registration.getId() != null) {
            throw new BadRequestAlertException("A new registration cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Registration result = registrationRepository.save(registration);
        return ResponseEntity
            .created(new URI("/api/registrations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /registrations/:id} : Updates an existing registration.
     *
     * @param id the id of the registration to save.
     * @param registration the registration to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated registration,
     * or with status {@code 400 (Bad Request)} if the registration is not valid,
     * or with status {@code 500 (Internal Server Error)} if the registration couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/registrations/{id}")
    public ResponseEntity<Registration> updateRegistration(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Registration registration
    ) throws URISyntaxException {
        log.debug("REST request to update Registration : {}, {}", id, registration);
        if (registration.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, registration.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!registrationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Registration result = registrationRepository.save(registration);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, registration.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /registrations/:id} : Partial updates given fields of an existing registration, field will ignore if it is null
     *
     * @param id the id of the registration to save.
     * @param registration the registration to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated registration,
     * or with status {@code 400 (Bad Request)} if the registration is not valid,
     * or with status {@code 404 (Not Found)} if the registration is not found,
     * or with status {@code 500 (Internal Server Error)} if the registration couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/registrations/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Registration> partialUpdateRegistration(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Registration registration
    ) throws URISyntaxException {
        log.debug("REST request to partial update Registration partially : {}, {}", id, registration);
        if (registration.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, registration.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!registrationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Registration> result = registrationRepository
            .findById(registration.getId())
            .map(existingRegistration -> {
                if (registration.getNotes() != null) {
                    existingRegistration.setNotes(registration.getNotes());
                }
                if (registration.getTimestamp() != null) {
                    existingRegistration.setTimestamp(registration.getTimestamp());
                }
                if (registration.getLegalConsentBlob() != null) {
                    existingRegistration.setLegalConsentBlob(registration.getLegalConsentBlob());
                }
                if (registration.getLegalConsentBlobContentType() != null) {
                    existingRegistration.setLegalConsentBlobContentType(registration.getLegalConsentBlobContentType());
                }

                return existingRegistration;
            })
            .map(registrationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, registration.getId().toString())
        );
    }

    /**
     * {@code GET  /registrations} : get all the registrations.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of registrations in body.
     */
    @GetMapping("/registrations")
    public List<Registration> getAllRegistrations() {
        log.debug("REST request to get all Registrations");
        return registrationRepository.findAll();
    }

    /**
     * {@code GET  /registrations/:id} : get the "id" registration.
     *
     * @param id the id of the registration to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the registration, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/registrations/{id}")
    public ResponseEntity<Registration> getRegistration(@PathVariable Long id) {
        log.debug("REST request to get Registration : {}", id);
        Optional<Registration> registration = registrationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(registration);
    }

    /**
     * {@code DELETE  /registrations/:id} : delete the "id" registration.
     *
     * @param id the id of the registration to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/registrations/{id}")
    public ResponseEntity<Void> deleteRegistration(@PathVariable Long id) {
        log.debug("REST request to delete Registration : {}", id);
        registrationRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
