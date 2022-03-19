import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IAttachment, Attachment } from '../attachment.model';
import { AttachmentService } from '../service/attachment.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IAttachmentCategory } from 'app/entities/attachment-category/attachment-category.model';
import { AttachmentCategoryService } from 'app/entities/attachment-category/service/attachment-category.service';
import { IRefugee } from 'app/entities/refugee/refugee.model';
import { RefugeeService } from 'app/entities/refugee/service/refugee.service';
import { IOperator } from 'app/entities/operator/operator.model';
import { OperatorService } from 'app/entities/operator/service/operator.service';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';
import { ContentType } from 'app/entities/enumerations/content-type.model';

@Component({
  selector: 'jhi-attachment-update',
  templateUrl: './attachment-update.component.html',
})
export class AttachmentUpdateComponent implements OnInit {
  isSaving = false;
  contentTypeValues = Object.keys(ContentType);

  attachmentCategoriesSharedCollection: IAttachmentCategory[] = [];
  refugeesSharedCollection: IRefugee[] = [];
  operatorsSharedCollection: IOperator[] = [];
  eventsSharedCollection: IEvent[] = [];

  editForm = this.fb.group({
    id: [],
    description: [],
    creationTS: [],
    name: [],
    contentBlob: [],
    contentBlobContentType: [],
    contentType: [],
    category: [],
    refugee: [],
    creator: [],
    originalRegistrationRecord: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected attachmentService: AttachmentService,
    protected attachmentCategoryService: AttachmentCategoryService,
    protected refugeeService: RefugeeService,
    protected operatorService: OperatorService,
    protected eventService: EventService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ attachment }) => {
      if (attachment.id === undefined) {
        const today = dayjs().startOf('day');
        attachment.creationTS = today;
      }

      this.updateForm(attachment);

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
    const attachment = this.createFromForm();
    if (attachment.id !== undefined) {
      this.subscribeToSaveResponse(this.attachmentService.update(attachment));
    } else {
      this.subscribeToSaveResponse(this.attachmentService.create(attachment));
    }
  }

  trackAttachmentCategoryById(index: number, item: IAttachmentCategory): number {
    return item.id!;
  }

  trackRefugeeById(index: number, item: IRefugee): number {
    return item.id!;
  }

  trackOperatorById(index: number, item: IOperator): number {
    return item.id!;
  }

  trackEventById(index: number, item: IEvent): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAttachment>>): void {
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

  protected updateForm(attachment: IAttachment): void {
    this.editForm.patchValue({
      id: attachment.id,
      description: attachment.description,
      creationTS: attachment.creationTS ? attachment.creationTS.format(DATE_TIME_FORMAT) : null,
      name: attachment.name,
      contentBlob: attachment.contentBlob,
      contentBlobContentType: attachment.contentBlobContentType,
      contentType: attachment.contentType,
      category: attachment.category,
      refugee: attachment.refugee,
      creator: attachment.creator,
      originalRegistrationRecord: attachment.originalRegistrationRecord,
    });

    this.attachmentCategoriesSharedCollection = this.attachmentCategoryService.addAttachmentCategoryToCollectionIfMissing(
      this.attachmentCategoriesSharedCollection,
      attachment.category
    );
    this.refugeesSharedCollection = this.refugeeService.addRefugeeToCollectionIfMissing(this.refugeesSharedCollection, attachment.refugee);
    this.operatorsSharedCollection = this.operatorService.addOperatorToCollectionIfMissing(
      this.operatorsSharedCollection,
      attachment.creator
    );
    this.eventsSharedCollection = this.eventService.addEventToCollectionIfMissing(
      this.eventsSharedCollection,
      attachment.originalRegistrationRecord
    );
  }

  protected loadRelationshipsOptions(): void {
    this.attachmentCategoryService
      .query()
      .pipe(map((res: HttpResponse<IAttachmentCategory[]>) => res.body ?? []))
      .pipe(
        map((attachmentCategories: IAttachmentCategory[]) =>
          this.attachmentCategoryService.addAttachmentCategoryToCollectionIfMissing(
            attachmentCategories,
            this.editForm.get('category')!.value
          )
        )
      )
      .subscribe((attachmentCategories: IAttachmentCategory[]) => (this.attachmentCategoriesSharedCollection = attachmentCategories));

    this.refugeeService
      .query()
      .pipe(map((res: HttpResponse<IRefugee[]>) => res.body ?? []))
      .pipe(
        map((refugees: IRefugee[]) => this.refugeeService.addRefugeeToCollectionIfMissing(refugees, this.editForm.get('refugee')!.value))
      )
      .subscribe((refugees: IRefugee[]) => (this.refugeesSharedCollection = refugees));

    this.operatorService
      .query()
      .pipe(map((res: HttpResponse<IOperator[]>) => res.body ?? []))
      .pipe(
        map((operators: IOperator[]) =>
          this.operatorService.addOperatorToCollectionIfMissing(operators, this.editForm.get('creator')!.value)
        )
      )
      .subscribe((operators: IOperator[]) => (this.operatorsSharedCollection = operators));

    this.eventService
      .query()
      .pipe(map((res: HttpResponse<IEvent[]>) => res.body ?? []))
      .pipe(
        map((events: IEvent[]) =>
          this.eventService.addEventToCollectionIfMissing(events, this.editForm.get('originalRegistrationRecord')!.value)
        )
      )
      .subscribe((events: IEvent[]) => (this.eventsSharedCollection = events));
  }

  protected createFromForm(): IAttachment {
    return {
      ...new Attachment(),
      id: this.editForm.get(['id'])!.value,
      description: this.editForm.get(['description'])!.value,
      creationTS: this.editForm.get(['creationTS'])!.value ? dayjs(this.editForm.get(['creationTS'])!.value, DATE_TIME_FORMAT) : undefined,
      name: this.editForm.get(['name'])!.value,
      contentBlobContentType: this.editForm.get(['contentBlobContentType'])!.value,
      contentBlob: this.editForm.get(['contentBlob'])!.value,
      contentType: this.editForm.get(['contentType'])!.value,
      category: this.editForm.get(['category'])!.value,
      refugee: this.editForm.get(['refugee'])!.value,
      creator: this.editForm.get(['creator'])!.value,
      originalRegistrationRecord: this.editForm.get(['originalRegistrationRecord'])!.value,
    };
  }
}
