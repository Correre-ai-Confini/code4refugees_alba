import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOperator, getOperatorIdentifier } from '../operator.model';

export type EntityResponseType = HttpResponse<IOperator>;
export type EntityArrayResponseType = HttpResponse<IOperator[]>;

@Injectable({ providedIn: 'root' })
export class OperatorService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/operators');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(operator: IOperator): Observable<EntityResponseType> {
    return this.http.post<IOperator>(this.resourceUrl, operator, { observe: 'response' });
  }

  update(operator: IOperator): Observable<EntityResponseType> {
    return this.http.put<IOperator>(`${this.resourceUrl}/${getOperatorIdentifier(operator) as number}`, operator, { observe: 'response' });
  }

  partialUpdate(operator: IOperator): Observable<EntityResponseType> {
    return this.http.patch<IOperator>(`${this.resourceUrl}/${getOperatorIdentifier(operator) as number}`, operator, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IOperator>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOperator[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addOperatorToCollectionIfMissing(operatorCollection: IOperator[], ...operatorsToCheck: (IOperator | null | undefined)[]): IOperator[] {
    const operators: IOperator[] = operatorsToCheck.filter(isPresent);
    if (operators.length > 0) {
      const operatorCollectionIdentifiers = operatorCollection.map(operatorItem => getOperatorIdentifier(operatorItem)!);
      const operatorsToAdd = operators.filter(operatorItem => {
        const operatorIdentifier = getOperatorIdentifier(operatorItem);
        if (operatorIdentifier == null || operatorCollectionIdentifiers.includes(operatorIdentifier)) {
          return false;
        }
        operatorCollectionIdentifiers.push(operatorIdentifier);
        return true;
      });
      return [...operatorsToAdd, ...operatorCollection];
    }
    return operatorCollection;
  }
}
