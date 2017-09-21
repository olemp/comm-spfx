/// <reference types='mocha' />
/// <reference types='sinon' />

import * as React from 'react';
import { assert, expect } from 'chai';
import { mount } from 'enzyme';
import { DisplayMode } from '@microsoft/sp-core-library';
import pnp from 'sp-pnp-js';

import ArticleMetadata, { ArticleMetadataProperty } from '../components/ArticleMetadata';

declare const sinon;

describe('<ArticleMetadata />', () => {
    let list;
    let pageItem;
    let renderedElementRead;
    let renderedElementEdit;
    let dummyPageListItem;
    let textProperty: ArticleMetadataProperty;
    let booleanProperty: ArticleMetadataProperty;
    let multiChoiceProperty: ArticleMetadataProperty;
    let choiceProperty: ArticleMetadataProperty;

    before(() => {
        dummyPageListItem = {
            MultiChoice: [],
            Choice: "",
            FieldValuesAsHtml: {
                MultiChoice: "",
                Choice: "",
            },
            FieldValuesAsText: {
                MultiChoice: "",
                Choice: "",
            },
        };
        textProperty = new ArticleMetadataProperty({ InternalName: "TextField", Title: "Tekst", TypeAsString: "Text" }, dummyPageListItem);
        booleanProperty = new ArticleMetadataProperty({ InternalName: "BooleanField", Title: "Ja/nei", TypeAsString: "Boolean" }, dummyPageListItem);
        multiChoiceProperty = new ArticleMetadataProperty({ InternalName: "MultiChoice", Title: "Flervalg", Choices: ["London"], TypeAsString: "MultiChoice" }, dummyPageListItem);
        choiceProperty = new ArticleMetadataProperty({ InternalName: "Choice", Title: "Valg", Choices: ["London"], TypeAsString: "Choice" }, dummyPageListItem);
        list = pnp.sp.web.lists.getById('caf15ef9-de66-45a4-87ed-bea9dbe54ddd');
        pageItem = list.items.getById(9);
        renderedElementRead = mount(<ArticleMetadata
            list={list}
            pageItem={pageItem}
            displayMode={DisplayMode.Read}
            fieldTypes={[]}
            properties={{
                headerText: 'Artikkelinformasjon',
                groupName: 'News',
                showInReadMode: false,
                boxShadow: true,
                useThemeColors: true,
                rowPadding: 20,
                headerTextSize: 'ms-font-xxl',
                labelSize: 'ms-font-xl',
                valueSize: 'ms-font-m'
            }} />);
        renderedElementEdit = mount(<ArticleMetadata
            list={list}
            pageItem={pageItem}
            displayMode={DisplayMode.Edit}
            fieldTypes={[]}
            properties={{
                headerText: 'Artikkelinformasjon',
                groupName: 'News',
                showInReadMode: false,
                boxShadow: true,
                useThemeColors: true,
                rowPadding: 20,
                headerTextSize: 'ms-font-xxl',
                labelSize: 'ms-font-xl',
                valueSize: 'ms-font-m'
            }} />);
    });

    after(() => {
        // after
    });

    describe('DisplayMode.Read', () => {
        it('should render nothing if properties.showInReadMode is set to false', () => {
            expect(renderedElementRead.find('div').length).to.equal(0);
        });
    });

    describe('DisplayMode.Edit', () => {
        it('should render one multichoice property row', () => {
            renderedElementEdit.setState({
                isLoading: false,
                properties: [multiChoiceProperty],
            });

            expect(renderedElementEdit.update().state('properties').length).to.be.equal(1);
            expect(renderedElementEdit.update().find('.property-row-multichoice').length).to.be.equal(1);
        });


        it('should render two rows', () => {
            renderedElementEdit.setState({
                isLoading: false,
                properties: [textProperty, booleanProperty],
            });

            expect(renderedElementEdit.update().state('properties').length).to.be.equal(2);
            expect(renderedElementEdit.update().find('.property-row').length).to.be.equal(2);
        });


        it('should render three rows', () => {
            renderedElementEdit.setState({
                isLoading: false,
                properties: [textProperty, booleanProperty, choiceProperty],
            });

            expect(renderedElementEdit.update().state('properties').length).to.be.equal(3);
            expect(renderedElementEdit.update().find('.property-row').length).to.be.equal(3);
        });


        it('should render four rows', () => {
            renderedElementEdit.setState({
                isLoading: false,
                properties: [textProperty, booleanProperty, choiceProperty, multiChoiceProperty],
            });

            expect(renderedElementEdit.update().state('properties').length).to.be.equal(4);
            expect(renderedElementEdit.update().find('.property-row').length).to.be.equal(4);
        });


        it('should render four rows', () => {
            renderedElementEdit.setState({
                isLoading: false,
                properties: [textProperty, booleanProperty, choiceProperty, multiChoiceProperty],
            });

            expect(renderedElementEdit.update().state('properties').length).to.be.equal(4);
            expect(renderedElementEdit.update().find('.property-row').length).to.be.equal(4);
        });


        it('should render a input field', () => {
            renderedElementEdit.setState({
                isLoading: false,
                properties: [textProperty],
            });

            const updatedElement = renderedElementEdit.update();
            const inputField = updatedElement.find('.property-row-text input');
            expect(inputField.length).to.be.equal(1);
        });
    });
});