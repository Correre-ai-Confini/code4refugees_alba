package org.code4refugees.cri.alba.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.code4refugees.cri.alba.domain.Operator;
import org.code4refugees.cri.alba.repository.OperatorRepository;
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
 * REST controller for managing {@link org.code4refugees.cri.alba.domain.Operator}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class OperatorResource {

    private final Logger log = LoggerFactory.getLogger(OperatorResource.class);

    private static final String ENTITY_NAME = "operator";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OperatorRepository operatorRepository;

    public OperatorResource(OperatorRepository operatorRepository) {
        this.operatorRepository = operatorRepository;
    }

    /**
     * {@code POST  /operators} : Create a new operator.
     *
     * @param operator the operator to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new operator, or with status {@code 400 (Bad Request)} if the operator has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/operators")
    public ResponseEntity<Operator> createOperator(@RequestBody Operator operator) throws URISyntaxException {
        log.debug("REST request to save Operator : {}", operator);
        if (operator.getId() != null) {
            throw new BadRequestAlertException("A new operator cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Operator result = operatorRepository.save(operator);
        return ResponseEntity
            .created(new URI("/api/operators/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /operators/:id} : Updates an existing operator.
     *
     * @param id the id of the operator to save.
     * @param operator the operator to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated operator,
     * or with status {@code 400 (Bad Request)} if the operator is not valid,
     * or with status {@code 500 (Internal Server Error)} if the operator couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/operators/{id}")
    public ResponseEntity<Operator> updateOperator(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Operator operator
    ) throws URISyntaxException {
        log.debug("REST request to update Operator : {}, {}", id, operator);
        if (operator.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, operator.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!operatorRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Operator result = operatorRepository.save(operator);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, operator.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /operators/:id} : Partial updates given fields of an existing operator, field will ignore if it is null
     *
     * @param id the id of the operator to save.
     * @param operator the operator to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated operator,
     * or with status {@code 400 (Bad Request)} if the operator is not valid,
     * or with status {@code 404 (Not Found)} if the operator is not found,
     * or with status {@code 500 (Internal Server Error)} if the operator couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/operators/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Operator> partialUpdateOperator(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Operator operator
    ) throws URISyntaxException {
        log.debug("REST request to partial update Operator partially : {}, {}", id, operator);
        if (operator.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, operator.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!operatorRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Operator> result = operatorRepository
            .findById(operator.getId())
            .map(existingOperator -> {
                if (operator.getKindOfOperator() != null) {
                    existingOperator.setKindOfOperator(operator.getKindOfOperator());
                }

                return existingOperator;
            })
            .map(operatorRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, operator.getId().toString())
        );
    }

    /**
     * {@code GET  /operators} : get all the operators.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of operators in body.
     */
    @GetMapping("/operators")
    public List<Operator> getAllOperators() {
        log.debug("REST request to get all Operators");
        return operatorRepository.findAll();
    }

    /**
     * {@code GET  /operators/:id} : get the "id" operator.
     *
     * @param id the id of the operator to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the operator, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/operators/{id}")
    public ResponseEntity<Operator> getOperator(@PathVariable Long id) {
        log.debug("REST request to get Operator : {}", id);
        Optional<Operator> operator = operatorRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(operator);
    }

    /**
     * {@code DELETE  /operators/:id} : delete the "id" operator.
     *
     * @param id the id of the operator to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/operators/{id}")
    public ResponseEntity<Void> deleteOperator(@PathVariable Long id) {
        log.debug("REST request to delete Operator : {}", id);
        operatorRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
