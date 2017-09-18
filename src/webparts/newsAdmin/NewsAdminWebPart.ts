import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'NewsAdminWebPartStrings';
import NewsAdmin from './components/NewsAdmin';
import { INewsAdminProps } from './components/INewsAdminProps';
import { INewsAdminWebPartProps } from './INewsAdminWebPartProps';

export default class NewsAdminWebPart extends BaseClientSideWebPart<INewsAdminWebPartProps> {

  public render(): void {
    const element: React.ReactElement<INewsAdminProps > = React.createElement(
      NewsAdmin,
      {
        description: this.properties.description
      }
    );

    ReactDom.render(element, this.domElement);
  }
  

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
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
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
