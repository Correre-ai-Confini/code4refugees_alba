import dayjs from 'dayjs/esm';
import { IAttachmentCategory } from 'app/entities/attachment-category/attachment-category.model';
import { IRefugee } from 'app/entities/refugee/refugee.model';
import { IOperator } from 'app/entities/operator/operator.model';
import { IEvent } from 'app/entities/event/event.model';
import { ContentType } from 'app/entities/enumerations/content-type.model';

export interface IAttachment {
  id?: number;
  description?: string | null;
  creationTS?: dayjs.Dayjs | null;
  name?: string | null;
  contentBlobContentType?: string | null;
  contentBlob?: string | null;
  contentType?: ContentType | null;
  category?: IAttachmentCategory | null;
  refugee?: IRefugee | null;
  creator?: IOperator | null;
  originalRegistrationRecord?: IEvent | null;
}

export class Attachment implements IAttachment {
  constructor(
    public id?: number,
    public description?: string | null,
    public creationTS?: dayjs.Dayjs | null,
    public name?: string | null,
    public contentBlobContentType?: string | null,
    public contentBlob?: string | null,
    public contentType?: ContentType | null,
    public category?: IAttachmentCategory | null,
    public refugee?: IRefugee | null,
    public creator?: IOperator | null,
    public originalRegistrationRecord?: IEvent | null
  ) {}
}

export function getAttachmentIdentifier(attachment: IAttachment): number | undefined {
  return attachment.id;
}
