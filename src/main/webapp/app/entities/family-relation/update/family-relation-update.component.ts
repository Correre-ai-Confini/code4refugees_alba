import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IFamilyRelation, FamilyRelation } from '../family-relation.model';
import { FamilyRelationService } from '../service/family-relation.service';
import { IRefugee } from 'app/entities/refugee/refugee.model';
import { RefugeeService } from 'app/entities/refugee/service/refugee.service';
import { FamilyRelationType } from 'app/entities/enumerations/family-relation-type.model';

@Component({
  selector: 'jhi-family-relation-update',
  templateUrl: './family-relation-update.component.html',
})
export class FamilyRelationUpdateComponent implements OnInit {
  isSaving = false;
  familyRelationTypeValues = Object.keys(FamilyRelationType);

  refugeesSharedCollection: IRefugee[] = [];

  editForm = this.fb.group({
    id: [],
    notes: [],
    relType: [],
    refugee1: [],
    refugee2: [],
  });

  constructor(
    protected familyRelationService: FamilyRelationService,
    protected refugeeService: RefugeeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ familyRelation }) => {
      this.updateForm(familyRelation);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const familyRelation = this.createFromForm();
    if (familyRelation.id !== undefined) {
      this.subscribeToSaveResponse(this.familyRelationService.update(familyRelation));
    } else {
      this.subscribeToSaveResponse(this.familyRelationService.create(familyRelation));
    }
  }

  trackRefugeeById(index: number, item: IRefugee): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFamilyRelation>>): void {
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

  protected updateForm(familyRelation: IFamilyRelation): void {
    this.editForm.patchValue({
      id: familyRelation.id,
      notes: familyRelation.notes,
      relType: familyRelation.relType,
      refugee1: familyRelation.refugee1,
      refugee2: familyRelation.refugee2,
    });

    this.refugeesSharedCollection = this.refugeeService.addRefugeeToCollectionIfMissing(
      this.refugeesSharedCollection,
      familyRelation.refugee1,
      familyRelation.refugee2
    );
  }

  protected loadRelationshipsOptions(): void {
    this.refugeeService
      .query()
      .pipe(map((res: HttpResponse<IRefugee[]>) => res.body ?? []))
      .pipe(
        map((refugees: IRefugee[]) =>
          this.refugeeService.addRefugeeToCollectionIfMissing(
            refugees,
            this.editForm.get('refugee1')!.value,
            this.editForm.get('refugee2')!.value
          )
        )
      )
      .subscribe((refugees: IRefugee[]) => (this.refugeesSharedCollection = refugees));
  }

  protected createFromForm(): IFamilyRelation {
    return {
      ...new FamilyRelation(),
      id: this.editForm.get(['id'])!.value,
      notes: this.editForm.get(['notes'])!.value,
      relType: this.editForm.get(['relType'])!.value,
      refugee1: this.editForm.get(['refugee1'])!.value,
      refugee2: this.editForm.get(['refugee2'])!.value,
    };
  }
}
