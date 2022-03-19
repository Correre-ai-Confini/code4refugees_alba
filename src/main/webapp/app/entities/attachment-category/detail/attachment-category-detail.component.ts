import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAttachmentCategory } from '../attachment-category.model';

@Component({
  selector: 'jhi-attachment-category-detail',
  templateUrl: './attachment-category-detail.component.html',
})
export class AttachmentCategoryDetailComponent implements OnInit {
  attachmentCategory: IAttachmentCategory | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ attachmentCategory }) => {
      this.attachmentCategory = attachmentCategory;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
