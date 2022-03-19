import { ILocation } from 'app/entities/location/location.model';
import { Language } from 'app/entities/enumerations/language.model';

export interface IPerson {
  id?: number;
  personalIdentifier?: string | null;
  identifierType?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  firstSpokenLanguage?: Language | null;
  secondSpokenLanguage?: Language | null;
  comingFrom?: ILocation | null;
}

export class Person implements IPerson {
  constructor(
    public id?: number,
    public personalIdentifier?: string | null,
    public identifierType?: string | null,
    public firstName?: string | null,
    public lastName?: string | null,
    public email?: string | null,
    public phoneNumber?: string | null,
    public firstSpokenLanguage?: Language | null,
    public secondSpokenLanguage?: Language | null,
    public comingFrom?: ILocation | null
  ) {}
}

export function getPersonIdentifier(person: IPerson): number | undefined {
  return person.id;
}
