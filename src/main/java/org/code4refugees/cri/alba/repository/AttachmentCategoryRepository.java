package org.code4refugees.cri.alba.repository;

import org.code4refugees.cri.alba.domain.AttachmentCategory;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the AttachmentCategory entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AttachmentCategoryRepository extends JpaRepository<AttachmentCategory, Long> {}
