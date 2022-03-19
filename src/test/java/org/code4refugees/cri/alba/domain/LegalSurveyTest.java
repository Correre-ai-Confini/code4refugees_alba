package org.code4refugees.cri.alba.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.code4refugees.cri.alba.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LegalSurveyTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LegalSurvey.class);
        LegalSurvey legalSurvey1 = new LegalSurvey();
        legalSurvey1.setId(1L);
        LegalSurvey legalSurvey2 = new LegalSurvey();
        legalSurvey2.setId(legalSurvey1.getId());
        assertThat(legalSurvey1).isEqualTo(legalSurvey2);
        legalSurvey2.setId(2L);
        assertThat(legalSurvey1).isNotEqualTo(legalSurvey2);
        legalSurvey1.setId(null);
        assertThat(legalSurvey1).isNotEqualTo(legalSurvey2);
    }
}
