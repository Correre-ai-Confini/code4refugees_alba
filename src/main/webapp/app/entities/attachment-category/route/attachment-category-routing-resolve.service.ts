import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAttachmentCategory, AttachmentCategory } from '../attachment-category.model';
import { AttachmentCategoryService } from '../service/attachment-category.service';

@Injectable({ providedIn: 'root' })
export class AttachmentCategoryRoutingResolveService implements Resolve<IAttachmentCategory> {
  constructor(protected service: AttachmentCategoryService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAttachmentCategory> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((attachmentCategory: HttpResponse<AttachmentCategory>) => {
          if (attachmentCategory.body) {
            return of(attachmentCategory.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new AttachmentCategory());
  }
}
