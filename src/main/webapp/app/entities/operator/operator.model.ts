import { IPerson } from 'app/entities/person/person.model';
import { KindOfOperator } from 'app/entities/enumerations/kind-of-operator.model';

export interface IOperator {
  id?: number;
  kindOfOperator?: KindOfOperator | null;
  personalInformation?: IPerson | null;
}

export class Operator implements IOperator {
  constructor(public id?: number, public kindOfOperator?: KindOfOperator | null, public personalInformation?: IPerson | null) {}
}

export function getOperatorIdentifier(operator: IOperator): number | undefined {
  return operator.id;
}
