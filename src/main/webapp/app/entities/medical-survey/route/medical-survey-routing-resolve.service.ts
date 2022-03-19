import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMedicalSurvey, MedicalSurvey } from '../medical-survey.model';
import { MedicalSurveyService } from '../service/medical-survey.service';

@Injectable({ providedIn: 'root' })
export class MedicalSurveyRoutingResolveService implements Resolve<IMedicalSurvey> {
  constructor(protected service: MedicalSurveyService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMedicalSurvey> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((medicalSurvey: HttpResponse<MedicalSurvey>) => {
          if (medicalSurvey.body) {
            return of(medicalSurvey.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new MedicalSurvey());
  }
}
