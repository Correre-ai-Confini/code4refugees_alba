package org.code4refugees.cri.alba.web.rest;

import org.code4refugees.cri.alba.domain.*;
import org.code4refugees.cri.alba.repository.*;
import org.code4refugees.cri.alba.service.dto.FreshRegistrationDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;

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
    private final PersonRepository personRepository;
    private final RefugeeRepository refugeeRepository;
    private final EventRepository eventRepository;
    private final OperatorRepository operatorRepository;
    private final CheckPointRepository checkPointRepository;
    private final LocationRepository locationRepository;

    public FirstRegistrationResource(RegistrationRepository registrationRepository,
                                     PersonRepository personRepository,
                                     RefugeeRepository refugeeRepository,
                                     EventRepository eventRepository,
                                     OperatorRepository operatorRepository,
                                     CheckPointRepository checkPointRepository,
                                     LocationRepository locationRepository) {
        this.registrationRepository = registrationRepository;
        this.personRepository = personRepository;
        this.refugeeRepository = refugeeRepository;
        this.eventRepository = eventRepository;
        this.operatorRepository = operatorRepository;
        this.checkPointRepository = checkPointRepository;
        this.locationRepository = locationRepository;
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
    public ResponseEntity<Registration> createRegistration(@RequestBody FreshRegistrationDTO registrationRequest) throws URISyntaxException {

        //TODO: MAP

        Event event = saveEvent(registrationRequest);
        Person person = savePerson(registrationRequest);
        Refugee refugee = saveRefugee(registrationRequest, person);
        Registration registration = saveRegistration(registrationRequest, refugee, event);

        return ResponseEntity
            .created(new URI("/api/checkpoint-client/register/" + registration.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, registration.getId().toString()))
            .body(registration);
    }

    private Event saveEvent(FreshRegistrationDTO registrationRequest) {
        Event event = new Event();
        BeanUtils.copyProperties(registrationRequest.getEvent(), event,
                "id", "timestamp", "operator", "checkPoint", "registration");

        Event registrationRequestEvent = registrationRequest.getEvent();
        if (registrationRequestEvent == null) throw new RuntimeException("Cannot register without an event: found null");

        Operator registrationRequestEventOperator = registrationRequestEvent.getOperator();
        //TODO USE A CLAIM in JWT
        if (registrationRequestEventOperator == null) {
            registrationRequestEventOperator = new Operator();
            registrationRequestEventOperator.setId(1L);
        }

//        if (registrationRequestEventOperator == null) throw new RuntimeException("Cannot register without an operator: found null");

        CheckPoint registrationRequestEventCheckPoint = registrationRequestEvent.getCheckPoint();
//        if (registrationRequestEventCheckPoint == null) throw new RuntimeException("Cannot register without a checkpoint: found null");
        //TODO USE A CLAIM in JWT
        if (registrationRequestEventCheckPoint == null) {
            registrationRequestEventCheckPoint = new CheckPoint();
            registrationRequestEventCheckPoint.setId(1L);
        }


        operatorRepository.findById(registrationRequestEventOperator.getId()).ifPresent(event::setOperator);
        checkPointRepository.findById(registrationRequestEventCheckPoint.getId()).ifPresent(event::setCheckPoint);

        Event result = eventRepository.save(event);
        return result;
    }

    private Refugee saveRefugee(FreshRegistrationDTO registrationRequest, Person person) {
        Refugee refugee = new Refugee();
        BeanUtils.copyProperties(registrationRequest.getRefugee(), refugee, "id", "medicalSurvey", "legalSurvey", "personalInformation");
        refugee.setPersonalInformation(person);
        Refugee result = refugeeRepository.save(refugee);
        return result;
    }

    private Person savePerson(FreshRegistrationDTO registrationRequest) {
        Person person = new Person();
        BeanUtils.copyProperties(registrationRequest.getRefugeePerson(), person, "id", "comingFrom");

        Person result = personRepository.save(person);
        return result;
    }

    private Registration saveRegistration(FreshRegistrationDTO registrationRequest, Refugee refugee, Event event) {
        Registration registration = new Registration();

        registration.setNotes(registrationRequest.getRegistration().getNotes());
        registration.setLegalConsentBlob(registrationRequest.getRegistration().getLegalConsentBlob());
        registration.setLegalConsentBlobContentType(registrationRequest.getRegistration().getLegalConsentBlobContentType());
        registration.setRefugee(refugee);

        registration.setEvents(new HashSet<>());
        registration.getEvents().add(event);

        Registration result = registrationRepository.save(registration);
        return result;
    }


}
