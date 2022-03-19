import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEventType, EventType } from '../event-type.model';
import { EventTypeService } from '../service/event-type.service';

@Injectable({ providedIn: 'root' })
export class EventTypeRoutingResolveService implements Resolve<IEventType> {
  constructor(protected service: EventTypeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEventType> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((eventType: HttpResponse<EventType>) => {
          if (eventType.body) {
            return of(eventType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new EventType());
  }
}
