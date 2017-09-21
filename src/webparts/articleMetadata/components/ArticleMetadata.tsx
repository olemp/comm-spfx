import { message } from 'gulp-typescript/release/utils';
import { } from '@microsoft/sp-core-library/lib/DisplayMode';
import * as React from 'react';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import {
  Spinner,
  SpinnerSize,
} from 'office-ui-fabric-react/lib/Spinner';
import { DisplayMode } from '@microsoft/sp-core-library';
import styles from './ArticleMetadata.module.scss';
import { IArticleMetadataProps } from './IArticleMetadataProps';
import { IArticleMetadataState, ArticleMetadataProperty } from './IArticleMetadataState';
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
      isLoading: true,
      properties: [],
    };
  }

  public render(): React.ReactElement<IArticleMetadataProps> {
    if (this.props.displayMode === DisplayMode.Read && !this.props.properties.showInReadMode) {
      return null;
    }
    if (this.state.isLoading) {
      return <Spinner size={SpinnerSize.large} />;
    }
    let containerClassName = [styles.container];
    let containerStyle: React.CSSProperties = {};
    if (this.props.properties.boxShadow) {
      containerStyle.boxShadow = "0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1)";
    }
    if (this.props.properties.useThemeColors && this.props.displayMode === DisplayMode.Read) {
      containerClassName.push(styles.themeColors);
    }
    return (
      <div className={styles.articleMetadata}>
        <div className={containerClassName.join(" ")}
          style={containerStyle}>
          <div className={`ms-Grid-row ${styles.row}`}>
            <div className={`ms-Grid-col ms-sm12 ${styles.column}`}
              style={{ padding: this.props.properties.columnPadding }}>
              <div className={this.props.properties.headerTextSize}>{this.props.properties.headerText}</div>
            </div>
          </div>
          {this.state.properties.map((prop, key) => (
            <MetadataProperty
              key={key}
              prop={prop}
              displayMode={this.props.displayMode}
              onChange={this.onPropertyChange}
              labelSize={this.props.properties.labelSize}
              valueSize={this.props.properties.valueSize}
              columnPadding={this.props.properties.columnPadding} />
          ))}
        </div>
      </div >
    );
  }

  private onSaveChanges = ({ pageItem }: IArticleMetadataProps, { properties }: IArticleMetadataState) => new Promise<ItemUpdateResult>((resolve, reject) => {
    const values = {};
    properties.forEach(prop => {
      values[prop.fieldName] = prop.getValueForUpdate();
    });
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

  private onPropertyChange = (propChanged: ArticleMetadataProperty, value: any, additionalParams?: any) => {
    Logger.log({ message: `Property ${propChanged.fieldName} was changed`, data: { propChanged, value }, level: LogLevel.Info });
    switch (propChanged.fieldType) {
      case "multichoice": {
        let newValue = [].concat(propChanged.value || []);
        if (additionalParams.checked) {
          newValue.push(value);
        } else {
          let index = newValue.indexOf(value);
          if (index > -1) {
            newValue.splice(index, 1);
          }
        }
        this.setState({
          properties: this.state.properties.map(prop => {
            if (propChanged.fieldName === prop.fieldName) {
              propChanged.value = newValue;
              return propChanged;
            }
            return prop;
          })
        });
      }
        break;
      default: {
        this.setState({
          properties: this.state.properties.map(prop => {
            if (propChanged.fieldName === prop.fieldName) {
              propChanged.value = value;
              return propChanged;
            }
            return prop;
          })
        });
      }
    }
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
      list.fields.filter(`Group eq '${this.props.properties.groupName}'`).get(),
      pageItem.get(),
    ])
      .then(([listFields, pageListItem]) => {
        let properties = listFields
          .map(fld => new ArticleMetadataProperty(fld, pageListItem[fld.InternalName]))
          .filter(prop => supportedFieldTypes.indexOf(prop.fieldType) !== -1);
        this.setState({
          listFields,
          pageListItem,
          properties,
          isLoading: false,
        });
      })
      .catch(err => {
        Logger.log({ message: `Failed to fetch properties`, data: { err }, level: LogLevel.Error });
      });
  }
}
