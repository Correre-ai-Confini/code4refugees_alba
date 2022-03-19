import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IEventType, EventType } from '../event-type.model';
import { EventTypeService } from '../service/event-type.service';

@Component({
  selector: 'jhi-event-type-update',
  templateUrl: './event-type-update.component.html',
})
export class EventTypeUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    description: [],
  });

  constructor(protected eventTypeService: EventTypeService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ eventType }) => {
      this.updateForm(eventType);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const eventType = this.createFromForm();
    if (eventType.id !== undefined) {
      this.subscribeToSaveResponse(this.eventTypeService.update(eventType));
    } else {
      this.subscribeToSaveResponse(this.eventTypeService.create(eventType));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEventType>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(eventType: IEventType): void {
    this.editForm.patchValue({
      id: eventType.id,
      description: eventType.description,
    });
  }

  protected createFromForm(): IEventType {
    return {
      ...new EventType(),
      id: this.editForm.get(['id'])!.value,
      description: this.editForm.get(['description'])!.value,
    };
  }
}
