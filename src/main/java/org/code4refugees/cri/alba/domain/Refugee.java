package org.code4refugees.cri.alba.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.code4refugees.cri.alba.domain.enumeration.Edulevel;
import org.code4refugees.cri.alba.domain.enumeration.Gender;
import org.code4refugees.cri.alba.domain.enumeration.Religion;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Refugee.
 */
@Entity
@Table(name = "refugee")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Refugee implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "qrcode_uuid")
    private String qrcodeUUID;

    @Enumerated(EnumType.STRING)
    @Column(name = "educational_level")
    private Edulevel educationalLevel;

    @Column(name = "mandatory_tutored")
    private Boolean mandatoryTutored;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Column(name = "disabled_person")
    private Boolean disabledPerson;

    @Enumerated(EnumType.STRING)
    @Column(name = "religion")
    private Religion religion;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;

    @JsonIgnoreProperties(value = { "comingFrom" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Person personalInformation;

    @ManyToOne
    private Job primaryOccupation;

    @ManyToOne
    @JsonIgnoreProperties(value = { "attachment" }, allowSetters = true)
    private LegalSurvey legalSurvey;

    @ManyToOne
    @JsonIgnoreProperties(value = { "attachment" }, allowSetters = true)
    private MedicalSurvey medicalSurvey;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Refugee id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQrcodeUUID() {
        return this.qrcodeUUID;
    }

    public Refugee qrcodeUUID(String qrcodeUUID) {
        this.setQrcodeUUID(qrcodeUUID);
        return this;
    }

    public void setQrcodeUUID(String qrcodeUUID) {
        this.qrcodeUUID = qrcodeUUID;
    }

    public Edulevel getEducationalLevel() {
        return this.educationalLevel;
    }

    public Refugee educationalLevel(Edulevel educationalLevel) {
        this.setEducationalLevel(educationalLevel);
        return this;
    }

    public void setEducationalLevel(Edulevel educationalLevel) {
        this.educationalLevel = educationalLevel;
    }

    public Boolean getMandatoryTutored() {
        return this.mandatoryTutored;
    }

    public Refugee mandatoryTutored(Boolean mandatoryTutored) {
        this.setMandatoryTutored(mandatoryTutored);
        return this;
    }

    public void setMandatoryTutored(Boolean mandatoryTutored) {
        this.mandatoryTutored = mandatoryTutored;
    }

    public LocalDate getBirthDate() {
        return this.birthDate;
    }

    public Refugee birthDate(LocalDate birthDate) {
        this.setBirthDate(birthDate);
        return this;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public Boolean getDisabledPerson() {
        return this.disabledPerson;
    }

    public Refugee disabledPerson(Boolean disabledPerson) {
        this.setDisabledPerson(disabledPerson);
        return this;
    }

    public void setDisabledPerson(Boolean disabledPerson) {
        this.disabledPerson = disabledPerson;
    }

    public Religion getReligion() {
        return this.religion;
    }

    public Refugee religion(Religion religion) {
        this.setReligion(religion);
        return this;
    }

    public void setReligion(Religion religion) {
        this.religion = religion;
    }

    public Gender getGender() {
        return this.gender;
    }

    public Refugee gender(Gender gender) {
        this.setGender(gender);
        return this;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public Person getPersonalInformation() {
        return this.personalInformation;
    }

    public void setPersonalInformation(Person person) {
        this.personalInformation = person;
    }

    public Refugee personalInformation(Person person) {
        this.setPersonalInformation(person);
        return this;
    }

    public Job getPrimaryOccupation() {
        return this.primaryOccupation;
    }

    public void setPrimaryOccupation(Job job) {
        this.primaryOccupation = job;
    }

    public Refugee primaryOccupation(Job job) {
        this.setPrimaryOccupation(job);
        return this;
    }

    public LegalSurvey getLegalSurvey() {
        return this.legalSurvey;
    }

    public void setLegalSurvey(LegalSurvey legalSurvey) {
        this.legalSurvey = legalSurvey;
    }

    public Refugee legalSurvey(LegalSurvey legalSurvey) {
        this.setLegalSurvey(legalSurvey);
        return this;
    }

    public MedicalSurvey getMedicalSurvey() {
        return this.medicalSurvey;
    }

    public void setMedicalSurvey(MedicalSurvey medicalSurvey) {
        this.medicalSurvey = medicalSurvey;
    }

    public Refugee medicalSurvey(MedicalSurvey medicalSurvey) {
        this.setMedicalSurvey(medicalSurvey);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Refugee)) {
            return false;
        }
        return id != null && id.equals(((Refugee) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Refugee{" +
            "id=" + getId() +
            ", qrcodeUUID='" + getQrcodeUUID() + "'" +
            ", educationalLevel='" + getEducationalLevel() + "'" +
            ", mandatoryTutored='" + getMandatoryTutored() + "'" +
            ", birthDate='" + getBirthDate() + "'" +
            ", disabledPerson='" + getDisabledPerson() + "'" +
            ", religion='" + getReligion() + "'" +
            ", gender='" + getGender() + "'" +
            "}";
    }
}
