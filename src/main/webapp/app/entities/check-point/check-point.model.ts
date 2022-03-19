import { ILocation } from 'app/entities/location/location.model';

export interface ICheckPoint {
  id?: number;
  friendlyname?: string;
  location?: ILocation | null;
}

export class CheckPoint implements ICheckPoint {
  constructor(public id?: number, public friendlyname?: string, public location?: ILocation | null) {}
}

export function getCheckPointIdentifier(checkPoint: ICheckPoint): number | undefined {
  return checkPoint.id;
}
