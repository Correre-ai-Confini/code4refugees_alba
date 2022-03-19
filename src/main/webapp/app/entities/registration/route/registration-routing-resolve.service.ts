import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRegistration, Registration } from '../registration.model';
import { RegistrationService } from '../service/registration.service';

@Injectable({ providedIn: 'root' })
export class RegistrationRoutingResolveService implements Resolve<IRegistration> {
  constructor(protected service: RegistrationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRegistration> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((registration: HttpResponse<Registration>) => {
          if (registration.body) {
            return of(registration.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Registration());
  }
}
