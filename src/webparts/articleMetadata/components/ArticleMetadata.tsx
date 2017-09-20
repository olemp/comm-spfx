import { message } from 'gulp-typescript/release/utils';
import { } from '@microsoft/sp-core-library/lib/DisplayMode';
import * as React from 'react';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { DisplayMode } from '@microsoft/sp-core-library';
import styles from './ArticleMetadata.module.scss';
import { IArticleMetadataProps } from './IArticleMetadataProps';
import { IArticleMetadataState, IArticleMetadataProperty } from './IArticleMetadataState';
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
    if (this.props.displayMode === DisplayMode.Read && !this.props.showInReadMode) {
      return null;
    }
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

  private onSaveChanges = ({ pageItem }: IArticleMetadataProps, { properties }: IArticleMetadataState) => new Promise<ItemUpdateResult>((resolve, reject) => {
    const values = {};
    properties.forEach(prop => values[prop.fieldName] = prop.value);
    Logger.log({ message: `Updating page`, data: values, level: LogLevel.Info });
    pageItem.update(values)
      .then(() => {
        Logger.log({ message: `Successfully updated page`, data: {}, level: LogLevel.Info });
        resolve();
      })
      .catch(err => {
        Logger.log({ message: `Failed to update page`, data: { err }, level: LogLevel.Error });
        reject();
      });
  })

  private onPropertyChange = (propChanged: IArticleMetadataProperty, value) => {
    Logger.log({ message: `Property ${propChanged.fieldName} was changed`, data: { propChanged, value }, level: LogLevel.Info });
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
      this.onSaveChanges(this.props, this.state).then(result => this.fetchProperties(this.props, this.state));
    }
  }

  public componentDidMount() {
    this.fetchProperties(this.props, this.state);
  }

  private fetchProperties({ list, pageItem, supportedFieldTypes }: IArticleMetadataProps, { }: IArticleMetadataState) {
    Promise.all([
      list.fields.filter(`Group eq '${this.props.groupName}'`).get(),
      pageItem.get(),
    ])
      .then(([listFields, pageListItem]) => {
        let properties = listFields
          .map(fld => ({
            fieldType: fld.TypeAsString.toLowerCase(),
            fieldName: fld.InternalName,
            title: fld.Title,
            value: pageListItem[fld.InternalName],
            choices: fld.Choices,
            termSetId: fld.TermSetId,
          }))
          .filter(prop => supportedFieldTypes.indexOf(prop.fieldType) !== -1);
        this.setState({ listFields, pageListItem, properties });
      })
      .catch(err => {
        Logger.log({ message: `Failed to fetch properties`, data: { err }, level: LogLevel.Error });
      });
  }
}
