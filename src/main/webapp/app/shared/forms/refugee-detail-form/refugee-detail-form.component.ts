import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Edulevel } from "../../../entities/enumerations/edulevel.model";
import { Gender } from "../../../entities/enumerations/gender.model";
import { Religion } from "../../../entities/enumerations/religion.model";
import { IJob } from "../../../entities/job/job.model";
import { ILegalSurvey } from "../../../entities/legal-survey/legal-survey.model";
import { IMedicalSurvey } from "../../../entities/medical-survey/medical-survey.model";
import { IPerson } from "../../../entities/person/person.model";

@Component ({
  selector: "jhi-refugee-detail-form",
  templateUrl: "./refugee-detail-form.component.html"
})
export class RefugeeDetailFormComponent {
  isSaving = false;
  edulevelValues = Object.keys (Edulevel);
  religionValues = Object.keys (Religion);
  genderValues = Object.keys (Gender);
  
  @Input () personalInformationsCollection: IPerson[] = [];
  @Input () jobsSharedCollection: IJob[] = [];
  @Input () legalSurveysSharedCollection: ILegalSurvey[] = [];
  @Input () medicalSurveysSharedCollection: IMedicalSurvey[] = [];
  
  @Input () editForm!: FormGroup;
  
  constructor () {}
  
  trackPersonById (index: number, item: IPerson): number {
    return item.id!;
  }
  
  trackJobById (index: number, item: IJob): number {
    return item.id!;
  }
  
  trackLegalSurveyById (index: number, item: ILegalSurvey): number {
    return item.id!;
  }
  
  trackMedicalSurveyById (index: number, item: IMedicalSurvey): number {
    return item.id!;
  }
  
}
