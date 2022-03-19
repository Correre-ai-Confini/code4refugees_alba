package org.code4refugees.cri.alba.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.code4refugees.cri.alba.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AttachmentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Attachment.class);
        Attachment attachment1 = new Attachment();
        attachment1.setId(1L);
        Attachment attachment2 = new Attachment();
        attachment2.setId(attachment1.getId());
        assertThat(attachment1).isEqualTo(attachment2);
        attachment2.setId(2L);
        assertThat(attachment1).isNotEqualTo(attachment2);
        attachment1.setId(null);
        assertThat(attachment1).isNotEqualTo(attachment2);
    }
}
