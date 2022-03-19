package org.code4refugees.cri.alba.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.code4refugees.cri.alba.domain.CheckPoint;
import org.code4refugees.cri.alba.repository.CheckPointRepository;
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
 * REST controller for managing {@link org.code4refugees.cri.alba.domain.CheckPoint}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CheckPointResource {

    private final Logger log = LoggerFactory.getLogger(CheckPointResource.class);

    private static final String ENTITY_NAME = "checkPoint";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CheckPointRepository checkPointRepository;

    public CheckPointResource(CheckPointRepository checkPointRepository) {
        this.checkPointRepository = checkPointRepository;
    }

    /**
     * {@code POST  /check-points} : Create a new checkPoint.
     *
     * @param checkPoint the checkPoint to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new checkPoint, or with status {@code 400 (Bad Request)} if the checkPoint has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/check-points")
    public ResponseEntity<CheckPoint> createCheckPoint(@Valid @RequestBody CheckPoint checkPoint) throws URISyntaxException {
        log.debug("REST request to save CheckPoint : {}", checkPoint);
        if (checkPoint.getId() != null) {
            throw new BadRequestAlertException("A new checkPoint cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CheckPoint result = checkPointRepository.save(checkPoint);
        return ResponseEntity
            .created(new URI("/api/check-points/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /check-points/:id} : Updates an existing checkPoint.
     *
     * @param id the id of the checkPoint to save.
     * @param checkPoint the checkPoint to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated checkPoint,
     * or with status {@code 400 (Bad Request)} if the checkPoint is not valid,
     * or with status {@code 500 (Internal Server Error)} if the checkPoint couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/check-points/{id}")
    public ResponseEntity<CheckPoint> updateCheckPoint(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody CheckPoint checkPoint
    ) throws URISyntaxException {
        log.debug("REST request to update CheckPoint : {}, {}", id, checkPoint);
        if (checkPoint.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, checkPoint.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!checkPointRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CheckPoint result = checkPointRepository.save(checkPoint);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, checkPoint.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /check-points/:id} : Partial updates given fields of an existing checkPoint, field will ignore if it is null
     *
     * @param id the id of the checkPoint to save.
     * @param checkPoint the checkPoint to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated checkPoint,
     * or with status {@code 400 (Bad Request)} if the checkPoint is not valid,
     * or with status {@code 404 (Not Found)} if the checkPoint is not found,
     * or with status {@code 500 (Internal Server Error)} if the checkPoint couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/check-points/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CheckPoint> partialUpdateCheckPoint(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody CheckPoint checkPoint
    ) throws URISyntaxException {
        log.debug("REST request to partial update CheckPoint partially : {}, {}", id, checkPoint);
        if (checkPoint.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, checkPoint.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!checkPointRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CheckPoint> result = checkPointRepository
            .findById(checkPoint.getId())
            .map(existingCheckPoint -> {
                if (checkPoint.getFriendlyname() != null) {
                    existingCheckPoint.setFriendlyname(checkPoint.getFriendlyname());
                }

                return existingCheckPoint;
            })
            .map(checkPointRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, checkPoint.getId().toString())
        );
    }

    /**
     * {@code GET  /check-points} : get all the checkPoints.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of checkPoints in body.
     */
    @GetMapping("/check-points")
    public List<CheckPoint> getAllCheckPoints() {
        log.debug("REST request to get all CheckPoints");
        return checkPointRepository.findAll();
    }

    /**
     * {@code GET  /check-points/:id} : get the "id" checkPoint.
     *
     * @param id the id of the checkPoint to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the checkPoint, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/check-points/{id}")
    public ResponseEntity<CheckPoint> getCheckPoint(@PathVariable Long id) {
        log.debug("REST request to get CheckPoint : {}", id);
        Optional<CheckPoint> checkPoint = checkPointRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(checkPoint);
    }

    /**
     * {@code DELETE  /check-points/:id} : delete the "id" checkPoint.
     *
     * @param id the id of the checkPoint to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/check-points/{id}")
    public ResponseEntity<Void> deleteCheckPoint(@PathVariable Long id) {
        log.debug("REST request to delete CheckPoint : {}", id);
        checkPointRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
