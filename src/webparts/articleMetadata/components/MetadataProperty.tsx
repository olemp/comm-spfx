import * as React from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { DisplayMode } from '@microsoft/sp-core-library';
import styles from './ArticleMetadata.module.scss';
import IMetadataPropertyProps from './IMetadataPropertyProps';

const MetadataProperty = ({ prop, displayMode, onChange }: IMetadataPropertyProps) => {
  if (displayMode === DisplayMode.Read) {
    return (
      <div className={`ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}`}>
        <div className="ms-Grid-col ms-lg10 ms-xl8 ms-xlPush2 ms-lgPush1">
          <div className="ms-font-xl ms-fontColor-white">{prop.title}</div>
          <div className="ms-font-m ms-fontColor-white">{prop.value}</div>
        </div>
      </div>
    );
  }
  if (displayMode === DisplayMode.Edit) {
    let editControl = null;
    switch (prop.fieldType) {
      case "text": {
        editControl = (
          <TextField
            onChanged={newValue => onChange(prop, newValue)}
            value={prop.value} />
        );
      }
        break;
      case "choice": {
        editControl = (
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
      case "boolean": {
        editControl = (
          <Toggle
            checked={prop.value}
            onChanged={option => onChange(prop, option)} />
        );
      }
        break;
    }
    return (
      <div className={`ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}`}>
        <div className="ms-Grid-col ms-lg10 ms-xl8 ms-xlPush2 ms-lgPush1">
          <div className="ms-font-xl ms-fontColor-white">{prop.title}</div>
          <div className="ms-font-m ms-fontColor-white">{editControl}</div>
        </div>
      </div>
    );
  }
  return null;
};

export default MetadataProperty;
