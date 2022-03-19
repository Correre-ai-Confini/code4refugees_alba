import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMedicalSurvey, getMedicalSurveyIdentifier } from '../medical-survey.model';

export type EntityResponseType = HttpResponse<IMedicalSurvey>;
export type EntityArrayResponseType = HttpResponse<IMedicalSurvey[]>;

@Injectable({ providedIn: 'root' })
export class MedicalSurveyService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/medical-surveys');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(medicalSurvey: IMedicalSurvey): Observable<EntityResponseType> {
    return this.http.post<IMedicalSurvey>(this.resourceUrl, medicalSurvey, { observe: 'response' });
  }

  update(medicalSurvey: IMedicalSurvey): Observable<EntityResponseType> {
    return this.http.put<IMedicalSurvey>(`${this.resourceUrl}/${getMedicalSurveyIdentifier(medicalSurvey) as number}`, medicalSurvey, {
      observe: 'response',
    });
  }

  partialUpdate(medicalSurvey: IMedicalSurvey): Observable<EntityResponseType> {
    return this.http.patch<IMedicalSurvey>(`${this.resourceUrl}/${getMedicalSurveyIdentifier(medicalSurvey) as number}`, medicalSurvey, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMedicalSurvey>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMedicalSurvey[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addMedicalSurveyToCollectionIfMissing(
    medicalSurveyCollection: IMedicalSurvey[],
    ...medicalSurveysToCheck: (IMedicalSurvey | null | undefined)[]
  ): IMedicalSurvey[] {
    const medicalSurveys: IMedicalSurvey[] = medicalSurveysToCheck.filter(isPresent);
    if (medicalSurveys.length > 0) {
      const medicalSurveyCollectionIdentifiers = medicalSurveyCollection.map(
        medicalSurveyItem => getMedicalSurveyIdentifier(medicalSurveyItem)!
      );
      const medicalSurveysToAdd = medicalSurveys.filter(medicalSurveyItem => {
        const medicalSurveyIdentifier = getMedicalSurveyIdentifier(medicalSurveyItem);
        if (medicalSurveyIdentifier == null || medicalSurveyCollectionIdentifiers.includes(medicalSurveyIdentifier)) {
          return false;
        }
        medicalSurveyCollectionIdentifiers.push(medicalSurveyIdentifier);
        return true;
      });
      return [...medicalSurveysToAdd, ...medicalSurveyCollection];
    }
    return medicalSurveyCollection;
  }
}
