import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEventType } from '../event-type.model';
import { EventTypeService } from '../service/event-type.service';
import { EventTypeDeleteDialogComponent } from '../delete/event-type-delete-dialog.component';

@Component({
  selector: 'jhi-event-type',
  templateUrl: './event-type.component.html',
})
export class EventTypeComponent implements OnInit {
  eventTypes?: IEventType[];
  isLoading = false;

  constructor(protected eventTypeService: EventTypeService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.eventTypeService.query().subscribe({
      next: (res: HttpResponse<IEventType[]>) => {
        this.isLoading = false;
        this.eventTypes = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IEventType): number {
    return item.id!;
  }

  delete(eventType: IEventType): void {
    const modalRef = this.modalService.open(EventTypeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.eventType = eventType;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
