package org.code4refugees.cri.alba.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A LegalSurvey.
 */
@Entity
@Table(name = "legal_survey")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class LegalSurvey implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "notes")
    private String notes;

    @Column(name = "issues")
    private String issues;

    @ManyToOne
    @JsonIgnoreProperties(value = { "category", "refugee", "creator", "originalRegistrationRecord" }, allowSetters = true)
    private Attachment attachment;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public LegalSurvey id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNotes() {
        return this.notes;
    }

    public LegalSurvey notes(String notes) {
        this.setNotes(notes);
        return this;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getIssues() {
        return this.issues;
    }

    public LegalSurvey issues(String issues) {
        this.setIssues(issues);
        return this;
    }

    public void setIssues(String issues) {
        this.issues = issues;
    }

    public Attachment getAttachment() {
        return this.attachment;
    }

    public void setAttachment(Attachment attachment) {
        this.attachment = attachment;
    }

    public LegalSurvey attachment(Attachment attachment) {
        this.setAttachment(attachment);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof LegalSurvey)) {
            return false;
        }
        return id != null && id.equals(((LegalSurvey) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "LegalSurvey{" +
            "id=" + getId() +
            ", notes='" + getNotes() + "'" +
            ", issues='" + getIssues() + "'" +
            "}";
    }
}
