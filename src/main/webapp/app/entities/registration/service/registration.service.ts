import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRegistration, getRegistrationIdentifier } from '../registration.model';

export type EntityResponseType = HttpResponse<IRegistration>;
export type EntityArrayResponseType = HttpResponse<IRegistration[]>;

@Injectable({ providedIn: 'root' })
export class RegistrationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/registrations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(registration: IRegistration): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(registration);
    return this.http
      .post<IRegistration>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(registration: IRegistration): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(registration);
    return this.http
      .put<IRegistration>(`${this.resourceUrl}/${getRegistrationIdentifier(registration) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(registration: IRegistration): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(registration);
    return this.http
      .patch<IRegistration>(`${this.resourceUrl}/${getRegistrationIdentifier(registration) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IRegistration>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IRegistration[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addRegistrationToCollectionIfMissing(
    registrationCollection: IRegistration[],
    ...registrationsToCheck: (IRegistration | null | undefined)[]
  ): IRegistration[] {
    const registrations: IRegistration[] = registrationsToCheck.filter(isPresent);
    if (registrations.length > 0) {
      const registrationCollectionIdentifiers = registrationCollection.map(
        registrationItem => getRegistrationIdentifier(registrationItem)!
      );
      const registrationsToAdd = registrations.filter(registrationItem => {
        const registrationIdentifier = getRegistrationIdentifier(registrationItem);
        if (registrationIdentifier == null || registrationCollectionIdentifiers.includes(registrationIdentifier)) {
          return false;
        }
        registrationCollectionIdentifiers.push(registrationIdentifier);
        return true;
      });
      return [...registrationsToAdd, ...registrationCollection];
    }
    return registrationCollection;
  }

  protected convertDateFromClient(registration: IRegistration): IRegistration {
    return Object.assign({}, registration, {
      timestamp: registration.timestamp?.isValid() ? registration.timestamp.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.timestamp = res.body.timestamp ? dayjs(res.body.timestamp) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((registration: IRegistration) => {
        registration.timestamp = registration.timestamp ? dayjs(registration.timestamp) : undefined;
      });
    }
    return res;
  }
}
