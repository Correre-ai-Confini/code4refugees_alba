package org.code4refugees.cri.alba.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.code4refugees.cri.alba.domain.enumeration.KindOfOperator;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Operator.
 */
@Entity
@Table(name = "operator")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Operator implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "kind_of_operator")
    private KindOfOperator kindOfOperator;

    @JsonIgnoreProperties(value = { "comingFrom" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Person personalInformation;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Operator id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public KindOfOperator getKindOfOperator() {
        return this.kindOfOperator;
    }

    public Operator kindOfOperator(KindOfOperator kindOfOperator) {
        this.setKindOfOperator(kindOfOperator);
        return this;
    }

    public void setKindOfOperator(KindOfOperator kindOfOperator) {
        this.kindOfOperator = kindOfOperator;
    }

    public Person getPersonalInformation() {
        return this.personalInformation;
    }

    public void setPersonalInformation(Person person) {
        this.personalInformation = person;
    }

    public Operator personalInformation(Person person) {
        this.setPersonalInformation(person);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Operator)) {
            return false;
        }
        return id != null && id.equals(((Operator) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Operator{" +
            "id=" + getId() +
            ", kindOfOperator='" + getKindOfOperator() + "'" +
            "}";
    }
}
