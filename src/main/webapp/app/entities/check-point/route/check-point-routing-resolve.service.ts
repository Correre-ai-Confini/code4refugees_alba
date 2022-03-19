import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICheckPoint, CheckPoint } from '../check-point.model';
import { CheckPointService } from '../service/check-point.service';

@Injectable({ providedIn: 'root' })
export class CheckPointRoutingResolveService implements Resolve<ICheckPoint> {
  constructor(protected service: CheckPointService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICheckPoint> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((checkPoint: HttpResponse<CheckPoint>) => {
          if (checkPoint.body) {
            return of(checkPoint.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new CheckPoint());
  }
}
