import dayjs from 'dayjs/esm';
import { IPerson } from 'app/entities/person/person.model';
import { IJob } from 'app/entities/job/job.model';
import { ILegalSurvey } from 'app/entities/legal-survey/legal-survey.model';
import { IMedicalSurvey } from 'app/entities/medical-survey/medical-survey.model';
import { Edulevel } from 'app/entities/enumerations/edulevel.model';
import { Religion } from 'app/entities/enumerations/religion.model';
import { Gender } from 'app/entities/enumerations/gender.model';

export interface IRefugee {
  id?: number;
  qrcodeUUID?: string | null;
  educationalLevel?: Edulevel | null;
  mandatoryTutored?: boolean | null;
  birthDate?: dayjs.Dayjs | null;
  disabledPerson?: boolean | null;
  religion?: Religion | null;
  gender?: Gender | null;
  personalInformation?: IPerson | null;
  primaryOccupation?: IJob | null;
  legalSurvey?: ILegalSurvey | null;
  medicalSurvey?: IMedicalSurvey | null;
}

export class Refugee implements IRefugee {
  constructor(
    public id?: number,
    public qrcodeUUID?: string | null,
    public educationalLevel?: Edulevel | null,
    public mandatoryTutored?: boolean | null,
    public birthDate?: dayjs.Dayjs | null,
    public disabledPerson?: boolean | null,
    public religion?: Religion | null,
    public gender?: Gender | null,
    public personalInformation?: IPerson | null,
    public primaryOccupation?: IJob | null,
    public legalSurvey?: ILegalSurvey | null,
    public medicalSurvey?: IMedicalSurvey | null
  ) {
    this.mandatoryTutored = this.mandatoryTutored ?? false;
    this.disabledPerson = this.disabledPerson ?? false;
  }
}

export function getRefugeeIdentifier(refugee: IRefugee): number | undefined {
  return refugee.id;
}
