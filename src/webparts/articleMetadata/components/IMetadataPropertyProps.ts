import { DisplayMode } from '@microsoft/sp-core-library';
import { ArticleMetadataProperty } from './IArticleMetadataState';

export default interface IMetadataPropertyProps {
    className: string;
    prop: ArticleMetadataProperty;
    labelSize: string;
    valueSize: string;
    padding: number;
    displayMode: DisplayMode;
    onChange: (prop: ArticleMetadataProperty, value: any, additionalParams?: any) => void;
}