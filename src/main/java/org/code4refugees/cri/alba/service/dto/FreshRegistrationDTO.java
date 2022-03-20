package org.code4refugees.cri.alba.service.dto;

import lombok.Data;
import org.code4refugees.cri.alba.domain.Event;
import org.code4refugees.cri.alba.domain.Person;
import org.code4refugees.cri.alba.domain.Refugee;
import org.code4refugees.cri.alba.domain.Registration;

@Data
public class FreshRegistrationDTO {
    Registration registration;
    Event event;
    Refugee refugee;
    Person refugeePerson;
}
