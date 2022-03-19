import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRefugee, Refugee } from '../refugee.model';
import { RefugeeService } from '../service/refugee.service';

@Injectable({ providedIn: 'root' })
export class RefugeeRoutingResolveService implements Resolve<IRefugee> {
  constructor(protected service: RefugeeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRefugee> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((refugee: HttpResponse<Refugee>) => {
          if (refugee.body) {
            return of(refugee.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Refugee());
  }
}
