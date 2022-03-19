package org.code4refugees.cri.alba.repository;

import org.code4refugees.cri.alba.domain.Refugee;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Refugee entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RefugeeRepository extends JpaRepository<Refugee, Long> {}
