import {
    IPropertyPaneField,
    PropertyPaneTextField,
    IPropertyPaneTextFieldProps,
    PropertyPaneDropdown,
    IPropertyPaneDropdownProps,
    IPropertyPaneDropdownOption,
    PropertyPaneToggle,
    IPropertyPaneToggleProps,
    PropertyPaneSlider,
    IPropertyPaneSliderProps,
} from '@microsoft/sp-webpart-base';
import FontSizeOptions from './FontSizeOptions';
import * as strings from 'ArticleMetadataWebPartStrings';

const propertyPane = (fieldGroups: string[]) => ({
    pages: [
        {
            groups: [
                {
                    groupName: strings.propertyPaneGroupNameGeneral,
                    groupFields: [
                        PropertyPaneTextField('headerText', {
                            label: strings.propertyPaneSettingLabelHeaderText,
                        }),
                        PropertyPaneDropdown('groupName', {
                            label: strings.propertyPaneSettingLabelGroupName,
                            options: fieldGroups.map(grp => ({
                                key: grp,
                                text: grp,
                            }))
                        }),
                        PropertyPaneToggle('showInReadMode', {
                            label: strings.propertyPaneSettingLabelShowInReadMode
                        }),
                    ]
                },
                {
                    groupName: strings.propertyPaneGroupNameFieldTypes,
                    groupFields: [
                        PropertyPaneToggle('fieldTypeTextEnabled', {
                            label: strings.propertyPaneSettingLabelFieldTypeTextEnabled,
                        }),
                        PropertyPaneToggle('fieldTypeChoiceEnabled', {
                            label: strings.propertyPaneSettingLabelFieldTypeChoiceEnabled,
                        }),
                        PropertyPaneToggle('fieldTypeMultiChoiceEnabled', {
                            label: strings.propertyPaneSettingLabelFieldTypeMultiChoiceEnabled,
                        }),
                        PropertyPaneToggle('fieldTypeBooleanEnabled', {
                            label: strings.propertyPaneSettingLabelFieldTypeBooleanEnabled,
                        })
                    ]
                },
                {
                    groupName: strings.propertyPaneGroupNameLookAndFeel,
                    groupFields: [
                        PropertyPaneSlider('rowPadding', {
                            label: strings.propertyPaneSettingLabelRowPadding,
                            min: 5,
                            max: 60,
                            step: 1,
                        }),
                        PropertyPaneDropdown('headerTextSize', {
                            label: strings.propertyPaneSettingLabelHeaderTextSize,
                            options: FontSizeOptions,
                        }),
                        PropertyPaneDropdown('labelSize', {
                            label: strings.propertyPaneSettingLabelLabelSize,
                            options: FontSizeOptions,
                        }),
                        PropertyPaneDropdown('valueSize', {
                            label: strings.propertyPaneSettingLabelValueSize,
                            options: FontSizeOptions,
                        }),
                        PropertyPaneToggle('useThemeColors', {
                            label: strings.propertyPaneSettingLabelUseThemeColors,
                        }),
                        PropertyPaneToggle('boxShadow', {
                            label: strings.propertyPaneSettingLabelBoxShadow,
                        })
                    ]
                }
            ]
        }
    ]
});

export default propertyPane;
