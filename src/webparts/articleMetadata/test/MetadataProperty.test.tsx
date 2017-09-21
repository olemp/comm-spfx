/// <reference types='mocha' />
/// <reference types='sinon' />

import * as React from 'react';
import { assert, expect } from 'chai';
import { mount } from 'enzyme';
import { DisplayMode } from '@microsoft/sp-core-library';

import { ArticleMetadataProperty } from '../components/ArticleMetadata';
import MetadataProperty from '../components/MetadataProperty';

declare const sinon;

describe('<MetadataProperty />', () => {
    let renderedElementRead;
    let renderedElementEdit;
    let dummyPageListItem;
    let textProperty: ArticleMetadataProperty;
    let booleanProperty: ArticleMetadataProperty;
    let multiChoiceProperty: ArticleMetadataProperty;
    let choiceProperty: ArticleMetadataProperty;

    before(() => {
        dummyPageListItem = {
            MultiChoice: ["London"],
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
        multiChoiceProperty = new ArticleMetadataProperty({ InternalName: "MultiChoice", Title: "Flervalg", Choices: ["London", "Paris", "Oslo"], TypeAsString: "MultiChoice" }, dummyPageListItem);
        choiceProperty = new ArticleMetadataProperty({ InternalName: "Choice", Title: "Valg", Choices: ["London"], TypeAsString: "Choice" }, dummyPageListItem);
        renderedElementRead = mount(<MetadataProperty
            className="property-row"
            prop={multiChoiceProperty}
            displayMode={DisplayMode.Read}
            onChange={() => { }}
            labelSize={"ms-font-xxl"}
            valueSize={"ms-font-m"}
            padding={10} />);
        renderedElementEdit = mount(<MetadataProperty
            className="property-row"
            prop={multiChoiceProperty}
            displayMode={DisplayMode.Edit}
            onChange={() => { }}
            labelSize={"ms-font-xxl"}
            valueSize={"ms-font-m"}
            padding={10} />);
    });

    after(() => {
        // after
    });

    describe('DisplayMode.Read', () => {
        it('should render a <div /> with class .property-row', () => {
            expect(renderedElementRead.find(".property-row").length).to.equal(1);
        });

        it('should render a <div /> with class .property-row-label', () => {
            expect(renderedElementRead.find("div.property-row-label").length).to.equal(1);
        });

        it('should render a <div /> with class .property-row-value', () => {
            expect(renderedElementRead.find("div.property-row-value").length).to.equal(1);
        });

        it('should render a label with the correct font size and text', () => {
            let labelElement = renderedElementRead.find("div.property-row-label.ms-font-xxl");
            expect(labelElement.length).to.equal(1);
        });

        it('should render a value with the correct font size and text', () => {
            let valueElement = renderedElementRead.find("div.property-row-value.ms-font-m");
            expect(valueElement.length).to.equal(1);
        });
    });

    describe('DisplayMode.Edit', () => {
        it('should render a <div /> with class .property-row', () => {
            expect(renderedElementEdit.find(".property-row").length).to.equal(1);
        });

        it('should render a <div /> with class .property-row-label', () => {
            expect(renderedElementEdit.find("div.property-row-label").length).to.equal(1);
        });

        it('should render a <div /> with class .property-row-value', () => {
            expect(renderedElementEdit.find("div.property-row-value").length).to.equal(1);
        });

        it('should render a label with the correct font size', () => {
            let labelElement = renderedElementEdit.find("div.property-row-label.ms-font-xxl");
            expect(labelElement.length).to.equal(1);
        });

        it('should render a value with the correct font size', () => {
            let valueElement = renderedElementEdit.find("div.property-row-value.ms-font-m");
            expect(valueElement.length).to.equal(1);
        });
    });

    describe('MultiChoice', () => {
        before(() => {
            renderedElementRead = mount(<MetadataProperty
                className="property-row"
                prop={multiChoiceProperty}
                displayMode={DisplayMode.Read}
                onChange={() => { }}
                labelSize={"ms-font-xxl"}
                valueSize={"ms-font-m"}
                padding={10} />);
            renderedElementEdit = mount(<MetadataProperty
                className="property-row"
                prop={multiChoiceProperty}
                displayMode={DisplayMode.Edit}
                onChange={() => { }}
                labelSize={"ms-font-xxl"}
                valueSize={"ms-font-m"}
                padding={10} />);
        });

        describe('DisplayMode.Read', () => {
            it('should render a <div /> with class .property-row-multichoice', () => {
                expect(renderedElementRead.find(".property-row-multichoice").length).to.equal(1);
            });

            it('should render a <ul />', () => {
                expect(renderedElementRead.find("div.property-row-value ul").length).to.equal(1);
            });
        });

        describe('DisplayMode.Edit', () => {
            it('should render a <div /> with class .property-row-multichoice', () => {
                expect(renderedElementEdit.find(".property-row-multichoice").length).to.equal(1);
            });
        });
    });

    describe('Choice', () => {
        before(() => {
            renderedElementRead = mount(<MetadataProperty
                className="property-row"
                prop={choiceProperty}
                displayMode={DisplayMode.Read}
                onChange={() => { }}
                labelSize={"ms-font-xxl"}
                valueSize={"ms-font-m"}
                padding={10} />);
            renderedElementEdit = mount(<MetadataProperty
                className="property-row"
                prop={choiceProperty}
                displayMode={DisplayMode.Edit}
                onChange={() => { }}
                labelSize={"ms-font-xxl"}
                valueSize={"ms-font-m"}
                padding={10} />);
        });

        describe('DisplayMode.Read', () => {
            it('should render a <div /> with class .property-row-choice', () => {
                expect(renderedElementRead.find(".property-row-choice").length).to.equal(1);
            });
        });

        describe('DisplayMode.Edit', () => {
            it('should render a <div /> with class .property-row-choice', () => {
                expect(renderedElementEdit.find(".property-row-choice").length).to.equal(1);
            });
        });
    });

    describe('Text', () => {
        before(() => {
            renderedElementRead = mount(<MetadataProperty
                className="property-row"
                prop={textProperty}
                displayMode={DisplayMode.Read}
                onChange={() => { }}
                labelSize={"ms-font-xxl"}
                valueSize={"ms-font-m"}
                padding={10} />);
            renderedElementEdit = mount(<MetadataProperty
                className="property-row"
                prop={textProperty}
                displayMode={DisplayMode.Edit}
                onChange={() => { }}
                labelSize={"ms-font-xxl"}
                valueSize={"ms-font-m"}
                padding={10} />);
        });

        describe('DisplayMode.Read', () => {
            it('should render a <div /> with class .property-row-text', () => {
                expect(renderedElementRead.find(".property-row-text").length).to.equal(1);
            });
        });

        describe('DisplayMode.Edit', () => {
            it('should render a <div /> with class .property-row-text', () => {
                expect(renderedElementEdit.find(".property-row-text").length).to.equal(1);
            });
        });
    });

    describe('Boolean', () => {
        before(() => {
            renderedElementRead = mount(<MetadataProperty
                className="property-row"
                prop={booleanProperty}
                displayMode={DisplayMode.Read}
                onChange={() => { }}
                labelSize={"ms-font-xxl"}
                valueSize={"ms-font-m"}
                padding={10} />);
            renderedElementEdit = mount(<MetadataProperty
                className="property-row"
                prop={booleanProperty}
                displayMode={DisplayMode.Edit}
                onChange={() => { }}
                labelSize={"ms-font-xxl"}
                valueSize={"ms-font-m"}
                padding={10} />);
        });

        describe('DisplayMode.Read', () => {
            it('should render a <div /> with class .property-row-boolean', () => {
                expect(renderedElementRead.find(".property-row-boolean").length).to.equal(1);
            });
        });

        describe('DisplayMode.Edit', () => {
            it('should render a <div /> with class .property-row-boolean', () => {
                expect(renderedElementEdit.find(".property-row-boolean").length).to.equal(1);
            });
        });
    });
});