package org.code4refugees.cri.alba.web.rest;

import org.code4refugees.cri.alba.domain.Event;
import org.code4refugees.cri.alba.domain.Refugee;
import org.code4refugees.cri.alba.domain.Registration;
import org.code4refugees.cri.alba.repository.RegistrationRepository;
import org.code4refugees.cri.alba.service.dto.RegistrationDto;
import org.code4refugees.cri.alba.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

/**
 * REST controller for managing {@link Registration}.
 */
@RestController
@RequestMapping("/api/checkpoint-client/")
@Transactional
public class FirstRegistrationResource {

    private final Logger log = LoggerFactory.getLogger(FirstRegistrationResource.class);


    private static final String ENTITY_NAME = "first-registration";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RegistrationRepository registrationRepository;

    public FirstRegistrationResource(RegistrationRepository registrationRepository) {
        this.registrationRepository = registrationRepository;
    }

    @GetMapping("/register")
    public ResponseEntity<String> beginRegistration() {
        String uuid = UUID.randomUUID().toString();
        return new ResponseEntity<>(uuid, HttpStatus.OK);
    }

    /**
     * {@code POST  /refugee} : Create a new registration.
     *
     * @param registrationRequest the registration to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new registration, or with status {@code 400 (Bad Request)} if the registration has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/register")
    public ResponseEntity<Registration> createRegistration(@RequestBody RegistrationDto registrationRequest) throws URISyntaxException {

        //TODO: MAP

        Registration registration = new Registration();
        Refugee refugee = new Refugee();
        Event event = new Event();

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




}
