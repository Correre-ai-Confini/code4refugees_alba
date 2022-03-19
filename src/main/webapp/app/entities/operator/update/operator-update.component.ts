import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IOperator, Operator } from '../operator.model';
import { OperatorService } from '../service/operator.service';
import { IPerson } from 'app/entities/person/person.model';
import { PersonService } from 'app/entities/person/service/person.service';
import { KindOfOperator } from 'app/entities/enumerations/kind-of-operator.model';

@Component({
  selector: 'jhi-operator-update',
  templateUrl: './operator-update.component.html',
})
export class OperatorUpdateComponent implements OnInit {
  isSaving = false;
  kindOfOperatorValues = Object.keys(KindOfOperator);

  personalInformationsCollection: IPerson[] = [];

  editForm = this.fb.group({
    id: [],
    kindOfOperator: [],
    personalInformation: [],
  });

  constructor(
    protected operatorService: OperatorService,
    protected personService: PersonService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ operator }) => {
      this.updateForm(operator);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const operator = this.createFromForm();
    if (operator.id !== undefined) {
      this.subscribeToSaveResponse(this.operatorService.update(operator));
    } else {
      this.subscribeToSaveResponse(this.operatorService.create(operator));
    }
  }

  trackPersonById(index: number, item: IPerson): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOperator>>): void {
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

  protected updateForm(operator: IOperator): void {
    this.editForm.patchValue({
      id: operator.id,
      kindOfOperator: operator.kindOfOperator,
      personalInformation: operator.personalInformation,
    });

    this.personalInformationsCollection = this.personService.addPersonToCollectionIfMissing(
      this.personalInformationsCollection,
      operator.personalInformation
    );
  }

  protected loadRelationshipsOptions(): void {
    this.personService
      .query({ filter: 'operator-is-null' })
      .pipe(map((res: HttpResponse<IPerson[]>) => res.body ?? []))
      .pipe(
        map((people: IPerson[]) =>
          this.personService.addPersonToCollectionIfMissing(people, this.editForm.get('personalInformation')!.value)
        )
      )
      .subscribe((people: IPerson[]) => (this.personalInformationsCollection = people));
  }

  protected createFromForm(): IOperator {
    return {
      ...new Operator(),
      id: this.editForm.get(['id'])!.value,
      kindOfOperator: this.editForm.get(['kindOfOperator'])!.value,
      personalInformation: this.editForm.get(['personalInformation'])!.value,
    };
  }
}
