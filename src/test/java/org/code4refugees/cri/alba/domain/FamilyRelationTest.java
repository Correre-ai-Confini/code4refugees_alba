package org.code4refugees.cri.alba.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.code4refugees.cri.alba.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FamilyRelationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FamilyRelation.class);
        FamilyRelation familyRelation1 = new FamilyRelation();
        familyRelation1.setId(1L);
        FamilyRelation familyRelation2 = new FamilyRelation();
        familyRelation2.setId(familyRelation1.getId());
        assertThat(familyRelation1).isEqualTo(familyRelation2);
        familyRelation2.setId(2L);
        assertThat(familyRelation1).isNotEqualTo(familyRelation2);
        familyRelation1.setId(null);
        assertThat(familyRelation1).isNotEqualTo(familyRelation2);
    }
}
