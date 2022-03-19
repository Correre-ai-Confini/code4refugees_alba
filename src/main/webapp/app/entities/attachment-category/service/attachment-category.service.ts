import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAttachmentCategory, getAttachmentCategoryIdentifier } from '../attachment-category.model';

export type EntityResponseType = HttpResponse<IAttachmentCategory>;
export type EntityArrayResponseType = HttpResponse<IAttachmentCategory[]>;

@Injectable({ providedIn: 'root' })
export class AttachmentCategoryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/attachment-categories');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(attachmentCategory: IAttachmentCategory): Observable<EntityResponseType> {
    return this.http.post<IAttachmentCategory>(this.resourceUrl, attachmentCategory, { observe: 'response' });
  }

  update(attachmentCategory: IAttachmentCategory): Observable<EntityResponseType> {
    return this.http.put<IAttachmentCategory>(
      `${this.resourceUrl}/${getAttachmentCategoryIdentifier(attachmentCategory) as number}`,
      attachmentCategory,
      { observe: 'response' }
    );
  }

  partialUpdate(attachmentCategory: IAttachmentCategory): Observable<EntityResponseType> {
    return this.http.patch<IAttachmentCategory>(
      `${this.resourceUrl}/${getAttachmentCategoryIdentifier(attachmentCategory) as number}`,
      attachmentCategory,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAttachmentCategory>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAttachmentCategory[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAttachmentCategoryToCollectionIfMissing(
    attachmentCategoryCollection: IAttachmentCategory[],
    ...attachmentCategoriesToCheck: (IAttachmentCategory | null | undefined)[]
  ): IAttachmentCategory[] {
    const attachmentCategories: IAttachmentCategory[] = attachmentCategoriesToCheck.filter(isPresent);
    if (attachmentCategories.length > 0) {
      const attachmentCategoryCollectionIdentifiers = attachmentCategoryCollection.map(
        attachmentCategoryItem => getAttachmentCategoryIdentifier(attachmentCategoryItem)!
      );
      const attachmentCategoriesToAdd = attachmentCategories.filter(attachmentCategoryItem => {
        const attachmentCategoryIdentifier = getAttachmentCategoryIdentifier(attachmentCategoryItem);
        if (attachmentCategoryIdentifier == null || attachmentCategoryCollectionIdentifiers.includes(attachmentCategoryIdentifier)) {
          return false;
        }
        attachmentCategoryCollectionIdentifiers.push(attachmentCategoryIdentifier);
        return true;
      });
      return [...attachmentCategoriesToAdd, ...attachmentCategoryCollection];
    }
    return attachmentCategoryCollection;
  }
}
