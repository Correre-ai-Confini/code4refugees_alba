import { IEvent } from "../event/event.model";
import { IPerson } from "../person/person.model";
import { IRefugee } from "../refugee/refugee.model";
import { IRegistration } from "../registration/registration.model";

export interface IFirstRegistration {
  registration: Partial<IRegistration>;
  person: Partial<IPerson>,
  refugee: Partial<IRefugee>,
  event: Partial<IEvent>
}
