import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ILegalSurvey, LegalSurvey } from '../legal-survey.model';
import { LegalSurveyService } from '../service/legal-survey.service';
import { IAttachment } from 'app/entities/attachment/attachment.model';
import { AttachmentService } from 'app/entities/attachment/service/attachment.service';

@Component({
  selector: 'jhi-legal-survey-update',
  templateUrl: './legal-survey-update.component.html',
})
export class LegalSurveyUpdateComponent implements OnInit {
  isSaving = false;

  attachmentsSharedCollection: IAttachment[] = [];

  editForm = this.fb.group({
    id: [],
    notes: [],
    issues: [],
    attachment: [],
  });

  constructor(
    protected legalSurveyService: LegalSurveyService,
    protected attachmentService: AttachmentService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ legalSurvey }) => {
      this.updateForm(legalSurvey);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const legalSurvey = this.createFromForm();
    if (legalSurvey.id !== undefined) {
      this.subscribeToSaveResponse(this.legalSurveyService.update(legalSurvey));
    } else {
      this.subscribeToSaveResponse(this.legalSurveyService.create(legalSurvey));
    }
  }

  trackAttachmentById(index: number, item: IAttachment): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILegalSurvey>>): void {
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

  protected updateForm(legalSurvey: ILegalSurvey): void {
    this.editForm.patchValue({
      id: legalSurvey.id,
      notes: legalSurvey.notes,
      issues: legalSurvey.issues,
      attachment: legalSurvey.attachment,
    });

    this.attachmentsSharedCollection = this.attachmentService.addAttachmentToCollectionIfMissing(
      this.attachmentsSharedCollection,
      legalSurvey.attachment
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

  protected createFromForm(): ILegalSurvey {
    return {
      ...new LegalSurvey(),
      id: this.editForm.get(['id'])!.value,
      notes: this.editForm.get(['notes'])!.value,
      issues: this.editForm.get(['issues'])!.value,
      attachment: this.editForm.get(['attachment'])!.value,
    };
  }
}
