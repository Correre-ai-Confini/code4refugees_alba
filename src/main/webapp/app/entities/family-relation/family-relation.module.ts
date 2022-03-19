import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FamilyRelationComponent } from './list/family-relation.component';
import { FamilyRelationDetailComponent } from './detail/family-relation-detail.component';
import { FamilyRelationUpdateComponent } from './update/family-relation-update.component';
import { FamilyRelationDeleteDialogComponent } from './delete/family-relation-delete-dialog.component';
import { FamilyRelationRoutingModule } from './route/family-relation-routing.module';

@NgModule({
  imports: [SharedModule, FamilyRelationRoutingModule],
  declarations: [
    FamilyRelationComponent,
    FamilyRelationDetailComponent,
    FamilyRelationUpdateComponent,
    FamilyRelationDeleteDialogComponent,
  ],
  entryComponents: [FamilyRelationDeleteDialogComponent],
})
export class FamilyRelationModule {}
