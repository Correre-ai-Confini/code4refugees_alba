import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApplicationConfigService } from "app/core/config/application-config.service";
import { Observable } from "rxjs";
import { IFirstRegistration } from "../first-registration.model";

export type EntityResponseType = HttpResponse<IFirstRegistration>;
export type EntityArrayResponseType = HttpResponse<IFirstRegistration[]>;

@Injectable ({ providedIn: "root" })
export class FirstRegistrationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor ("api/attachment-categories");
  
  constructor (protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}
  
  create (firstRegistration: IFirstRegistration): Observable<EntityResponseType> {
    return this.http.post<IFirstRegistration> (this.resourceUrl, firstRegistration, { observe: "response" });
  }
  
  find (id: number): Observable<EntityResponseType> {
    return this.http.get<IFirstRegistration> (`${ this.resourceUrl }/${ id }`, { observe: "response" });
  }
  
}
