import { DisplayMode } from '@microsoft/sp-core-library';
import { IArticleMetadataProperty } from './IArticleMetadataState';

export default interface IMetadataPropertyProps {
    prop: IArticleMetadataProperty;
    displayMode: DisplayMode;
    onChange: (prop: IArticleMetadataProperty, value: any) => void;
}