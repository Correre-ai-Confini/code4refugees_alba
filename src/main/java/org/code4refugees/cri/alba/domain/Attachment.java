package org.code4refugees.cri.alba.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import org.code4refugees.cri.alba.domain.enumeration.ContentType;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Attachment.
 */
@Entity
@Table(name = "attachment")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Attachment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "description")
    private String description;

    @Column(name = "creation_ts")
    private ZonedDateTime creationTS;

    @Column(name = "name")
    private String name;

    @Lob
    @Column(name = "content_blob")
    private byte[] contentBlob;

    @Column(name = "content_blob_content_type")
    private String contentBlobContentType;

    @Enumerated(EnumType.STRING)
    @Column(name = "content_type")
    private ContentType contentType;

    @ManyToOne
    private AttachmentCategory category;

    @ManyToOne
    @JsonIgnoreProperties(value = { "personalInformation", "primaryOccupation", "legalSurvey", "medicalSurvey" }, allowSetters = true)
    private Refugee refugee;

    @ManyToOne
    @JsonIgnoreProperties(value = { "personalInformation" }, allowSetters = true)
    private Operator creator;

    @ManyToOne
    @JsonIgnoreProperties(value = { "category", "checkPoint", "operator", "registration" }, allowSetters = true)
    private Event originalRegistrationRecord;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Attachment id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return this.description;
    }

    public Attachment description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ZonedDateTime getCreationTS() {
        return this.creationTS;
    }

    public Attachment creationTS(ZonedDateTime creationTS) {
        this.setCreationTS(creationTS);
        return this;
    }

    public void setCreationTS(ZonedDateTime creationTS) {
        this.creationTS = creationTS;
    }

    public String getName() {
        return this.name;
    }

    public Attachment name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public byte[] getContentBlob() {
        return this.contentBlob;
    }

    public Attachment contentBlob(byte[] contentBlob) {
        this.setContentBlob(contentBlob);
        return this;
    }

    public void setContentBlob(byte[] contentBlob) {
        this.contentBlob = contentBlob;
    }

    public String getContentBlobContentType() {
        return this.contentBlobContentType;
    }

    public Attachment contentBlobContentType(String contentBlobContentType) {
        this.contentBlobContentType = contentBlobContentType;
        return this;
    }

    public void setContentBlobContentType(String contentBlobContentType) {
        this.contentBlobContentType = contentBlobContentType;
    }

    public ContentType getContentType() {
        return this.contentType;
    }

    public Attachment contentType(ContentType contentType) {
        this.setContentType(contentType);
        return this;
    }

    public void setContentType(ContentType contentType) {
        this.contentType = contentType;
    }

    public AttachmentCategory getCategory() {
        return this.category;
    }

    public void setCategory(AttachmentCategory attachmentCategory) {
        this.category = attachmentCategory;
    }

    public Attachment category(AttachmentCategory attachmentCategory) {
        this.setCategory(attachmentCategory);
        return this;
    }

    public Refugee getRefugee() {
        return this.refugee;
    }

    public void setRefugee(Refugee refugee) {
        this.refugee = refugee;
    }

    public Attachment refugee(Refugee refugee) {
        this.setRefugee(refugee);
        return this;
    }

    public Operator getCreator() {
        return this.creator;
    }

    public void setCreator(Operator operator) {
        this.creator = operator;
    }

    public Attachment creator(Operator operator) {
        this.setCreator(operator);
        return this;
    }

    public Event getOriginalRegistrationRecord() {
        return this.originalRegistrationRecord;
    }

    public void setOriginalRegistrationRecord(Event event) {
        this.originalRegistrationRecord = event;
    }

    public Attachment originalRegistrationRecord(Event event) {
        this.setOriginalRegistrationRecord(event);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Attachment)) {
            return false;
        }
        return id != null && id.equals(((Attachment) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Attachment{" +
            "id=" + getId() +
            ", description='" + getDescription() + "'" +
            ", creationTS='" + getCreationTS() + "'" +
            ", name='" + getName() + "'" +
            ", contentBlob='" + getContentBlob() + "'" +
            ", contentBlobContentType='" + getContentBlobContentType() + "'" +
            ", contentType='" + getContentType() + "'" +
            "}";
    }
}
