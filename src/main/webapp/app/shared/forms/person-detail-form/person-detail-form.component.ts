import { Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Language } from "app/entities/enumerations/language.model";
import { ILocation } from "app/entities/location/location.model";

@Component ({
  selector: "jhi-person-detail-form",
  templateUrl: "./person-detail-form.component.html"
})
export class PersonDetailFormComponent implements OnInit {
  languageValues = Object.keys (Language);
  
  @Input () comingFromsCollection: ILocation[] = [];
  
  @Input () editForm!: FormGroup;
  
  constructor () {}
  
  ngOnInit (): void {
  
  }
  
  trackLocationById (index: number, item: ILocation): number {
    return item.id!;
  }
  
}
