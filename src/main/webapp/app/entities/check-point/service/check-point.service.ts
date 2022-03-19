import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICheckPoint, getCheckPointIdentifier } from '../check-point.model';

export type EntityResponseType = HttpResponse<ICheckPoint>;
export type EntityArrayResponseType = HttpResponse<ICheckPoint[]>;

@Injectable({ providedIn: 'root' })
export class CheckPointService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/check-points');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(checkPoint: ICheckPoint): Observable<EntityResponseType> {
    return this.http.post<ICheckPoint>(this.resourceUrl, checkPoint, { observe: 'response' });
  }

  update(checkPoint: ICheckPoint): Observable<EntityResponseType> {
    return this.http.put<ICheckPoint>(`${this.resourceUrl}/${getCheckPointIdentifier(checkPoint) as number}`, checkPoint, {
      observe: 'response',
    });
  }

  partialUpdate(checkPoint: ICheckPoint): Observable<EntityResponseType> {
    return this.http.patch<ICheckPoint>(`${this.resourceUrl}/${getCheckPointIdentifier(checkPoint) as number}`, checkPoint, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICheckPoint>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICheckPoint[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCheckPointToCollectionIfMissing(
    checkPointCollection: ICheckPoint[],
    ...checkPointsToCheck: (ICheckPoint | null | undefined)[]
  ): ICheckPoint[] {
    const checkPoints: ICheckPoint[] = checkPointsToCheck.filter(isPresent);
    if (checkPoints.length > 0) {
      const checkPointCollectionIdentifiers = checkPointCollection.map(checkPointItem => getCheckPointIdentifier(checkPointItem)!);
      const checkPointsToAdd = checkPoints.filter(checkPointItem => {
        const checkPointIdentifier = getCheckPointIdentifier(checkPointItem);
        if (checkPointIdentifier == null || checkPointCollectionIdentifiers.includes(checkPointIdentifier)) {
          return false;
        }
        checkPointCollectionIdentifiers.push(checkPointIdentifier);
        return true;
      });
      return [...checkPointsToAdd, ...checkPointCollection];
    }
    return checkPointCollection;
  }
}
