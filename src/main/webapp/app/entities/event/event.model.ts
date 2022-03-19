import dayjs from 'dayjs/esm';
import { IEventType } from 'app/entities/event-type/event-type.model';
import { ICheckPoint } from 'app/entities/check-point/check-point.model';
import { IOperator } from 'app/entities/operator/operator.model';
import { IRegistration } from 'app/entities/registration/registration.model';
import { TreatmentPriority } from 'app/entities/enumerations/treatment-priority.model';

export interface IEvent {
  id?: number;
  notes?: string | null;
  timestamp?: dayjs.Dayjs | null;
  urgencyOfMedicalTreatment?: TreatmentPriority | null;
  needForLegalAssistance?: number | null;
  category?: IEventType | null;
  checkPoint?: ICheckPoint | null;
  operator?: IOperator | null;
  registration?: IRegistration | null;
}

export class Event implements IEvent {
  constructor(
    public id?: number,
    public notes?: string | null,
    public timestamp?: dayjs.Dayjs | null,
    public urgencyOfMedicalTreatment?: TreatmentPriority | null,
    public needForLegalAssistance?: number | null,
    public category?: IEventType | null,
    public checkPoint?: ICheckPoint | null,
    public operator?: IOperator | null,
    public registration?: IRegistration | null
  ) {}
}

export function getEventIdentifier(event: IEvent): number | undefined {
  return event.id;
}
