import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApplicationConfigService } from "app/core/config/application-config.service";
import { Observable } from "rxjs";
import { IFirstRegistration } from "../first-registration.model";

export type EntityResponseType = HttpResponse<IFirstRegistration>;
export type EntityArrayResponseType = HttpResponse<IFirstRegistration[]>;

@Injectable ({ providedIn: "root" })
export class FirstRegistrationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor ("api/checkpoint-client/register");
  
  constructor (protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}
  
  create (firstRegistration: IFirstRegistration): Observable<EntityResponseType> {
    return this.http.post<IFirstRegistration> (this.resourceUrl, firstRegistration, { observe: "response" });
  }
  
  getNewQrcode (): Observable<string> {
    return this.http.get<string> (`${ this.resourceUrl }`, { observe: "body", responseType: "text" as any });
  }
  
}
