package org.code4refugees.cri.alba.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.code4refugees.cri.alba.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MedicalSurveyTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MedicalSurvey.class);
        MedicalSurvey medicalSurvey1 = new MedicalSurvey();
        medicalSurvey1.setId(1L);
        MedicalSurvey medicalSurvey2 = new MedicalSurvey();
        medicalSurvey2.setId(medicalSurvey1.getId());
        assertThat(medicalSurvey1).isEqualTo(medicalSurvey2);
        medicalSurvey2.setId(2L);
        assertThat(medicalSurvey1).isNotEqualTo(medicalSurvey2);
        medicalSurvey1.setId(null);
        assertThat(medicalSurvey1).isNotEqualTo(medicalSurvey2);
    }
}
