import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFamilyRelation } from '../family-relation.model';

@Component({
  selector: 'jhi-family-relation-detail',
  templateUrl: './family-relation-detail.component.html',
})
export class FamilyRelationDetailComponent implements OnInit {
  familyRelation: IFamilyRelation | null = null;
  refugee1ViewData: string | unknown = null;
  refugee2ViewData: string | unknown = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ familyRelation }) => {
      this.familyRelation = familyRelation;
      this.refugee1ViewData = (familyRelation.refugee1.personalInformation.firstName || familyRelation.refugee1.personalInformation.lastName)
                              ? familyRelation.refugee1?.personalInformation?.firstName + ' ' + familyRelation.refugee1?.personalInformation?.lastName
                              : familyRelation.refugee1?.personalInformation?.id;
      this.refugee2ViewData = (familyRelation.refugee2.personalInformation.firstName || familyRelation.refugee2.personalInformation.lastName)
                              ? familyRelation.refugee2?.personalInformation?.firstName + ' ' + familyRelation.refugee2?.personalInformation?.lastName
                              : familyRelation.refugee2?.personalInformation?.id;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
