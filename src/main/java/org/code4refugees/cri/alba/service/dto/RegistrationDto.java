package org.code4refugees.cri.alba.service.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import org.code4refugees.cri.alba.domain.*;
import org.code4refugees.cri.alba.domain.enumeration.Edulevel;
import org.code4refugees.cri.alba.domain.enumeration.Gender;
import org.code4refugees.cri.alba.domain.enumeration.Religion;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * A Registration.
 */

@Data
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class RegistrationDto implements Serializable {

    private static final long serialVersionUID = 1335238L;
    private String notes;
    private String qrcodeUUID;

    @Lob
    private byte[] legalConsentBlob;
    private String legalConsentBlobContentType;

    private Job primaryOccupation;
    private Person personalInformation;

    private Edulevel educationalLevel;
    private Boolean mandatoryTutored;
    private LocalDate birthDate;
    private Boolean disabledPerson;

    @Enumerated(EnumType.STRING)
    private Religion religion;
    @Enumerated(EnumType.STRING)
    private Gender gender;
}
