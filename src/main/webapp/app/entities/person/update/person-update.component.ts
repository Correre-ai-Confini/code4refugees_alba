import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPerson, Person } from '../person.model';
import { PersonService } from '../service/person.service';
import { ILocation } from 'app/entities/location/location.model';
import { LocationService } from 'app/entities/location/service/location.service';
import { Language } from 'app/entities/enumerations/language.model';

@Component({
  selector: 'jhi-person-update',
  templateUrl: './person-update.component.html',
})
export class PersonUpdateComponent implements OnInit {
  isSaving = false;
  languageValues = Object.keys(Language);

  comingFromsCollection: ILocation[] = [];

  editForm = this.fb.group({
    id: [],
    personalIdentifier: [],
    identifierType: [],
    firstName: [],
    lastName: [],
    email: [],
    phoneNumber: [],
    firstSpokenLanguage: [],
    secondSpokenLanguage: [],
    comingFrom: [],
  });

  constructor(
    protected personService: PersonService,
    protected locationService: LocationService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ person }) => {
      this.updateForm(person);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const person = this.createFromForm();
    if (person.id !== undefined) {
      this.subscribeToSaveResponse(this.personService.update(person));
    } else {
      this.subscribeToSaveResponse(this.personService.create(person));
    }
  }

  trackLocationById(index: number, item: ILocation): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPerson>>): void {
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

  protected updateForm(person: IPerson): void {
    this.editForm.patchValue({
      id: person.id,
      personalIdentifier: person.personalIdentifier,
      identifierType: person.identifierType,
      firstName: person.firstName,
      lastName: person.lastName,
      email: person.email,
      phoneNumber: person.phoneNumber,
      firstSpokenLanguage: person.firstSpokenLanguage,
      secondSpokenLanguage: person.secondSpokenLanguage,
      comingFrom: person.comingFrom,
    });

    this.comingFromsCollection = this.locationService.addLocationToCollectionIfMissing(this.comingFromsCollection, person.comingFrom);
  }

  protected loadRelationshipsOptions(): void {
    this.locationService
      .query({ filter: 'person-is-null' })
      .pipe(map((res: HttpResponse<ILocation[]>) => res.body ?? []))
      .pipe(
        map((locations: ILocation[]) =>
          this.locationService.addLocationToCollectionIfMissing(locations, this.editForm.get('comingFrom')!.value)
        )
      )
      .subscribe((locations: ILocation[]) => (this.comingFromsCollection = locations));
  }

  protected createFromForm(): IPerson {
    return {
      ...new Person(),
      id: this.editForm.get(['id'])!.value,
      personalIdentifier: this.editForm.get(['personalIdentifier'])!.value,
      identifierType: this.editForm.get(['identifierType'])!.value,
      firstName: this.editForm.get(['firstName'])!.value,
      lastName: this.editForm.get(['lastName'])!.value,
      email: this.editForm.get(['email'])!.value,
      phoneNumber: this.editForm.get(['phoneNumber'])!.value,
      firstSpokenLanguage: this.editForm.get(['firstSpokenLanguage'])!.value,
      secondSpokenLanguage: this.editForm.get(['secondSpokenLanguage'])!.value,
      comingFrom: this.editForm.get(['comingFrom'])!.value,
    };
  }
}
