package org.code4refugees.cri.alba.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.code4refugees.cri.alba.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AttachmentCategoryTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AttachmentCategory.class);
        AttachmentCategory attachmentCategory1 = new AttachmentCategory();
        attachmentCategory1.setId(1L);
        AttachmentCategory attachmentCategory2 = new AttachmentCategory();
        attachmentCategory2.setId(attachmentCategory1.getId());
        assertThat(attachmentCategory1).isEqualTo(attachmentCategory2);
        attachmentCategory2.setId(2L);
        assertThat(attachmentCategory1).isNotEqualTo(attachmentCategory2);
        attachmentCategory1.setId(null);
        assertThat(attachmentCategory1).isNotEqualTo(attachmentCategory2);
    }
}
