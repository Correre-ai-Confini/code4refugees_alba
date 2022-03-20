import { NgModule } from "@angular/core";
import { AlertErrorComponent } from "./alert/alert-error.component";
import { AlertComponent } from "./alert/alert.component";
import { HasAnyAuthorityDirective } from "./auth/has-any-authority.directive";
import { DurationPipe } from "./date/duration.pipe";
import { FormatMediumDatePipe } from "./date/format-medium-date.pipe";
import { FormatMediumDatetimePipe } from "./date/format-medium-datetime.pipe";
import { EventDetailFormComponent } from "./forms/event-detail-form/event-detail-form.component";
import { PersonDetailFormComponent } from "./forms/person-detail-form/person-detail-form.component";
import { RefugeeDetailFormComponent } from "./forms/refugee-detail-form/refugee-detail-form.component";
import { FindLanguageFromKeyPipe } from "./language/find-language-from-key.pipe";
import { TranslateDirective } from "./language/translate.directive";
import { ItemCountComponent } from "./pagination/item-count.component";

import { SharedLibsModule } from "./shared-libs.module";
import { SortByDirective } from "./sort/sort-by.directive";
import { SortDirective } from "./sort/sort.directive";

@NgModule ({
  imports: [SharedLibsModule],
  declarations: [
    FindLanguageFromKeyPipe,
    TranslateDirective,
    AlertComponent,
    AlertErrorComponent,
    HasAnyAuthorityDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    SortByDirective,
    SortDirective,
    ItemCountComponent,
    PersonDetailFormComponent,
    EventDetailFormComponent,
    RefugeeDetailFormComponent
  ],
  exports: [
    SharedLibsModule,
    FindLanguageFromKeyPipe,
    TranslateDirective,
    AlertComponent,
    AlertErrorComponent,
    HasAnyAuthorityDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    SortByDirective,
    SortDirective,
    ItemCountComponent,
    PersonDetailFormComponent,
    EventDetailFormComponent,
    RefugeeDetailFormComponent
  ]
})
export class SharedModule {}
