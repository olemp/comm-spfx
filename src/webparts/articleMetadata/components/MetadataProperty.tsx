import * as React from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { DisplayMode } from '@microsoft/sp-core-library';
import styles from './ArticleMetadata.module.scss';
import IMetadataPropertyProps from './IMetadataPropertyProps';

export default class MetadataProperty extends React.Component<IMetadataPropertyProps, any> {
  constructor(props) {
    super(props);
    this.state = {
      terms: [],
    };
  }

  public componentDidMount() {
    const { prop, displayMode } = this.props;
    if (displayMode === DisplayMode.Edit) {
      switch (prop.fieldType) {
        case "taxonomyfieldtype": {
          this.fetchTerms();
        }
          break;
      }
    }
  }

  private fetchTerms() {
    this.setState({ terms: [{ Label: "Arbeid og næringsliv" }] });
  }

  public render() {
    const { prop, displayMode, onChange } = this.props;
    const { terms } = this.state;
    let value = null;
    if (displayMode === DisplayMode.Read) {
      switch (prop.fieldType) {
        default: {
          value = prop.value;
        }
      }
    }
    if (displayMode === DisplayMode.Edit) {
      switch (prop.fieldType) {
        case "text": {
          value = (
            <TextField
              onChanged={newValue => onChange(prop, newValue)}
              value={prop.value} />
          );
        }
          break;
        case "choice": {
          value = (
            <Dropdown
              selectedKey={prop.value}
              onChanged={option => onChange(prop, option.text)}
              options={prop.choices.map(choice => ({
                key: choice,
                text: choice,
              }))} />
          );
        }
          break;
        case "taxonomyfieldtype": {
          value = (
            <Dropdown
              selectedKey={prop.value}
              onChanged={option => onChange(prop, option.text)}
              options={terms.map(term => ({
                key: term.Label,
                text: term.Label,
              }))} />
          );
        }
          break;
        case "boolean": {
          value = (
            <Toggle
              checked={prop.value}
              onChanged={option => onChange(prop, option)} />
          );
        }
          break;
      }
    }
    return (
      <div className={`ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}`}>
        <div className="ms-Grid-col ms-lg10 ms-xl8 ms-xlPush2 ms-lgPush1">
          <div className="ms-font-xl ms-fontColor-white">{prop.title}</div>
          <div className="ms-font-m ms-fontColor-white">{value}</div>
        </div>
      </div>
    );
  }
}
