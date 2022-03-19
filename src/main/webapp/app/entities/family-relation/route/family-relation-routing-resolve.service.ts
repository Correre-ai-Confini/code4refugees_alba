import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFamilyRelation, FamilyRelation } from '../family-relation.model';
import { FamilyRelationService } from '../service/family-relation.service';

@Injectable({ providedIn: 'root' })
export class FamilyRelationRoutingResolveService implements Resolve<IFamilyRelation> {
  constructor(protected service: FamilyRelationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFamilyRelation> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((familyRelation: HttpResponse<FamilyRelation>) => {
          if (familyRelation.body) {
            return of(familyRelation.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new FamilyRelation());
  }
}
