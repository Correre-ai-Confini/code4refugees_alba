package org.code4refugees.cri.alba.repository;

import org.code4refugees.cri.alba.domain.CheckPoint;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the CheckPoint entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CheckPointRepository extends JpaRepository<CheckPoint, Long> {}
