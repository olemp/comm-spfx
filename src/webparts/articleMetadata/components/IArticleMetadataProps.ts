import { List, Item } from "sp-pnp-js";
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { DisplayMode } from '@microsoft/sp-core-library';

export interface IArticleMetadataProps {
  title: string;
  groupName: string;
  context: WebPartContext;
  displayMode: DisplayMode;
  list: List;
  pageItem: Item;
  showInReadMode: boolean;
  supportedFieldTypes: string[];
}
