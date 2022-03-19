import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAttachmentCategory } from '../attachment-category.model';
import { AttachmentCategoryService } from '../service/attachment-category.service';
import { AttachmentCategoryDeleteDialogComponent } from '../delete/attachment-category-delete-dialog.component';

@Component({
  selector: 'jhi-attachment-category',
  templateUrl: './attachment-category.component.html',
})
export class AttachmentCategoryComponent implements OnInit {
  attachmentCategories?: IAttachmentCategory[];
  isLoading = false;

  constructor(protected attachmentCategoryService: AttachmentCategoryService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.attachmentCategoryService.query().subscribe({
      next: (res: HttpResponse<IAttachmentCategory[]>) => {
        this.isLoading = false;
        this.attachmentCategories = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IAttachmentCategory): number {
    return item.id!;
  }

  delete(attachmentCategory: IAttachmentCategory): void {
    const modalRef = this.modalService.open(AttachmentCategoryDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.attachmentCategory = attachmentCategory;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
