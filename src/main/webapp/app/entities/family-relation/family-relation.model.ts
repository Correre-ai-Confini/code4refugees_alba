import { IRefugee } from 'app/entities/refugee/refugee.model';
import { FamilyRelationType } from 'app/entities/enumerations/family-relation-type.model';

export interface IFamilyRelation {
  id?: number;
  notes?: string | null;
  relType?: FamilyRelationType | null;
  refugee1?: IRefugee | null;
  refugee2?: IRefugee | null;
}

export class FamilyRelation implements IFamilyRelation {
  constructor(
    public id?: number,
    public notes?: string | null,
    public relType?: FamilyRelationType | null,
    public refugee1?: IRefugee | null,
    public refugee2?: IRefugee | null
  ) {}
}

export function getFamilyRelationIdentifier(familyRelation: IFamilyRelation): number | undefined {
  return familyRelation.id;
}
