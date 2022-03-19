import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAttachment, getAttachmentIdentifier } from '../attachment.model';

export type EntityResponseType = HttpResponse<IAttachment>;
export type EntityArrayResponseType = HttpResponse<IAttachment[]>;

@Injectable({ providedIn: 'root' })
export class AttachmentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/attachments');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(attachment: IAttachment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(attachment);
    return this.http
      .post<IAttachment>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(attachment: IAttachment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(attachment);
    return this.http
      .put<IAttachment>(`${this.resourceUrl}/${getAttachmentIdentifier(attachment) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(attachment: IAttachment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(attachment);
    return this.http
      .patch<IAttachment>(`${this.resourceUrl}/${getAttachmentIdentifier(attachment) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IAttachment>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IAttachment[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAttachmentToCollectionIfMissing(
    attachmentCollection: IAttachment[],
    ...attachmentsToCheck: (IAttachment | null | undefined)[]
  ): IAttachment[] {
    const attachments: IAttachment[] = attachmentsToCheck.filter(isPresent);
    if (attachments.length > 0) {
      const attachmentCollectionIdentifiers = attachmentCollection.map(attachmentItem => getAttachmentIdentifier(attachmentItem)!);
      const attachmentsToAdd = attachments.filter(attachmentItem => {
        const attachmentIdentifier = getAttachmentIdentifier(attachmentItem);
        if (attachmentIdentifier == null || attachmentCollectionIdentifiers.includes(attachmentIdentifier)) {
          return false;
        }
        attachmentCollectionIdentifiers.push(attachmentIdentifier);
        return true;
      });
      return [...attachmentsToAdd, ...attachmentCollection];
    }
    return attachmentCollection;
  }

  protected convertDateFromClient(attachment: IAttachment): IAttachment {
    return Object.assign({}, attachment, {
      creationTS: attachment.creationTS?.isValid() ? attachment.creationTS.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.creationTS = res.body.creationTS ? dayjs(res.body.creationTS) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((attachment: IAttachment) => {
        attachment.creationTS = attachment.creationTS ? dayjs(attachment.creationTS) : undefined;
      });
    }
    return res;
  }
}
