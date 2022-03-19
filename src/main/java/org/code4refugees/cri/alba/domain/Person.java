package org.code4refugees.cri.alba.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.code4refugees.cri.alba.domain.enumeration.Language;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Person.
 */
@Entity
@Table(name = "person")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Person implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "personal_identifier")
    private String personalIdentifier;

    @Column(name = "identifier_type")
    private String identifierType;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "email")
    private String email;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "first_spoken_language")
    private Language firstSpokenLanguage;

    @Enumerated(EnumType.STRING)
    @Column(name = "second_spoken_language")
    private Language secondSpokenLanguage;

    @JsonIgnoreProperties(value = { "country" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Location comingFrom;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Person id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPersonalIdentifier() {
        return this.personalIdentifier;
    }

    public Person personalIdentifier(String personalIdentifier) {
        this.setPersonalIdentifier(personalIdentifier);
        return this;
    }

    public void setPersonalIdentifier(String personalIdentifier) {
        this.personalIdentifier = personalIdentifier;
    }

    public String getIdentifierType() {
        return this.identifierType;
    }

    public Person identifierType(String identifierType) {
        this.setIdentifierType(identifierType);
        return this;
    }

    public void setIdentifierType(String identifierType) {
        this.identifierType = identifierType;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public Person firstName(String firstName) {
        this.setFirstName(firstName);
        return this;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public Person lastName(String lastName) {
        this.setLastName(lastName);
        return this;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return this.email;
    }

    public Person email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return this.phoneNumber;
    }

    public Person phoneNumber(String phoneNumber) {
        this.setPhoneNumber(phoneNumber);
        return this;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Language getFirstSpokenLanguage() {
        return this.firstSpokenLanguage;
    }

    public Person firstSpokenLanguage(Language firstSpokenLanguage) {
        this.setFirstSpokenLanguage(firstSpokenLanguage);
        return this;
    }

    public void setFirstSpokenLanguage(Language firstSpokenLanguage) {
        this.firstSpokenLanguage = firstSpokenLanguage;
    }

    public Language getSecondSpokenLanguage() {
        return this.secondSpokenLanguage;
    }

    public Person secondSpokenLanguage(Language secondSpokenLanguage) {
        this.setSecondSpokenLanguage(secondSpokenLanguage);
        return this;
    }

    public void setSecondSpokenLanguage(Language secondSpokenLanguage) {
        this.secondSpokenLanguage = secondSpokenLanguage;
    }

    public Location getComingFrom() {
        return this.comingFrom;
    }

    public void setComingFrom(Location location) {
        this.comingFrom = location;
    }

    public Person comingFrom(Location location) {
        this.setComingFrom(location);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Person)) {
            return false;
        }
        return id != null && id.equals(((Person) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Person{" +
            "id=" + getId() +
            ", personalIdentifier='" + getPersonalIdentifier() + "'" +
            ", identifierType='" + getIdentifierType() + "'" +
            ", firstName='" + getFirstName() + "'" +
            ", lastName='" + getLastName() + "'" +
            ", email='" + getEmail() + "'" +
            ", phoneNumber='" + getPhoneNumber() + "'" +
            ", firstSpokenLanguage='" + getFirstSpokenLanguage() + "'" +
            ", secondSpokenLanguage='" + getSecondSpokenLanguage() + "'" +
            "}";
    }
}
