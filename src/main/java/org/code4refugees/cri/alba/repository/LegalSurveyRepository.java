package org.code4refugees.cri.alba.repository;

import org.code4refugees.cri.alba.domain.LegalSurvey;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the LegalSurvey entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LegalSurveyRepository extends JpaRepository<LegalSurvey, Long> {}
