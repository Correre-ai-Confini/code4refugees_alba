package org.code4refugees.cri.alba.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.code4refugees.cri.alba.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class RefugeeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Refugee.class);
        Refugee refugee1 = new Refugee();
        refugee1.setId(1L);
        Refugee refugee2 = new Refugee();
        refugee2.setId(refugee1.getId());
        assertThat(refugee1).isEqualTo(refugee2);
        refugee2.setId(2L);
        assertThat(refugee1).isNotEqualTo(refugee2);
        refugee1.setId(null);
        assertThat(refugee1).isNotEqualTo(refugee2);
    }
}
