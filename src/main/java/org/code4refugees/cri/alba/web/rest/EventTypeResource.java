package org.code4refugees.cri.alba.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.code4refugees.cri.alba.domain.EventType;
import org.code4refugees.cri.alba.repository.EventTypeRepository;
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
 * REST controller for managing {@link org.code4refugees.cri.alba.domain.EventType}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class EventTypeResource {

    private final Logger log = LoggerFactory.getLogger(EventTypeResource.class);

    private static final String ENTITY_NAME = "eventType";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EventTypeRepository eventTypeRepository;

    public EventTypeResource(EventTypeRepository eventTypeRepository) {
        this.eventTypeRepository = eventTypeRepository;
    }

    /**
     * {@code POST  /event-types} : Create a new eventType.
     *
     * @param eventType the eventType to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new eventType, or with status {@code 400 (Bad Request)} if the eventType has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/event-types")
    public ResponseEntity<EventType> createEventType(@RequestBody EventType eventType) throws URISyntaxException {
        log.debug("REST request to save EventType : {}", eventType);
        if (eventType.getId() != null) {
            throw new BadRequestAlertException("A new eventType cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EventType result = eventTypeRepository.save(eventType);
        return ResponseEntity
            .created(new URI("/api/event-types/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /event-types/:id} : Updates an existing eventType.
     *
     * @param id the id of the eventType to save.
     * @param eventType the eventType to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated eventType,
     * or with status {@code 400 (Bad Request)} if the eventType is not valid,
     * or with status {@code 500 (Internal Server Error)} if the eventType couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/event-types/{id}")
    public ResponseEntity<EventType> updateEventType(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EventType eventType
    ) throws URISyntaxException {
        log.debug("REST request to update EventType : {}, {}", id, eventType);
        if (eventType.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, eventType.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!eventTypeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        EventType result = eventTypeRepository.save(eventType);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, eventType.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /event-types/:id} : Partial updates given fields of an existing eventType, field will ignore if it is null
     *
     * @param id the id of the eventType to save.
     * @param eventType the eventType to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated eventType,
     * or with status {@code 400 (Bad Request)} if the eventType is not valid,
     * or with status {@code 404 (Not Found)} if the eventType is not found,
     * or with status {@code 500 (Internal Server Error)} if the eventType couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/event-types/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<EventType> partialUpdateEventType(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EventType eventType
    ) throws URISyntaxException {
        log.debug("REST request to partial update EventType partially : {}, {}", id, eventType);
        if (eventType.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, eventType.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!eventTypeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<EventType> result = eventTypeRepository
            .findById(eventType.getId())
            .map(existingEventType -> {
                if (eventType.getDescription() != null) {
                    existingEventType.setDescription(eventType.getDescription());
                }

                return existingEventType;
            })
            .map(eventTypeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, eventType.getId().toString())
        );
    }

    /**
     * {@code GET  /event-types} : get all the eventTypes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of eventTypes in body.
     */
    @GetMapping("/event-types")
    public List<EventType> getAllEventTypes() {
        log.debug("REST request to get all EventTypes");
        return eventTypeRepository.findAll();
    }

    /**
     * {@code GET  /event-types/:id} : get the "id" eventType.
     *
     * @param id the id of the eventType to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the eventType, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/event-types/{id}")
    public ResponseEntity<EventType> getEventType(@PathVariable Long id) {
        log.debug("REST request to get EventType : {}", id);
        Optional<EventType> eventType = eventTypeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(eventType);
    }

    /**
     * {@code DELETE  /event-types/:id} : delete the "id" eventType.
     *
     * @param id the id of the eventType to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/event-types/{id}")
    public ResponseEntity<Void> deleteEventType(@PathVariable Long id) {
        log.debug("REST request to delete EventType : {}", id);
        eventTypeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
