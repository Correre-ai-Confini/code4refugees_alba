import { NgModule } from "@angular/core";
import { SharedModule } from "app/shared/shared.module";
import { PersonDeleteDialogComponent } from "./delete/person-delete-dialog.component";
import { PersonDetailComponent } from "./detail/person-detail.component";
import { PersonComponent } from "./list/person.component";
import { PersonRoutingModule } from "./route/person-routing.module";
import { PersonUpdateComponent } from "./update/person-update.component";

@NgModule ({
  imports: [SharedModule, PersonRoutingModule],
  declarations: [PersonComponent, PersonDetailComponent, PersonUpdateComponent, PersonDeleteDialogComponent],
  entryComponents: [PersonDeleteDialogComponent]
})
export class PersonModule {}
