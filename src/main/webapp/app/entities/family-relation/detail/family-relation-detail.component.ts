import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFamilyRelation } from '../family-relation.model';

@Component({
  selector: 'jhi-family-relation-detail',
  templateUrl: './family-relation-detail.component.html',
})
export class FamilyRelationDetailComponent implements OnInit {
  familyRelation: IFamilyRelation | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ familyRelation }) => {
      this.familyRelation = familyRelation;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
