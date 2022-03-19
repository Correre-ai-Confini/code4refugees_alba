import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFamilyRelation, getFamilyRelationIdentifier } from '../family-relation.model';

export type EntityResponseType = HttpResponse<IFamilyRelation>;
export type EntityArrayResponseType = HttpResponse<IFamilyRelation[]>;

@Injectable({ providedIn: 'root' })
export class FamilyRelationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/family-relations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(familyRelation: IFamilyRelation): Observable<EntityResponseType> {
    return this.http.post<IFamilyRelation>(this.resourceUrl, familyRelation, { observe: 'response' });
  }

  update(familyRelation: IFamilyRelation): Observable<EntityResponseType> {
    return this.http.put<IFamilyRelation>(`${this.resourceUrl}/${getFamilyRelationIdentifier(familyRelation) as number}`, familyRelation, {
      observe: 'response',
    });
  }

  partialUpdate(familyRelation: IFamilyRelation): Observable<EntityResponseType> {
    return this.http.patch<IFamilyRelation>(
      `${this.resourceUrl}/${getFamilyRelationIdentifier(familyRelation) as number}`,
      familyRelation,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFamilyRelation>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFamilyRelation[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFamilyRelationToCollectionIfMissing(
    familyRelationCollection: IFamilyRelation[],
    ...familyRelationsToCheck: (IFamilyRelation | null | undefined)[]
  ): IFamilyRelation[] {
    const familyRelations: IFamilyRelation[] = familyRelationsToCheck.filter(isPresent);
    if (familyRelations.length > 0) {
      const familyRelationCollectionIdentifiers = familyRelationCollection.map(
        familyRelationItem => getFamilyRelationIdentifier(familyRelationItem)!
      );
      const familyRelationsToAdd = familyRelations.filter(familyRelationItem => {
        const familyRelationIdentifier = getFamilyRelationIdentifier(familyRelationItem);
        if (familyRelationIdentifier == null || familyRelationCollectionIdentifiers.includes(familyRelationIdentifier)) {
          return false;
        }
        familyRelationCollectionIdentifiers.push(familyRelationIdentifier);
        return true;
      });
      return [...familyRelationsToAdd, ...familyRelationCollection];
    }
    return familyRelationCollection;
  }
}
