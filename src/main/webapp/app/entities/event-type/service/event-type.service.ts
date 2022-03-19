import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEventType, getEventTypeIdentifier } from '../event-type.model';

export type EntityResponseType = HttpResponse<IEventType>;
export type EntityArrayResponseType = HttpResponse<IEventType[]>;

@Injectable({ providedIn: 'root' })
export class EventTypeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/event-types');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(eventType: IEventType): Observable<EntityResponseType> {
    return this.http.post<IEventType>(this.resourceUrl, eventType, { observe: 'response' });
  }

  update(eventType: IEventType): Observable<EntityResponseType> {
    return this.http.put<IEventType>(`${this.resourceUrl}/${getEventTypeIdentifier(eventType) as number}`, eventType, {
      observe: 'response',
    });
  }

  partialUpdate(eventType: IEventType): Observable<EntityResponseType> {
    return this.http.patch<IEventType>(`${this.resourceUrl}/${getEventTypeIdentifier(eventType) as number}`, eventType, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEventType>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEventType[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEventTypeToCollectionIfMissing(
    eventTypeCollection: IEventType[],
    ...eventTypesToCheck: (IEventType | null | undefined)[]
  ): IEventType[] {
    const eventTypes: IEventType[] = eventTypesToCheck.filter(isPresent);
    if (eventTypes.length > 0) {
      const eventTypeCollectionIdentifiers = eventTypeCollection.map(eventTypeItem => getEventTypeIdentifier(eventTypeItem)!);
      const eventTypesToAdd = eventTypes.filter(eventTypeItem => {
        const eventTypeIdentifier = getEventTypeIdentifier(eventTypeItem);
        if (eventTypeIdentifier == null || eventTypeCollectionIdentifiers.includes(eventTypeIdentifier)) {
          return false;
        }
        eventTypeCollectionIdentifiers.push(eventTypeIdentifier);
        return true;
      });
      return [...eventTypesToAdd, ...eventTypeCollection];
    }
    return eventTypeCollection;
  }
}
