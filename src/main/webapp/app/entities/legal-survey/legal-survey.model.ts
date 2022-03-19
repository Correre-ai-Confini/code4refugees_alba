import { IAttachment } from 'app/entities/attachment/attachment.model';

export interface ILegalSurvey {
  id?: number;
  notes?: string | null;
  issues?: string | null;
  attachment?: IAttachment | null;
}

export class LegalSurvey implements ILegalSurvey {
  constructor(public id?: number, public notes?: string | null, public issues?: string | null, public attachment?: IAttachment | null) {}
}

export function getLegalSurveyIdentifier(legalSurvey: ILegalSurvey): number | undefined {
  return legalSurvey.id;
}
