import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as unique from 'array-unique';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  PropertyPaneToggle,
} from '@microsoft/sp-webpart-base';
import pnp, { List, Item, LogLevel, ConsoleListener } from 'sp-pnp-js';
import * as strings from 'ArticleMetadataWebPartStrings';
import ArticleMetadata from './components/ArticleMetadata';
import { IArticleMetadataProps } from './components/IArticleMetadataProps';
import { IArticleMetadataWebPartProps } from './IArticleMetadataWebPartProps';

export default class ArticleMetadataWebPart extends BaseClientSideWebPart<IArticleMetadataWebPartProps> {
  private list: List;
  private pageItem: Item;
  private fieldGroups: any[] = [];

  public render(): void {
    const element: React.ReactElement<IArticleMetadataProps> = React.createElement(
      ArticleMetadata,
      {
        title: this.properties.headerText,
        groupName: this.properties.groupName,
        context: this.context,
        displayMode: this.displayMode,
        list: this.list,
        pageItem: this.pageItem,
        showInReadMode: this.properties.showInReadMode,
      },
    );
    ReactDom.render(element, this.domElement);
  }

  public onInit(): Promise<void> {
    return super.onInit().then(_ => {
      pnp.log.activeLogLevel = LogLevel.Info;
      pnp.log.subscribe(new ConsoleListener());
      pnp.setup({
        spfxContext: this.context,
      });
      const { listItem, list } = this.context.pageContext;
      this.list = pnp.sp.web.lists.getById(list.id.toString());
      this.pageItem = this.list.items.getById(listItem.id);
      this.getPropertyPaneData();
    });
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  private getPropertyPaneData(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.list.fields.get().then(fields => {
        this.fieldGroups = unique(fields.map(f => f.Group));
        resolve();
      });
    });
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    if (this.fieldGroups.length === 0) {
      this.dispose();
    }
    return {
      pages: [
        {
          groups: [
            {
              groupName: 'Innstillinger',
              groupFields: [
                PropertyPaneTextField('headerText', {
                  label: 'Overskrift',
                }),
                PropertyPaneDropdown('groupName', {
                  label: 'Gruppenavn',
                  options: this.fieldGroups.map(grp => ({
                    key: grp,
                    text: grp,
                  }))
                }),
                PropertyPaneToggle('showInReadMode', {
                  label: "Vis i lesemodus",
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
