import { } from '@microsoft/sp-core-library/lib/DisplayMode';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as unique from 'array-unique';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
} from '@microsoft/sp-webpart-base';
import pnp, { List, Item } from "sp-pnp-js";
import * as strings from 'ArticleMetadataWebPartStrings';
import ArticleMetadata from './components/ArticleMetadata';
import { IArticleMetadataProps } from './components/IArticleMetadataProps';
import { IArticleMetadataWebPartProps } from './IArticleMetadataWebPartProps';

export default class ArticleMetadataWebPart extends BaseClientSideWebPart<IArticleMetadataWebPartProps> {
  private list: List;
  private pageItem: Item;
  private initData = false;
  private fields: any[] = [];
  private fieldGroups: any[] = [];

  public render(): void {
    this._initializeData().then(_ => {
      const props = {
        title: this.properties.headerText,
        groupName: this.properties.groupName,
        context: this.context,
        displayMode: this.displayMode,
        list: this.list,
        pageItem: this.pageItem,
        fields: this.fields,
      };
      const element: React.ReactElement<IArticleMetadataProps> = React.createElement(
        ArticleMetadata,
        props,
      );
      ReactDom.render(element, this.domElement);
    });
  }

  public onInit(): Promise<void> {
    return super.onInit().then(_ => {
      pnp.setup({
        spfxContext: this.context
      });
      this._initializeData();
    });
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  private _initializeData(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this.initData) {
        const { listItem, list } = this.context.pageContext;
        this.list = pnp.sp.web.lists.getById(list.id.toString());
        this.pageItem = this.list.items.getById(listItem.id);
        this.list.fields.get().then(fields => {
          this.fields = fields;
          this.fieldGroups = unique(fields.map(f => f.Group));
          this.initData = true;
          resolve();
        });
      }
      resolve();
    });
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    if (this.fieldGroups.length === 0) {
      this.dispose();
    }
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('headerText', {
                  label: "Overskrift",
                }),
                PropertyPaneDropdown('groupName', {
                  label: "Gruppenavn",
                  options: this.fieldGroups.map(grp => ({
                    key: grp,
                    text: grp,
                  }))
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
