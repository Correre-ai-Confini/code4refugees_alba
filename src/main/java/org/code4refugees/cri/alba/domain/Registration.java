package org.code4refugees.cri.alba.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Registration.
 */
@Entity
@Table(name = "registration")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Registration implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "notes")
    private String notes;

    @Column(name = "timestamp")
    private ZonedDateTime timestamp;

    @Lob
    @Column(name = "legal_consent_blob")
    private byte[] legalConsentBlob;

    @Column(name = "legal_consent_blob_content_type")
    private String legalConsentBlobContentType;

    @JsonIgnoreProperties(value = { "personalInformation", "primaryOccupation", "legalSurvey", "medicalSurvey" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Refugee refugee;

    @OneToMany(mappedBy = "registration")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "category", "checkPoint", "operator", "registration" }, allowSetters = true)
    private Set<Event> events = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Registration id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNotes() {
        return this.notes;
    }

    public Registration notes(String notes) {
        this.setNotes(notes);
        return this;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public ZonedDateTime getTimestamp() {
        return this.timestamp;
    }

    public Registration timestamp(ZonedDateTime timestamp) {
        this.setTimestamp(timestamp);
        return this;
    }

    public void setTimestamp(ZonedDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public byte[] getLegalConsentBlob() {
        return this.legalConsentBlob;
    }

    public Registration legalConsentBlob(byte[] legalConsentBlob) {
        this.setLegalConsentBlob(legalConsentBlob);
        return this;
    }

    public void setLegalConsentBlob(byte[] legalConsentBlob) {
        this.legalConsentBlob = legalConsentBlob;
    }

    public String getLegalConsentBlobContentType() {
        return this.legalConsentBlobContentType;
    }

    public Registration legalConsentBlobContentType(String legalConsentBlobContentType) {
        this.legalConsentBlobContentType = legalConsentBlobContentType;
        return this;
    }

    public void setLegalConsentBlobContentType(String legalConsentBlobContentType) {
        this.legalConsentBlobContentType = legalConsentBlobContentType;
    }

    public Refugee getRefugee() {
        return this.refugee;
    }

    public void setRefugee(Refugee refugee) {
        this.refugee = refugee;
    }

    public Registration refugee(Refugee refugee) {
        this.setRefugee(refugee);
        return this;
    }

    public Set<Event> getEvents() {
        return this.events;
    }

    public void setEvents(Set<Event> events) {
        if (this.events != null) {
            this.events.forEach(i -> i.setRegistration(null));
        }
        if (events != null) {
            events.forEach(i -> i.setRegistration(this));
        }
        this.events = events;
    }

    public Registration events(Set<Event> events) {
        this.setEvents(events);
        return this;
    }

    public Registration addEvents(Event event) {
        this.events.add(event);
        event.setRegistration(this);
        return this;
    }

    public Registration removeEvents(Event event) {
        this.events.remove(event);
        event.setRegistration(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Registration)) {
            return false;
        }
        return id != null && id.equals(((Registration) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Registration{" +
            "id=" + getId() +
            ", notes='" + getNotes() + "'" +
            ", timestamp='" + getTimestamp() + "'" +
            ", legalConsentBlob='" + getLegalConsentBlob() + "'" +
            ", legalConsentBlobContentType='" + getLegalConsentBlobContentType() + "'" +
            "}";
    }
}
