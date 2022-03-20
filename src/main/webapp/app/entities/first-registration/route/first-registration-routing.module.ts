import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { UserRouteAccessService } from "app/core/auth/user-route-access.service";
import { FirstRegistrationNewComponent } from "../update/first-registration-new.component";

const firstRegistrationRoute: Routes = [
  {
    path: "",
    component: FirstRegistrationNewComponent,
    canActivate: [UserRouteAccessService]
  }
];

@NgModule ({
  imports: [RouterModule.forChild (firstRegistrationRoute)],
  exports: [RouterModule]
})
export class FirstRegistrationRoutingModule {}
