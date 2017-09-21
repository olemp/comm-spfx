import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as unique from 'array-unique';
import {
  Version,
  DisplayMode,
} from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  PropertyPaneToggle,
  PropertyPaneSlider,
  IPropertyPaneDropdownOption,
} from '@microsoft/sp-webpart-base';
import pnp, { List, Item, LogLevel, ConsoleListener } from 'sp-pnp-js';
import * as strings from 'ArticleMetadataWebPartStrings';
import ArticleMetadata from './components/ArticleMetadata';
import FontSizeOptions from './config/FontSizeOptions';
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
        displayMode: this.displayMode,
        list: this.list,
        pageItem: this.pageItem,
        supportedFieldTypes: ["text", "choice", "multichoice", "boolean"],
        properties: this.properties,
      },
    );
    ReactDom.render(element, this.domElement);
  }

  public onInit(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      pnp.log.activeLogLevel = LogLevel.Info;
      pnp.log.subscribe(new ConsoleListener());
      pnp.setup({
        spfxContext: this.context,
      });
      this.list = pnp.sp.web.lists.getById(this.context.pageContext.list.id.toString());
      this.pageItem = this.list.items.getById(this.context.pageContext.listItem.id);
      this.getPropertyPaneData()
        .then(_ => {
          super.onInit()
            .then(resolve)
            .catch(reject);
        })
        .catch(reject);
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
    return {
      pages: [
        {
          groups: [
            {
              groupName: 'Generelt',
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
                }),
              ]
            },
            {
              groupName: 'Utseende',
              groupFields: [
                PropertyPaneSlider('columnPadding', {
                  label: "Padding",
                  min: 20,
                  max: 60,
                  step: 1,
                }),
                PropertyPaneDropdown('headerTextSize', {
                  label: 'Fontstørrelse for overskrift',
                  options: FontSizeOptions,
                }),
                PropertyPaneDropdown('labelSize', {
                  label: 'Fontstørrelse for etikett',
                  options: FontSizeOptions,
                }),
                PropertyPaneDropdown('valueSize', {
                  label: 'Fontstørrelse for verdi',
                  options: FontSizeOptions,
                }),
                PropertyPaneToggle('useThemeColors', {
                  label: "Bruk temafarger",
                }),
                PropertyPaneToggle('boxShadow', {
                  label: "Vis skygge rundt boksen",
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
