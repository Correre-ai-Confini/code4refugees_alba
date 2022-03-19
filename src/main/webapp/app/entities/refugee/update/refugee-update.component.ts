import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IRefugee, Refugee } from '../refugee.model';
import { RefugeeService } from '../service/refugee.service';
import { IPerson } from 'app/entities/person/person.model';
import { PersonService } from 'app/entities/person/service/person.service';
import { IJob } from 'app/entities/job/job.model';
import { JobService } from 'app/entities/job/service/job.service';
import { ILegalSurvey } from 'app/entities/legal-survey/legal-survey.model';
import { LegalSurveyService } from 'app/entities/legal-survey/service/legal-survey.service';
import { IMedicalSurvey } from 'app/entities/medical-survey/medical-survey.model';
import { MedicalSurveyService } from 'app/entities/medical-survey/service/medical-survey.service';
import { Edulevel } from 'app/entities/enumerations/edulevel.model';
import { Religion } from 'app/entities/enumerations/religion.model';
import { Gender } from 'app/entities/enumerations/gender.model';

@Component({
  selector: 'jhi-refugee-update',
  templateUrl: './refugee-update.component.html',
})
export class RefugeeUpdateComponent implements OnInit {
  isSaving = false;
  edulevelValues = Object.keys(Edulevel);
  religionValues = Object.keys(Religion);
  genderValues = Object.keys(Gender);

  personalInformationsCollection: IPerson[] = [];
  jobsSharedCollection: IJob[] = [];
  legalSurveysSharedCollection: ILegalSurvey[] = [];
  medicalSurveysSharedCollection: IMedicalSurvey[] = [];

  editForm = this.fb.group({
    id: [],
    qrcodeUUID: [],
    educationalLevel: [],
    mandatoryTutored: [],
    birthDate: [],
    disabledPerson: [],
    religion: [],
    gender: [],
    personalInformation: [],
    primaryOccupation: [],
    legalSurvey: [],
    medicalSurvey: [],
  });

  constructor(
    protected refugeeService: RefugeeService,
    protected personService: PersonService,
    protected jobService: JobService,
    protected legalSurveyService: LegalSurveyService,
    protected medicalSurveyService: MedicalSurveyService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ refugee }) => {
      this.updateForm(refugee);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const refugee = this.createFromForm();
    if (refugee.id !== undefined) {
      this.subscribeToSaveResponse(this.refugeeService.update(refugee));
    } else {
      this.subscribeToSaveResponse(this.refugeeService.create(refugee));
    }
  }

  trackPersonById(index: number, item: IPerson): number {
    return item.id!;
  }

  trackJobById(index: number, item: IJob): number {
    return item.id!;
  }

  trackLegalSurveyById(index: number, item: ILegalSurvey): number {
    return item.id!;
  }

  trackMedicalSurveyById(index: number, item: IMedicalSurvey): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRefugee>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(refugee: IRefugee): void {
    this.editForm.patchValue({
      id: refugee.id,
      qrcodeUUID: refugee.qrcodeUUID,
      educationalLevel: refugee.educationalLevel,
      mandatoryTutored: refugee.mandatoryTutored,
      birthDate: refugee.birthDate,
      disabledPerson: refugee.disabledPerson,
      religion: refugee.religion,
      gender: refugee.gender,
      personalInformation: refugee.personalInformation,
      primaryOccupation: refugee.primaryOccupation,
      legalSurvey: refugee.legalSurvey,
      medicalSurvey: refugee.medicalSurvey,
    });

    this.personalInformationsCollection = this.personService.addPersonToCollectionIfMissing(
      this.personalInformationsCollection,
      refugee.personalInformation
    );
    this.jobsSharedCollection = this.jobService.addJobToCollectionIfMissing(this.jobsSharedCollection, refugee.primaryOccupation);
    this.legalSurveysSharedCollection = this.legalSurveyService.addLegalSurveyToCollectionIfMissing(
      this.legalSurveysSharedCollection,
      refugee.legalSurvey
    );
    this.medicalSurveysSharedCollection = this.medicalSurveyService.addMedicalSurveyToCollectionIfMissing(
      this.medicalSurveysSharedCollection,
      refugee.medicalSurvey
    );
  }

  protected loadRelationshipsOptions(): void {
    this.personService
      .query({ filter: 'refugee-is-null' })
      .pipe(map((res: HttpResponse<IPerson[]>) => res.body ?? []))
      .pipe(
        map((people: IPerson[]) =>
          this.personService.addPersonToCollectionIfMissing(people, this.editForm.get('personalInformation')!.value)
        )
      )
      .subscribe((people: IPerson[]) => (this.personalInformationsCollection = people));

    this.jobService
      .query()
      .pipe(map((res: HttpResponse<IJob[]>) => res.body ?? []))
      .pipe(map((jobs: IJob[]) => this.jobService.addJobToCollectionIfMissing(jobs, this.editForm.get('primaryOccupation')!.value)))
      .subscribe((jobs: IJob[]) => (this.jobsSharedCollection = jobs));

    this.legalSurveyService
      .query()
      .pipe(map((res: HttpResponse<ILegalSurvey[]>) => res.body ?? []))
      .pipe(
        map((legalSurveys: ILegalSurvey[]) =>
          this.legalSurveyService.addLegalSurveyToCollectionIfMissing(legalSurveys, this.editForm.get('legalSurvey')!.value)
        )
      )
      .subscribe((legalSurveys: ILegalSurvey[]) => (this.legalSurveysSharedCollection = legalSurveys));

    this.medicalSurveyService
      .query()
      .pipe(map((res: HttpResponse<IMedicalSurvey[]>) => res.body ?? []))
      .pipe(
        map((medicalSurveys: IMedicalSurvey[]) =>
          this.medicalSurveyService.addMedicalSurveyToCollectionIfMissing(medicalSurveys, this.editForm.get('medicalSurvey')!.value)
        )
      )
      .subscribe((medicalSurveys: IMedicalSurvey[]) => (this.medicalSurveysSharedCollection = medicalSurveys));
  }

  protected createFromForm(): IRefugee {
    return {
      ...new Refugee(),
      id: this.editForm.get(['id'])!.value,
      qrcodeUUID: this.editForm.get(['qrcodeUUID'])!.value,
      educationalLevel: this.editForm.get(['educationalLevel'])!.value,
      mandatoryTutored: this.editForm.get(['mandatoryTutored'])!.value,
      birthDate: this.editForm.get(['birthDate'])!.value,
      disabledPerson: this.editForm.get(['disabledPerson'])!.value,
      religion: this.editForm.get(['religion'])!.value,
      gender: this.editForm.get(['gender'])!.value,
      personalInformation: this.editForm.get(['personalInformation'])!.value,
      primaryOccupation: this.editForm.get(['primaryOccupation'])!.value,
      legalSurvey: this.editForm.get(['legalSurvey'])!.value,
      medicalSurvey: this.editForm.get(['medicalSurvey'])!.value,
    };
  }
}
