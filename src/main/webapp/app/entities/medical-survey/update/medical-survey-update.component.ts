import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IMedicalSurvey, MedicalSurvey } from '../medical-survey.model';
import { MedicalSurveyService } from '../service/medical-survey.service';
import { IAttachment } from 'app/entities/attachment/attachment.model';
import { AttachmentService } from 'app/entities/attachment/service/attachment.service';

@Component({
  selector: 'jhi-medical-survey-update',
  templateUrl: './medical-survey-update.component.html',
})
export class MedicalSurveyUpdateComponent implements OnInit {
  isSaving = false;

  attachmentsSharedCollection: IAttachment[] = [];

  editForm = this.fb.group({
    id: [],
    ongoingIllnesses: [],
    ongoingTreatments: [],
    attachment: [],
  });

  constructor(
    protected medicalSurveyService: MedicalSurveyService,
    protected attachmentService: AttachmentService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ medicalSurvey }) => {
      this.updateForm(medicalSurvey);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const medicalSurvey = this.createFromForm();
    if (medicalSurvey.id !== undefined) {
      this.subscribeToSaveResponse(this.medicalSurveyService.update(medicalSurvey));
    } else {
      this.subscribeToSaveResponse(this.medicalSurveyService.create(medicalSurvey));
    }
  }

  trackAttachmentById(index: number, item: IAttachment): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMedicalSurvey>>): void {
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

  protected updateForm(medicalSurvey: IMedicalSurvey): void {
    this.editForm.patchValue({
      id: medicalSurvey.id,
      ongoingIllnesses: medicalSurvey.ongoingIllnesses,
      ongoingTreatments: medicalSurvey.ongoingTreatments,
      attachment: medicalSurvey.attachment,
    });

    this.attachmentsSharedCollection = this.attachmentService.addAttachmentToCollectionIfMissing(
      this.attachmentsSharedCollection,
      medicalSurvey.attachment
    );
  }

  protected loadRelationshipsOptions(): void {
    this.attachmentService
      .query()
      .pipe(map((res: HttpResponse<IAttachment[]>) => res.body ?? []))
      .pipe(
        map((attachments: IAttachment[]) =>
          this.attachmentService.addAttachmentToCollectionIfMissing(attachments, this.editForm.get('attachment')!.value)
        )
      )
      .subscribe((attachments: IAttachment[]) => (this.attachmentsSharedCollection = attachments));
  }

  protected createFromForm(): IMedicalSurvey {
    return {
      ...new MedicalSurvey(),
      id: this.editForm.get(['id'])!.value,
      ongoingIllnesses: this.editForm.get(['ongoingIllnesses'])!.value,
      ongoingTreatments: this.editForm.get(['ongoingTreatments'])!.value,
      attachment: this.editForm.get(['attachment'])!.value,
    };
  }
}
