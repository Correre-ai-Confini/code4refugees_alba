import { IAttachment } from 'app/entities/attachment/attachment.model';

export interface IMedicalSurvey {
  id?: number;
  ongoingIllnesses?: string | null;
  ongoingTreatments?: string | null;
  attachment?: IAttachment | null;
}

export class MedicalSurvey implements IMedicalSurvey {
  constructor(
    public id?: number,
    public ongoingIllnesses?: string | null,
    public ongoingTreatments?: string | null,
    public attachment?: IAttachment | null
  ) {}
}

export function getMedicalSurveyIdentifier(medicalSurvey: IMedicalSurvey): number | undefined {
  return medicalSurvey.id;
}
