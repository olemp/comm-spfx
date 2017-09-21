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
          value = prop.value ? 'Ja' : 'Nei';
        }
          break;
        case 'multichoice': {
          value = (
            <ul className={styles.multiChoiceList}>
              {(prop.value || []).map(choice => (
                <li className={styles.multiChoiceListItem}>
                  <span>{choice}</span>
                </li>
              ))}
            </ul>
          );
        }
          break;
        default: {
          value = prop.value;
        }
      }
    }
    if (displayMode === DisplayMode.Edit) {
      switch (prop.fieldType) {
        case 'text': {
          value = (
            <TextField
              onChanged={newValue => onChange(prop, newValue)}
              value={prop.value} />
          );
        }
          break;
        case 'choice': {
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
        case 'multichoice': {
          value = (
            <div>
              {prop.choices.map(choice => (
                <div className={styles.multiChoiceOptionContainer}>
                  <Checkbox
                    label={choice}
                    defaultChecked={prop.value.indexOf(choice) !== -1}
                    onChange={(e, checked) => onChange(prop, choice, { checked })}
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
              checked={prop.value}
              onChanged={option => onChange(prop, option)} />
          );
        }
          break;
      }
    }
    return (
      <div className={`ms-Grid-row ${styles.row}`}
        style={{ padding: this.props.padding }}>
        <div className={`ms-Grid-col ms-sm12 ${styles.column}`}>
          <div className={labelSize}>{prop.title}</div>
          <div className={valueSize}>{value}</div>
        </div>
      </div>
    );
  }
}
