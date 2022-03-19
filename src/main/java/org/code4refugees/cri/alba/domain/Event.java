package org.code4refugees.cri.alba.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import org.code4refugees.cri.alba.domain.enumeration.TreatmentPriority;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * legalConsent will be a base64 BLOB with the\nwritten authorization of the refugee to the\nregistration itself
 */
@Schema(description = "legalConsent will be a base64 BLOB with the\nwritten authorization of the refugee to the\nregistration itself")
@Entity
@Table(name = "event")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Event implements Serializable {

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

    @Enumerated(EnumType.STRING)
    @Column(name = "urgency_of_medical_treatment")
    private TreatmentPriority urgencyOfMedicalTreatment;

    @Column(name = "need_for_legal_assistance")
    private Integer needForLegalAssistance;

    @OneToOne
    @JoinColumn(unique = true)
    private EventType category;

    @JsonIgnoreProperties(value = { "location" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private CheckPoint checkPoint;

    @JsonIgnoreProperties(value = { "personalInformation" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Operator operator;

    @ManyToOne
    @JsonIgnoreProperties(value = { "refugee", "events" }, allowSetters = true)
    private Registration registration;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Event id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNotes() {
        return this.notes;
    }

    public Event notes(String notes) {
        this.setNotes(notes);
        return this;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public ZonedDateTime getTimestamp() {
        return this.timestamp;
    }

    public Event timestamp(ZonedDateTime timestamp) {
        this.setTimestamp(timestamp);
        return this;
    }

    public void setTimestamp(ZonedDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public TreatmentPriority getUrgencyOfMedicalTreatment() {
        return this.urgencyOfMedicalTreatment;
    }

    public Event urgencyOfMedicalTreatment(TreatmentPriority urgencyOfMedicalTreatment) {
        this.setUrgencyOfMedicalTreatment(urgencyOfMedicalTreatment);
        return this;
    }

    public void setUrgencyOfMedicalTreatment(TreatmentPriority urgencyOfMedicalTreatment) {
        this.urgencyOfMedicalTreatment = urgencyOfMedicalTreatment;
    }

    public Integer getNeedForLegalAssistance() {
        return this.needForLegalAssistance;
    }

    public Event needForLegalAssistance(Integer needForLegalAssistance) {
        this.setNeedForLegalAssistance(needForLegalAssistance);
        return this;
    }

    public void setNeedForLegalAssistance(Integer needForLegalAssistance) {
        this.needForLegalAssistance = needForLegalAssistance;
    }

    public EventType getCategory() {
        return this.category;
    }

    public void setCategory(EventType eventType) {
        this.category = eventType;
    }

    public Event category(EventType eventType) {
        this.setCategory(eventType);
        return this;
    }

    public CheckPoint getCheckPoint() {
        return this.checkPoint;
    }

    public void setCheckPoint(CheckPoint checkPoint) {
        this.checkPoint = checkPoint;
    }

    public Event checkPoint(CheckPoint checkPoint) {
        this.setCheckPoint(checkPoint);
        return this;
    }

    public Operator getOperator() {
        return this.operator;
    }

    public void setOperator(Operator operator) {
        this.operator = operator;
    }

    public Event operator(Operator operator) {
        this.setOperator(operator);
        return this;
    }

    public Registration getRegistration() {
        return this.registration;
    }

    public void setRegistration(Registration registration) {
        this.registration = registration;
    }

    public Event registration(Registration registration) {
        this.setRegistration(registration);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Event)) {
            return false;
        }
        return id != null && id.equals(((Event) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Event{" +
            "id=" + getId() +
            ", notes='" + getNotes() + "'" +
            ", timestamp='" + getTimestamp() + "'" +
            ", urgencyOfMedicalTreatment='" + getUrgencyOfMedicalTreatment() + "'" +
            ", needForLegalAssistance=" + getNeedForLegalAssistance() +
            "}";
    }
}
