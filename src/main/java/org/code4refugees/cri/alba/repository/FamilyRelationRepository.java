package org.code4refugees.cri.alba.repository;

import org.code4refugees.cri.alba.domain.FamilyRelation;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the FamilyRelation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FamilyRelationRepository extends JpaRepository<FamilyRelation, Long> {}
