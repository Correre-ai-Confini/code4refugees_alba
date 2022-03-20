import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ICheckPoint } from "../../../entities/check-point/check-point.model";
import { TreatmentPriority } from "../../../entities/enumerations/treatment-priority.model";
import { IEventType } from "../../../entities/event-type/event-type.model";
import { IOperator } from "../../../entities/operator/operator.model";
import { IRegistration } from "../../../entities/registration/registration.model";

@Component ({
  selector: "jhi-event-detail-form",
  templateUrl: "./event-detail-form.component.html"
})
export class EventDetailFormComponent {
  
  treatmentPriorityValues = Object.keys (TreatmentPriority);
  
  @Input () categoriesCollection: IEventType[] = [];
  @Input () checkPointsCollection: ICheckPoint[] = [];
  @Input () operatorsCollection: IOperator[] = [];
  @Input () registrationsSharedCollection: IRegistration[] = [];
  @Input () editForm!: FormGroup;
  
  trackEventTypeById (index: number, item: IEventType): number {
    return item.id!;
  }
  
  trackCheckPointById (index: number, item: ICheckPoint): number {
    return item.id!;
  }
  
  trackOperatorById (index: number, item: IOperator): number {
    return item.id!;
  }
  
  trackRegistrationById (index: number, item: IRegistration): number {
    return item.id!;
  }
}
