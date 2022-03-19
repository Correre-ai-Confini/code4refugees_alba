import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AttachmentCategoryComponent } from './list/attachment-category.component';
import { AttachmentCategoryDetailComponent } from './detail/attachment-category-detail.component';
import { AttachmentCategoryUpdateComponent } from './update/attachment-category-update.component';
import { AttachmentCategoryDeleteDialogComponent } from './delete/attachment-category-delete-dialog.component';
import { AttachmentCategoryRoutingModule } from './route/attachment-category-routing.module';

@NgModule({
  imports: [SharedModule, AttachmentCategoryRoutingModule],
  declarations: [
    AttachmentCategoryComponent,
    AttachmentCategoryDetailComponent,
    AttachmentCategoryUpdateComponent,
    AttachmentCategoryDeleteDialogComponent,
  ],
  entryComponents: [AttachmentCategoryDeleteDialogComponent],
})
export class AttachmentCategoryModule {}
