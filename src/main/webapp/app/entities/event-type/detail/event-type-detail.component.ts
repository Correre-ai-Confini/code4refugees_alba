import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEventType } from '../event-type.model';

@Component({
  selector: 'jhi-event-type-detail',
  templateUrl: './event-type-detail.component.html',
})
export class EventTypeDetailComponent implements OnInit {
  eventType: IEventType | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ eventType }) => {
      this.eventType = eventType;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
