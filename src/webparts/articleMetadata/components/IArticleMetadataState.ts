export interface IArticleMetadataProperty {
  fieldType: string;
  fieldName: string;
  title: string;
  value: any;
  choices: string[];
  termSetId: string;
}

export interface IArticleMetadataState {
  listFields?: any[];
  pageListItem?: any;
  properties: IArticleMetadataProperty[];
  terms?: any[];
}
