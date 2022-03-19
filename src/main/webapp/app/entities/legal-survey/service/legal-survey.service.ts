import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILegalSurvey, getLegalSurveyIdentifier } from '../legal-survey.model';

export type EntityResponseType = HttpResponse<ILegalSurvey>;
export type EntityArrayResponseType = HttpResponse<ILegalSurvey[]>;

@Injectable({ providedIn: 'root' })
export class LegalSurveyService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/legal-surveys');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(legalSurvey: ILegalSurvey): Observable<EntityResponseType> {
    return this.http.post<ILegalSurvey>(this.resourceUrl, legalSurvey, { observe: 'response' });
  }

  update(legalSurvey: ILegalSurvey): Observable<EntityResponseType> {
    return this.http.put<ILegalSurvey>(`${this.resourceUrl}/${getLegalSurveyIdentifier(legalSurvey) as number}`, legalSurvey, {
      observe: 'response',
    });
  }

  partialUpdate(legalSurvey: ILegalSurvey): Observable<EntityResponseType> {
    return this.http.patch<ILegalSurvey>(`${this.resourceUrl}/${getLegalSurveyIdentifier(legalSurvey) as number}`, legalSurvey, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILegalSurvey>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILegalSurvey[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addLegalSurveyToCollectionIfMissing(
    legalSurveyCollection: ILegalSurvey[],
    ...legalSurveysToCheck: (ILegalSurvey | null | undefined)[]
  ): ILegalSurvey[] {
    const legalSurveys: ILegalSurvey[] = legalSurveysToCheck.filter(isPresent);
    if (legalSurveys.length > 0) {
      const legalSurveyCollectionIdentifiers = legalSurveyCollection.map(legalSurveyItem => getLegalSurveyIdentifier(legalSurveyItem)!);
      const legalSurveysToAdd = legalSurveys.filter(legalSurveyItem => {
        const legalSurveyIdentifier = getLegalSurveyIdentifier(legalSurveyItem);
        if (legalSurveyIdentifier == null || legalSurveyCollectionIdentifiers.includes(legalSurveyIdentifier)) {
          return false;
        }
        legalSurveyCollectionIdentifiers.push(legalSurveyIdentifier);
        return true;
      });
      return [...legalSurveysToAdd, ...legalSurveyCollection];
    }
    return legalSurveyCollection;
  }
}
