import { message } from 'gulp-typescript/release/utils';
import { } from '@microsoft/sp-core-library/lib/DisplayMode';
import * as React from 'react';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { DisplayMode } from '@microsoft/sp-core-library';
import styles from './ArticleMetadata.module.scss';
import { IArticleMetadataProps } from './IArticleMetadataProps';
import { IArticleMetadataState } from './IArticleMetadataState';
import { escape } from '@microsoft/sp-lodash-subset';
import {
  SPHttpClient,
  ISPHttpClientOptions,
  SPHttpClientResponse,
} from '@microsoft/sp-http';
import pnp, { List, Item, Logger, LogLevel, ItemUpdateResult } from "sp-pnp-js";
import MetadataProperty from './MetadataProperty';

export default class ArticleMetadata extends React.Component<IArticleMetadataProps, IArticleMetadataState> {
  constructor(props: IArticleMetadataProps) {
    super(props);
    this.state = {
      properties: [],
    };
  }

  public render(): React.ReactElement<IArticleMetadataProps> {
    return (
      <div className={styles.articleMetadata}>
        <div className={styles.container}>
          <div className={`ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}`}>
            <div className="ms-Grid-col ms-lg10 ms-xl8 ms-xlPush2 ms-lgPush1">
              <div className="ms-font-xxl ms-fontColor-white">{this.props.title}</div>
            </div>
          </div>
          {this.state.properties.map((prop, key) => (
            <MetadataProperty
              key={key}
              prop={prop}
              displayMode={this.props.displayMode}
              onChange={this.onPropertyChange} />
          ))}
        </div>
      </div >
    );
  }

  private onSaveChanges = (spHttpClient: SPHttpClient) => new Promise<ItemUpdateResult>((resolve, reject) => {
    const values = {};
    this.state.properties.forEach(prop => {
      values[prop.fieldName] = prop.value;
    });
    Logger.log({ message: `Updating page`, data: values, level: LogLevel.Info });
    this.props.pageItem.update(values).then(resolve, reject);
  })

  private onPropertyChange = (propChanged, value) => {
    Logger.log({ message: `Property ${propChanged} was changed`, data: { propChanged, value }, level: LogLevel.Info });
    this.setState({
      properties: this.state.properties.map(prop => {
        if (propChanged.fieldName === prop.fieldName) {
          return {
            ...prop,
            value,
          };
        }
        return prop;
      })
    });
  }

  public componentDidUpdate(prevProps: IArticleMetadataProps, prevState: IArticleMetadataState, prevContext: any) {
    if (prevProps.displayMode === DisplayMode.Edit && this.props.displayMode === DisplayMode.Read) {
      this.onSaveChanges(this.props.context.spHttpClient).then(result => this.fetchProperties());
    }
  }

  public componentDidMount() {
    this.fetchProperties();
  }

  private fetchProperties() {
    this.props.pageItem.fieldValuesAsHTML.get().then(pageListItem => {
      let properties = this.props.fields
        .filter(fld => fld.Group === this.props.groupName)
        .map(fld => ({
          fieldType: fld.TypeAsString.toLowerCase(),
          fieldName: fld.InternalName,
          title: fld.Title,
          value: pageListItem[fld.InternalName],
          choices: fld.Choices,
        }));
      this.setState({ pageListItem, properties });
    });
  }
}
