import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AttachmentCategoryComponent } from '../list/attachment-category.component';
import { AttachmentCategoryDetailComponent } from '../detail/attachment-category-detail.component';
import { AttachmentCategoryUpdateComponent } from '../update/attachment-category-update.component';
import { AttachmentCategoryRoutingResolveService } from './attachment-category-routing-resolve.service';

const attachmentCategoryRoute: Routes = [
  {
    path: '',
    component: AttachmentCategoryComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AttachmentCategoryDetailComponent,
    resolve: {
      attachmentCategory: AttachmentCategoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AttachmentCategoryUpdateComponent,
    resolve: {
      attachmentCategory: AttachmentCategoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AttachmentCategoryUpdateComponent,
    resolve: {
      attachmentCategory: AttachmentCategoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(attachmentCategoryRoute)],
  exports: [RouterModule],
})
export class AttachmentCategoryRoutingModule {}
