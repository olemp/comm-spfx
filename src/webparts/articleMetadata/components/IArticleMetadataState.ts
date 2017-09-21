export interface IArticleMetadataProperty {
  fieldType: string;
  fieldName: string;
  title: string;
  value: any;
  choices: string[];
  termSetId: string;
}

export class ArticleMetadataProperty implements IArticleMetadataProperty {
  public fieldType: string;
  public fieldName: string;
  public title: string;
  public value: any;
  public choices: string[];
  public termSetId: string;

  constructor(field, value) {
    this.fieldType = field.TypeAsString.toLowerCase();
    this.fieldName = field.InternalName;
    this.title = field.Title;
    this.value = value;
    this.choices = field.Choices;
    this.termSetId = field.TermSetId;
  }

  public getValueForUpdate() {
    switch (this.fieldType) {
      case "multichoice": {
        return { __metadata: { type: "Collection(Edm.String)" }, results: this.value };
      }
      default: {
        return this.value;
      }
    }
  }
}

export interface IArticleMetadataState {
  isLoading: boolean;
  listFields?: any[];
  pageListItem?: any;
  properties: ArticleMetadataProperty[];
  terms?: any[];
}
