import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILegalSurvey, LegalSurvey } from '../legal-survey.model';
import { LegalSurveyService } from '../service/legal-survey.service';

@Injectable({ providedIn: 'root' })
export class LegalSurveyRoutingResolveService implements Resolve<ILegalSurvey> {
  constructor(protected service: LegalSurveyService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILegalSurvey> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((legalSurvey: HttpResponse<LegalSurvey>) => {
          if (legalSurvey.body) {
            return of(legalSurvey.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new LegalSurvey());
  }
}
