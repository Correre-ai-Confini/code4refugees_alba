import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAttachmentCategory, AttachmentCategory } from '../attachment-category.model';
import { AttachmentCategoryService } from '../service/attachment-category.service';

@Component({
  selector: 'jhi-attachment-category-update',
  templateUrl: './attachment-category-update.component.html',
})
export class AttachmentCategoryUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    description: [],
  });

  constructor(
    protected attachmentCategoryService: AttachmentCategoryService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ attachmentCategory }) => {
      this.updateForm(attachmentCategory);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const attachmentCategory = this.createFromForm();
    if (attachmentCategory.id !== undefined) {
      this.subscribeToSaveResponse(this.attachmentCategoryService.update(attachmentCategory));
    } else {
      this.subscribeToSaveResponse(this.attachmentCategoryService.create(attachmentCategory));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAttachmentCategory>>): void {
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

  protected updateForm(attachmentCategory: IAttachmentCategory): void {
    this.editForm.patchValue({
      id: attachmentCategory.id,
      description: attachmentCategory.description,
    });
  }

  protected createFromForm(): IAttachmentCategory {
    return {
      ...new AttachmentCategory(),
      id: this.editForm.get(['id'])!.value,
      description: this.editForm.get(['description'])!.value,
    };
  }
}
