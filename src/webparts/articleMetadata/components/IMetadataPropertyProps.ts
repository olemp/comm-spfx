import { DisplayMode } from '@microsoft/sp-core-library';
import { ArticleMetadataProperty } from './IArticleMetadataState';

export default interface IMetadataPropertyProps {
    prop: ArticleMetadataProperty;
    displayMode: DisplayMode;
    onChange: (prop: ArticleMetadataProperty, value: any, additionalParams?: any) => void;
}