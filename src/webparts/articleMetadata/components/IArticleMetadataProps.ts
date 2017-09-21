import { List, Item } from "sp-pnp-js";
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { DisplayMode } from '@microsoft/sp-core-library';
import { IArticleMetadataWebPartProps } from '../IArticleMetadataWebPartProps';

export interface IArticleMetadataProps {
  displayMode: DisplayMode;
  list: List;
  pageItem: Item;
  supportedFieldTypes: string[];
  properties?: IArticleMetadataWebPartProps;
}
