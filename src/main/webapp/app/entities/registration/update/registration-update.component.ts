import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IRegistration, Registration } from '../registration.model';
import { RegistrationService } from '../service/registration.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IRefugee } from 'app/entities/refugee/refugee.model';
import { RefugeeService } from 'app/entities/refugee/service/refugee.service';

@Component({
  selector: 'jhi-registration-update',
  templateUrl: './registration-update.component.html',
})
export class RegistrationUpdateComponent implements OnInit {
  isSaving = false;

  refugeesCollection: IRefugee[] = [];

  editForm = this.fb.group({
    id: [],
    notes: [],
    timestamp: [],
    legalConsentBlob: [],
    legalConsentBlobContentType: [],
    refugee: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected registrationService: RegistrationService,
    protected refugeeService: RefugeeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ registration }) => {
      if (registration.id === undefined) {
        const today = dayjs().startOf('day');
        registration.timestamp = today;
      }

      this.updateForm(registration);

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('albatestApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const registration = this.createFromForm();
    if (registration.id !== undefined) {
      this.subscribeToSaveResponse(this.registrationService.update(registration));
    } else {
      this.subscribeToSaveResponse(this.registrationService.create(registration));
    }
  }

  trackRefugeeById(index: number, item: IRefugee): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRegistration>>): void {
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

  protected updateForm(registration: IRegistration): void {
    this.editForm.patchValue({
      id: registration.id,
      notes: registration.notes,
      timestamp: registration.timestamp ? registration.timestamp.format(DATE_TIME_FORMAT) : null,
      legalConsentBlob: registration.legalConsentBlob,
      legalConsentBlobContentType: registration.legalConsentBlobContentType,
      refugee: registration.refugee,
    });

    this.refugeesCollection = this.refugeeService.addRefugeeToCollectionIfMissing(this.refugeesCollection, registration.refugee);
  }

  protected loadRelationshipsOptions(): void {
    this.refugeeService
      .query({ filter: 'registration-is-null' })
      .pipe(map((res: HttpResponse<IRefugee[]>) => res.body ?? []))
      .pipe(
        map((refugees: IRefugee[]) => this.refugeeService.addRefugeeToCollectionIfMissing(refugees, this.editForm.get('refugee')!.value))
      )
      .subscribe((refugees: IRefugee[]) => (this.refugeesCollection = refugees));
  }

  protected createFromForm(): IRegistration {
    return {
      ...new Registration(),
      id: this.editForm.get(['id'])!.value,
      notes: this.editForm.get(['notes'])!.value,
      timestamp: this.editForm.get(['timestamp'])!.value ? dayjs(this.editForm.get(['timestamp'])!.value, DATE_TIME_FORMAT) : undefined,
      legalConsentBlobContentType: this.editForm.get(['legalConsentBlobContentType'])!.value,
      legalConsentBlob: this.editForm.get(['legalConsentBlob'])!.value,
      refugee: this.editForm.get(['refugee'])!.value,
    };
  }
}
