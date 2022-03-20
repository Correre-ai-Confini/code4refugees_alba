import { HttpResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from "@techiediaries/ngx-qrcode";
import { Observable } from "rxjs";
import { finalize, map, shareReplay } from "rxjs/operators";
import { ICheckPoint } from "../../check-point/check-point.model";
import { CheckPointService } from "../../check-point/service/check-point.service";
import { IEventType } from "../../event-type/event-type.model";
import { EventTypeService } from "../../event-type/service/event-type.service";
import { EventService } from "../../event/service/event.service";
import { IJob } from "../../job/job.model";
import { JobService } from "../../job/service/job.service";
import { ILegalSurvey } from "../../legal-survey/legal-survey.model";
import { LegalSurveyService } from "../../legal-survey/service/legal-survey.service";
import { ILocation } from "../../location/location.model";
import { LocationService } from "../../location/service/location.service";
import { IMedicalSurvey } from "../../medical-survey/medical-survey.model";
import { MedicalSurveyService } from "../../medical-survey/service/medical-survey.service";
import { OperatorService } from "../../operator/service/operator.service";
import { PersonService } from "../../person/service/person.service";
import { RefugeeService } from "../../refugee/service/refugee.service";
import { RegistrationService } from "../../registration/service/registration.service";

import { IFirstRegistration } from "../first-registration.model";
import { FirstRegistrationService } from "../service/first-registration.service";

@Component ({
  selector: "jhi-first-registration-new",
  styles: [
    `
			::ng-deep .aclass {
				display:         flex;
				justify-content: center;
				height:          300px;
			}
    `
  ],
  templateUrl: "./first-registration-new.component.html"
})
export class FirstRegistrationNewComponent implements OnInit {
  isSaving = false;
  
  comingFromsCollection: ILocation[] = [];
  jobsSharedCollection: IJob[] = [];
  legalSurveysSharedCollection: ILegalSurvey[] = [];
  medicalSurveysSharedCollection: IMedicalSurvey[] = [];
  categoriesCollection: IEventType[] = [];
  checkPointsCollection: ICheckPoint[] = [];
  
  constructor (
    private eventService: EventService,
    private eventTypeService: EventTypeService,
    private checkPointService: CheckPointService,
    private operatorService: OperatorService,
    private firstRegistrationService: FirstRegistrationService,
    private refugeeService: RefugeeService,
    private personService: PersonService,
    private locationService: LocationService,
    private jobService: JobService,
    private legalSurveyService: LegalSurveyService,
    private medicalSurveyService: MedicalSurveyService,
    private activatedRoute: ActivatedRoute,
    private registrationService: RegistrationService,
    private fb: FormBuilder
  ) {}
  personForm = this.fb.group ({
    id: [],
    personalIdentifier: [],
    identifierType: [],
    firstName: [],
    lastName: [],
    email: [],
    phoneNumber: [],
    firstSpokenLanguage: [],
    secondSpokenLanguage: [],
    comingFrom: []
  });
  NgxQrcodeElementTypes = NgxQrcodeElementTypes;
  NgxQrcodeErrorCorrectionLevels = NgxQrcodeErrorCorrectionLevels;
  refugeeForm = this.fb.group ({
    id: [],
    qrcodeUUID: [],
    educationalLevel: [],
    mandatoryTutored: [],
    birthDate: [],
    disabledPerson: [],
    religion: [],
    gender: [],
    primaryOccupation: [],
    legalSurvey: [],
    medicalSurvey: []
  });
  
  eventForm = this.fb.group ({
    id: [],
    notes: [],
    timestamp: [],
    urgencyOfMedicalTreatment: [],
    needForLegalAssistance: [],
    category: [],
    checkPoint: [Validators.required]
  });
  qrcode$ = this.firstRegistrationService.getNewQrcode ()
  .pipe (shareReplay ());
  
  ngOnInit (): void {
    this.loadRelationshipsOptions ();
    this.qrcode$.subscribe ((uuid) => {
      console.log (uuid);
      this.refugeeForm.get ("qrcodeUUID")
      ?.patchValue (uuid);
    });
    this.refugeeForm.get ("qrcodeUUID")
    ?.disable ();
  }
  
  previousState (): void {
    window.history.back ();
  }
  
  save (): void {
    this.isSaving = true;
    const firstRegistration = this.createFromForm ();
    this.subscribeToSaveResponse (this.firstRegistrationService.create (firstRegistration)); // TODO
  }
  
  protected subscribeToSaveResponse (result: Observable<HttpResponse<IFirstRegistration>>): void {
    result.pipe (finalize (() => this.onSaveFinalize ()))
    .subscribe ({
      next: () => this.onSaveSuccess (),
      error: () => this.onSaveError ()
    });
  }
  
  protected onSaveSuccess (): void {
    this.previousState ();
  }
  
  protected onSaveError (): void {
    // Api for inheritance.
  }
  
  protected onSaveFinalize (): void {
    this.isSaving = false;
  }
  protected loadRelationshipsOptions (): void {
    this.eventTypeService
    .query ({ filter: "event-is-null" })
    .pipe (map ((res: HttpResponse<IEventType[]>) => res.body ?? []))
    .pipe (
      map ((eventTypes: IEventType[]) =>
        this.eventTypeService.addEventTypeToCollectionIfMissing (eventTypes, this.eventForm.get ("category")!.value)
      )
    )
    .subscribe ((eventTypes: IEventType[]) => (this.categoriesCollection = eventTypes));
    
    this.checkPointService
    .query ({ filter: "event-is-null" })
    .pipe (map ((res: HttpResponse<ICheckPoint[]>) => res.body ?? []))
    .pipe (
      map ((checkPoints: ICheckPoint[]) =>
        this.checkPointService.addCheckPointToCollectionIfMissing (checkPoints, this.eventForm.get ("checkPoint")!.value)
      )
    )
    .subscribe ((checkPoints: ICheckPoint[]) => (this.checkPointsCollection = checkPoints));
    
    this.locationService
    .query ({ filter: "person-is-null" })
    .pipe (map ((res: HttpResponse<ILocation[]>) => res.body ?? []))
    .pipe (
      map ((locations: ILocation[]) =>
        this.locationService.addLocationToCollectionIfMissing (locations, this.personForm.get ("comingFrom")!.value)
      )
    )
    .subscribe ((locations: ILocation[]) => (this.comingFromsCollection = locations));
    
    this.jobService
    .query ()
    .pipe (map ((res: HttpResponse<IJob[]>) => res.body ?? []))
    .pipe (map ((jobs: IJob[]) => this.jobService.addJobToCollectionIfMissing (jobs, this.refugeeForm.get ("primaryOccupation")!.value)))
    .subscribe ((jobs: IJob[]) => (this.jobsSharedCollection = jobs));
    
    this.legalSurveyService
    .query ()
    .pipe (map ((res: HttpResponse<ILegalSurvey[]>) => res.body ?? []))
    .pipe (
      map ((legalSurveys: ILegalSurvey[]) =>
        this.legalSurveyService.addLegalSurveyToCollectionIfMissing (legalSurveys, this.refugeeForm.get ("legalSurvey")!.value)
      )
    )
    .subscribe ((legalSurveys: ILegalSurvey[]) => (this.legalSurveysSharedCollection = legalSurveys));
    
    this.medicalSurveyService
    .query ()
    .pipe (map ((res: HttpResponse<IMedicalSurvey[]>) => res.body ?? []))
    .pipe (
      map ((medicalSurveys: IMedicalSurvey[]) =>
        this.medicalSurveyService.addMedicalSurveyToCollectionIfMissing (medicalSurveys, this.refugeeForm.get ("medicalSurvey")!.value)
      )
    )
    .subscribe ((medicalSurveys: IMedicalSurvey[]) => (this.medicalSurveysSharedCollection = medicalSurveys));
  }
  
  protected createFromForm (): IFirstRegistration {
    return {
      event: this.eventForm.getRawValue (),
      person: this.personForm.getRawValue (),
      refugee: this.refugeeForm.getRawValue (),
      registration: {}
    };
  }
}
