import dayjs from 'dayjs/esm';
import { IRefugee } from 'app/entities/refugee/refugee.model';
import { IEvent } from 'app/entities/event/event.model';

export interface IRegistration {
  id?: number;
  notes?: string | null;
  timestamp?: dayjs.Dayjs | null;
  legalConsentBlobContentType?: string | null;
  legalConsentBlob?: string | null;
  refugee?: IRefugee | null;
  events?: IEvent[] | null;
}

export class Registration implements IRegistration {
  constructor(
    public id?: number,
    public notes?: string | null,
    public timestamp?: dayjs.Dayjs | null,
    public legalConsentBlobContentType?: string | null,
    public legalConsentBlob?: string | null,
    public refugee?: IRefugee | null,
    public events?: IEvent[] | null
  ) {}
}

export function getRegistrationIdentifier(registration: IRegistration): number | undefined {
  return registration.id;
}
