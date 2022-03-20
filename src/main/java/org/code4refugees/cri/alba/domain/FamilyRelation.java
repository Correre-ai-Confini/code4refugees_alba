package org.code4refugees.cri.alba.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.code4refugees.cri.alba.domain.enumeration.FamilyRelationType;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A FamilyRelation.
 */
@Entity
@Table(name = "family_relation")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class FamilyRelation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "notes")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(name = "rel_type")
    private FamilyRelationType relType;

    @ManyToOne
    @JsonIgnoreProperties(value = { "personalInformation", "primaryOccupation", "legalSurvey", "medicalSurvey" }, allowSetters = true)
    private Refugee refugee1;

    @ManyToOne
    @JsonIgnoreProperties(value = { "personalInformation", "primaryOccupation", "legalSurvey", "medicalSurvey" }, allowSetters = true)
    private Refugee refugee2;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public FamilyRelation id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNotes() {
        return this.notes;
    }

    public FamilyRelation notes(String notes) {
        this.setNotes(notes);
        return this;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public FamilyRelationType getRelType() {
        return this.relType;
    }

    public FamilyRelation relType(FamilyRelationType relType) {
        this.setRelType(relType);
        return this;
    }

    public void setRelType(FamilyRelationType relType) {
        this.relType = relType;
    }

    public Refugee getRefugee1() {
        return this.refugee1;
    }

    public void setRefugee1(Refugee refugee) {
        this.refugee1 = refugee;
    }

    public FamilyRelation refugee1(Refugee refugee) {
        this.setRefugee1(refugee);
        return this;
    }

    public Refugee getRefugee2() {
        return this.refugee2;
    }

    public void setRefugee2(Refugee refugee) {
        this.refugee2 = refugee;
    }

    public FamilyRelation refugee2(Refugee refugee) {
        this.setRefugee2(refugee);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FamilyRelation)) {
            return false;
        }
        return id != null && id.equals(((FamilyRelation) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FamilyRelation{" +
            "id=" + getId() +
            ", notes='" + getNotes() + "'" +
            ", relType='" + getRelType() + "'" +
            "}";
    }
}
