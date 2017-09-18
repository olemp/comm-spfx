export interface IArticleMetadataProperty {
  fieldType: string;
  fieldName: string;
  title: string;
  value: any;
  choices: string[];
}

export interface IArticleMetadataState {
  pageListItem?: any;
  properties: IArticleMetadataProperty[];
}
