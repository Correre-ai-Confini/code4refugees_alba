import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRefugee, getRefugeeIdentifier } from '../refugee.model';

export type EntityResponseType = HttpResponse<IRefugee>;
export type EntityArrayResponseType = HttpResponse<IRefugee[]>;

@Injectable({ providedIn: 'root' })
export class RefugeeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/refugees');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(refugee: IRefugee): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(refugee);
    return this.http
      .post<IRefugee>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(refugee: IRefugee): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(refugee);
    return this.http
      .put<IRefugee>(`${this.resourceUrl}/${getRefugeeIdentifier(refugee) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(refugee: IRefugee): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(refugee);
    return this.http
      .patch<IRefugee>(`${this.resourceUrl}/${getRefugeeIdentifier(refugee) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IRefugee>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IRefugee[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addRefugeeToCollectionIfMissing(refugeeCollection: IRefugee[], ...refugeesToCheck: (IRefugee | null | undefined)[]): IRefugee[] {
    const refugees: IRefugee[] = refugeesToCheck.filter(isPresent);
    if (refugees.length > 0) {
      const refugeeCollectionIdentifiers = refugeeCollection.map(refugeeItem => getRefugeeIdentifier(refugeeItem)!);
      const refugeesToAdd = refugees.filter(refugeeItem => {
        const refugeeIdentifier = getRefugeeIdentifier(refugeeItem);
        if (refugeeIdentifier == null || refugeeCollectionIdentifiers.includes(refugeeIdentifier)) {
          return false;
        }
        refugeeCollectionIdentifiers.push(refugeeIdentifier);
        return true;
      });
      return [...refugeesToAdd, ...refugeeCollection];
    }
    return refugeeCollection;
  }

  protected convertDateFromClient(refugee: IRefugee): IRefugee {
    return Object.assign({}, refugee, {
      birthDate: refugee.birthDate?.isValid() ? refugee.birthDate.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.birthDate = res.body.birthDate ? dayjs(res.body.birthDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((refugee: IRefugee) => {
        refugee.birthDate = refugee.birthDate ? dayjs(refugee.birthDate) : undefined;
      });
    }
    return res;
  }
}
