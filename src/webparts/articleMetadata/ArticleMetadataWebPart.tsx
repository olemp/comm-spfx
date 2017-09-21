import { } from '@microsoft/sp-core-library/lib/DisplayMode';
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
import pnp, { List, Item, Logger, LogLevel, ConsoleListener } from 'sp-pnp-js';
import PropertyPane from "./config/PropertyPane";
import ArticleMetadata from './components/ArticleMetadata';
import FontSizeOptions from './config/FontSizeOptions';
import { IArticleMetadataProps } from './components/IArticleMetadataProps';
import { IArticleMetadataWebPartProps } from './IArticleMetadataWebPartProps';

export default class ArticleMetadataWebPart extends BaseClientSideWebPart<IArticleMetadataWebPartProps> {
  private supportedFieldTypes = ["text", "choice", "multichoice", "boolean"];
  private list: List;
  private pageItem: Item;
  private fieldGroups: any[] = [];

  public render(): void {
    Logger.log({ message: `ArticleMetadataWebPart: render()`, data: { displayMode: this.displayMode, properties: this.properties }, level: LogLevel.Info });
    const element: React.ReactElement<IArticleMetadataProps> = React.createElement(
      ArticleMetadata,
      {
        displayMode: this.displayMode,
        list: this.list,
        pageItem: this.pageItem,
        supportedFieldTypes: this.supportedFieldTypes,
        properties: this.properties,
      },
    );
    ReactDom.render(element, this.domElement);
  }

  public onInit(): Promise<void> {
    Logger.log({ message: `ArticleMetadataWebPart: onInit()`, data: {}, level: LogLevel.Info });
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
    Logger.log({ message: `ArticleMetadataWebPart: getPropertyPaneData()`, data: {}, level: LogLevel.Info });
    return new Promise<void>((resolve, reject) => {
      this.list.fields.get().then(fields => {
        this.fieldGroups = unique(fields.map(f => f.Group));
        resolve();
      });
    });
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    Logger.log({ message: `ArticleMetadataWebPart: getPropertyPaneConfiguration()`, data: { fieldGroups: this.fieldGroups }, level: LogLevel.Info });
    return PropertyPane(this.fieldGroups);
  }
}
