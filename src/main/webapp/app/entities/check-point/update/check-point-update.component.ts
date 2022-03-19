import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICheckPoint, CheckPoint } from '../check-point.model';
import { CheckPointService } from '../service/check-point.service';
import { ILocation } from 'app/entities/location/location.model';
import { LocationService } from 'app/entities/location/service/location.service';

@Component({
  selector: 'jhi-check-point-update',
  templateUrl: './check-point-update.component.html',
})
export class CheckPointUpdateComponent implements OnInit {
  isSaving = false;

  locationsCollection: ILocation[] = [];

  editForm = this.fb.group({
    id: [],
    friendlyname: [null, [Validators.required]],
    location: [],
  });

  constructor(
    protected checkPointService: CheckPointService,
    protected locationService: LocationService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ checkPoint }) => {
      this.updateForm(checkPoint);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const checkPoint = this.createFromForm();
    if (checkPoint.id !== undefined) {
      this.subscribeToSaveResponse(this.checkPointService.update(checkPoint));
    } else {
      this.subscribeToSaveResponse(this.checkPointService.create(checkPoint));
    }
  }

  trackLocationById(index: number, item: ILocation): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICheckPoint>>): void {
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

  protected updateForm(checkPoint: ICheckPoint): void {
    this.editForm.patchValue({
      id: checkPoint.id,
      friendlyname: checkPoint.friendlyname,
      location: checkPoint.location,
    });

    this.locationsCollection = this.locationService.addLocationToCollectionIfMissing(this.locationsCollection, checkPoint.location);
  }

  protected loadRelationshipsOptions(): void {
    this.locationService
      .query({ filter: 'checkpoint-is-null' })
      .pipe(map((res: HttpResponse<ILocation[]>) => res.body ?? []))
      .pipe(
        map((locations: ILocation[]) =>
          this.locationService.addLocationToCollectionIfMissing(locations, this.editForm.get('location')!.value)
        )
      )
      .subscribe((locations: ILocation[]) => (this.locationsCollection = locations));
  }

  protected createFromForm(): ICheckPoint {
    return {
      ...new CheckPoint(),
      id: this.editForm.get(['id'])!.value,
      friendlyname: this.editForm.get(['friendlyname'])!.value,
      location: this.editForm.get(['location'])!.value,
    };
  }
}
