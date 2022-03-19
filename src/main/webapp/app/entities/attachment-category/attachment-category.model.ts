export interface IAttachmentCategory {
  id?: number;
  description?: string | null;
}

export class AttachmentCategory implements IAttachmentCategory {
  constructor(public id?: number, public description?: string | null) {}
}

export function getAttachmentCategoryIdentifier(attachmentCategory: IAttachmentCategory): number | undefined {
  return attachmentCategory.id;
}
