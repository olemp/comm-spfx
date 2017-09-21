export enum FieldValueType {
  Normal,
  Text,
  Html,
}

export class ArticleMetadataProperty  {
  public fieldType: string;
  public fieldName: string;
  public title: string;
  public choices: string[];
  public termSetId: string;
  private value: any[];

  constructor(field, listItem) {
    console.log(listItem);
    this.fieldType = field.TypeAsString.toLowerCase();
    this.fieldName = field.InternalName;
    this.title = field.Title;
    this.choices = field.Choices;
    this.termSetId = field.TermSetId;
    this.setValue(listItem);
  }

  private setValue(listItem) {
    this.value = [
      listItem[this.fieldName],
      listItem.FieldValuesAsText[this.fieldName],
      listItem.FieldValuesAsHtml[this.fieldName]
    ];
  }

  public getValue<T>(type = FieldValueType.Normal): T {
    console.log(type.toFixed());
    return this.value[0] as T;
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
