import * as React from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import {
  Dropdown,
  IDropdownOption,
} from 'office-ui-fabric-react/lib/Dropdown';
import { DisplayMode } from '@microsoft/sp-core-library';
import styles from './ArticleMetadata.module.scss';
import IMetadataPropertyProps from './IMetadataPropertyProps';

export default class MetadataProperty extends React.Component<IMetadataPropertyProps, any> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  public render() {
    const {
      className,
      prop,
      labelSize,
      valueSize,
      displayMode,
      onChange,
     } = this.props;

    let value = null;
    if (displayMode === DisplayMode.Read) {
      switch (prop.fieldType) {
        case 'boolean': {
          value = prop.getValue<boolean>() ? 'Ja' : 'Nei';
        }
          break;
        case 'multichoice': {
          value = (
            <ul className={styles.multiChoiceList}>
              {(prop.getValue<string[]>() || []).map((v, key) => (
                <li
                  key={`${v}_${key}`}
                  className={styles.multiChoiceListItem}>
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          );
        }
          break;
        default: {
          value = prop.getValue<any>();
        }
      }
    }
    if (displayMode === DisplayMode.Edit) {
      switch (prop.fieldType) {
        case 'text': {
          value = (
            <TextField
              onChanged={newValue => onChange(prop, newValue)}
              value={prop.getValue<string>()} />
          );
        }
          break;
        case 'choice': {
          value = (
            <Dropdown
              selectedKey={prop.getValue()}
              onChanged={option => onChange(prop, option.text)}
              options={prop.choices.map(choice => ({
                key: choice,
                text: choice,
              }))} />
          );
        }
          break;
        case 'multichoice': {
          value = (
            <div>
              {prop.choices.map((c, key) => (
                <div
                  key={`${c}_${key}`}
                  className={styles.multiChoiceOptionContainer}>
                  <Checkbox
                    label={c}
                    defaultChecked={prop.getValue<string[]>().indexOf(c) !== -1}
                    onChange={(e, checked) => onChange(prop, c, { checked })}
                  />
                </div>
              ))}
            </div>
          );
        }
          break;
        case 'boolean': {
          value = (
            <Toggle
              checked={prop.getValue<boolean>()}
              onChanged={option => onChange(prop, option)} />
          );
        }
          break;
      }
    }
    return (
      <div className={`ms-Grid-row ${className} ${styles.row} ${prop.fieldName.toLowerCase()} ${className}-${prop.fieldType}`}
        style={{ padding: this.props.padding }}>
        <div className={`ms-Grid-col ms-sm12 ${styles.column}`}>
          <div className={`${labelSize} ${className}-label`}>{prop.title}</div>
          <div className={`${valueSize} ${className}-value`}>{value}</div>
        </div>
      </div>
    );
  }
}
