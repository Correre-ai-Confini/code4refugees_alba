package org.code4refugees.cri.alba.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A MedicalSurvey.
 */
@Entity
@Table(name = "medical_survey")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class MedicalSurvey implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "ongoing_illnesses")
    private String ongoingIllnesses;

    @Column(name = "ongoing_treatments")
    private String ongoingTreatments;

    @ManyToOne
    @JsonIgnoreProperties(value = { "category", "refugee", "creator", "originalRegistrationRecord" }, allowSetters = true)
    private Attachment attachment;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public MedicalSurvey id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOngoingIllnesses() {
        return this.ongoingIllnesses;
    }

    public MedicalSurvey ongoingIllnesses(String ongoingIllnesses) {
        this.setOngoingIllnesses(ongoingIllnesses);
        return this;
    }

    public void setOngoingIllnesses(String ongoingIllnesses) {
        this.ongoingIllnesses = ongoingIllnesses;
    }

    public String getOngoingTreatments() {
        return this.ongoingTreatments;
    }

    public MedicalSurvey ongoingTreatments(String ongoingTreatments) {
        this.setOngoingTreatments(ongoingTreatments);
        return this;
    }

    public void setOngoingTreatments(String ongoingTreatments) {
        this.ongoingTreatments = ongoingTreatments;
    }

    public Attachment getAttachment() {
        return this.attachment;
    }

    public void setAttachment(Attachment attachment) {
        this.attachment = attachment;
    }

    public MedicalSurvey attachment(Attachment attachment) {
        this.setAttachment(attachment);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof MedicalSurvey)) {
            return false;
        }
        return id != null && id.equals(((MedicalSurvey) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "MedicalSurvey{" +
            "id=" + getId() +
            ", ongoingIllnesses='" + getOngoingIllnesses() + "'" +
            ", ongoingTreatments='" + getOngoingTreatments() + "'" +
            "}";
    }
}
