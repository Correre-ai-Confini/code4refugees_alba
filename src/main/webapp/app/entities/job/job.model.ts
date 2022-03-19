export interface IJob {
  id?: number;
  jobTitle?: string | null;
}

export class Job implements IJob {
  constructor(public id?: number, public jobTitle?: string | null) {}
}

export function getJobIdentifier(job: IJob): number | undefined {
  return job.id;
}
