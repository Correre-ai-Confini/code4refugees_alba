import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IEvent, Event } from '../event.model';
import { EventService } from '../service/event.service';
import { IEventType } from 'app/entities/event-type/event-type.model';
import { EventTypeService } from 'app/entities/event-type/service/event-type.service';
import { ICheckPoint } from 'app/entities/check-point/check-point.model';
import { CheckPointService } from 'app/entities/check-point/service/check-point.service';
import { IOperator } from 'app/entities/operator/operator.model';
import { OperatorService } from 'app/entities/operator/service/operator.service';
import { IRegistration } from 'app/entities/registration/registration.model';
import { RegistrationService } from 'app/entities/registration/service/registration.service';
import { TreatmentPriority } from 'app/entities/enumerations/treatment-priority.model';

@Component({
  selector: 'jhi-event-update',
  templateUrl: './event-update.component.html',
})
export class EventUpdateComponent implements OnInit {
  isSaving = false;
  treatmentPriorityValues = Object.keys(TreatmentPriority);

  categoriesCollection: IEventType[] = [];
  checkPointsCollection: ICheckPoint[] = [];
  operatorsCollection: IOperator[] = [];
  registrationsSharedCollection: IRegistration[] = [];

  editForm = this.fb.group({
    id: [],
    notes: [],
    timestamp: [],
    urgencyOfMedicalTreatment: [],
    needForLegalAssistance: [],
    category: [],
    checkPoint: [],
    operator: [],
    registration: [],
  });

  constructor(
    protected eventService: EventService,
    protected eventTypeService: EventTypeService,
    protected checkPointService: CheckPointService,
    protected operatorService: OperatorService,
    protected registrationService: RegistrationService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ event }) => {
      if (event.id === undefined) {
        const today = dayjs().startOf('day');
        event.timestamp = today;
      }

      this.updateForm(event);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const event = this.createFromForm();
    if (event.id !== undefined) {
      this.subscribeToSaveResponse(this.eventService.update(event));
    } else {
      this.subscribeToSaveResponse(this.eventService.create(event));
    }
  }

  trackEventTypeById(index: number, item: IEventType): number {
    return item.id!;
  }

  trackCheckPointById(index: number, item: ICheckPoint): number {
    return item.id!;
  }

  trackOperatorById(index: number, item: IOperator): number {
    return item.id!;
  }

  trackRegistrationById(index: number, item: IRegistration): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEvent>>): void {
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

  protected updateForm(event: IEvent): void {
    this.editForm.patchValue({
      id: event.id,
      notes: event.notes,
      timestamp: event.timestamp ? event.timestamp.format(DATE_TIME_FORMAT) : null,
      urgencyOfMedicalTreatment: event.urgencyOfMedicalTreatment,
      needForLegalAssistance: event.needForLegalAssistance,
      category: event.category,
      checkPoint: event.checkPoint,
      operator: event.operator,
      registration: event.registration,
    });

    this.categoriesCollection = this.eventTypeService.addEventTypeToCollectionIfMissing(this.categoriesCollection, event.category);
    this.checkPointsCollection = this.checkPointService.addCheckPointToCollectionIfMissing(this.checkPointsCollection, event.checkPoint);
    this.operatorsCollection = this.operatorService.addOperatorToCollectionIfMissing(this.operatorsCollection, event.operator);
    this.registrationsSharedCollection = this.registrationService.addRegistrationToCollectionIfMissing(
      this.registrationsSharedCollection,
      event.registration
    );
  }

  protected loadRelationshipsOptions(): void {
    this.eventTypeService
      .query({ filter: 'event-is-null' })
      .pipe(map((res: HttpResponse<IEventType[]>) => res.body ?? []))
      .pipe(
        map((eventTypes: IEventType[]) =>
          this.eventTypeService.addEventTypeToCollectionIfMissing(eventTypes, this.editForm.get('category')!.value)
        )
      )
      .subscribe((eventTypes: IEventType[]) => (this.categoriesCollection = eventTypes));

    this.checkPointService
      .query({ filter: 'event-is-null' })
      .pipe(map((res: HttpResponse<ICheckPoint[]>) => res.body ?? []))
      .pipe(
        map((checkPoints: ICheckPoint[]) =>
          this.checkPointService.addCheckPointToCollectionIfMissing(checkPoints, this.editForm.get('checkPoint')!.value)
        )
      )
      .subscribe((checkPoints: ICheckPoint[]) => (this.checkPointsCollection = checkPoints));

    this.operatorService
      .query({ filter: 'event-is-null' })
      .pipe(map((res: HttpResponse<IOperator[]>) => res.body ?? []))
      .pipe(
        map((operators: IOperator[]) =>
          this.operatorService.addOperatorToCollectionIfMissing(operators, this.editForm.get('operator')!.value)
        )
      )
      .subscribe((operators: IOperator[]) => (this.operatorsCollection = operators));

    this.registrationService
      .query()
      .pipe(map((res: HttpResponse<IRegistration[]>) => res.body ?? []))
      .pipe(
        map((registrations: IRegistration[]) =>
          this.registrationService.addRegistrationToCollectionIfMissing(registrations, this.editForm.get('registration')!.value)
        )
      )
      .subscribe((registrations: IRegistration[]) => (this.registrationsSharedCollection = registrations));
  }

  protected createFromForm(): IEvent {
    return {
      ...new Event(),
      id: this.editForm.get(['id'])!.value,
      notes: this.editForm.get(['notes'])!.value,
      timestamp: this.editForm.get(['timestamp'])!.value ? dayjs(this.editForm.get(['timestamp'])!.value, DATE_TIME_FORMAT) : undefined,
      urgencyOfMedicalTreatment: this.editForm.get(['urgencyOfMedicalTreatment'])!.value,
      needForLegalAssistance: this.editForm.get(['needForLegalAssistance'])!.value,
      category: this.editForm.get(['category'])!.value,
      checkPoint: this.editForm.get(['checkPoint'])!.value,
      operator: this.editForm.get(['operator'])!.value,
      registration: this.editForm.get(['registration'])!.value,
    };
  }
}
