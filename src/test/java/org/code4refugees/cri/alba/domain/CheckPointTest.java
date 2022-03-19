package org.code4refugees.cri.alba.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.code4refugees.cri.alba.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CheckPointTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CheckPoint.class);
        CheckPoint checkPoint1 = new CheckPoint();
        checkPoint1.setId(1L);
        CheckPoint checkPoint2 = new CheckPoint();
        checkPoint2.setId(checkPoint1.getId());
        assertThat(checkPoint1).isEqualTo(checkPoint2);
        checkPoint2.setId(2L);
        assertThat(checkPoint1).isNotEqualTo(checkPoint2);
        checkPoint1.setId(null);
        assertThat(checkPoint1).isNotEqualTo(checkPoint2);
    }
}
