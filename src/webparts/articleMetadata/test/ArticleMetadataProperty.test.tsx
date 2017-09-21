/// <reference types='mocha' />
/// <reference types='sinon' />

import * as React from 'react';
import { assert, expect } from 'chai';

import { ArticleMetadataProperty, FieldValueType } from '../components/ArticleMetadata';

declare const sinon;

describe('ArticleMetadataProperty', () => {
    let dummyPageListItem;
    let textProperty: ArticleMetadataProperty;
    let booleanProperty: ArticleMetadataProperty;
    let choiceProperty: ArticleMetadataProperty;
    let multiChoiceProperty: ArticleMetadataProperty;

    before(() => {
        dummyPageListItem = {
            MultiChoice: [],
            Choice: "London",
            TextField: "Oslo",
            BooleanField: false,
            FieldValuesAsHtml: {
                MultiChoice: "",
                Choice: "London",
                TextField: "Oslo (html)",
                BooleanField: "",
            },
            FieldValuesAsText: {
                MultiChoice: "",
                Choice: "London",
                TextField: "Oslo (text)",
                BooleanField: "",
            },
        };
        textProperty = new ArticleMetadataProperty({ InternalName: "TextField", Title: "Tekst", TypeAsString: "Text" }, dummyPageListItem);
        booleanProperty = new ArticleMetadataProperty({ InternalName: "BooleanField", Title: "Ja/nei", TypeAsString: "Boolean" }, dummyPageListItem);
        choiceProperty = new ArticleMetadataProperty({ InternalName: "Choice", Title: "Valg", Choices: ["London"], TypeAsString: "Choice" }, dummyPageListItem);
        multiChoiceProperty = new ArticleMetadataProperty({ InternalName: "MultiChoice", Title: "Flervalg", Choices: ["London"], TypeAsString: "MultiChoice" }, dummyPageListItem);
    });

    after(() => {
        // after
    });

    describe('Text', () => {
        it('should parse value correctly', () => {
            expect(textProperty.fieldType).to.equal("text");
            expect(textProperty.title).to.equal("Tekst");
            expect(textProperty.getValue<string>()).to.equal("Oslo");
        });

        it('should retrieve html value', () => {
            expect(textProperty.getValue<string>(FieldValueType.Html)).to.equal("Oslo (html)");
        });

        it('should retrieve text value', () => {
            expect(textProperty.getValue<string>(FieldValueType.Text)).to.equal("Oslo (text)");
        });

        it('should retrieve valid update value', () => {
            const valueForUpdate = textProperty.getValueForUpdate();
            expect(valueForUpdate).to.equal("Oslo");
        });

        it('should be able to set a new value and retrieve it', () => {
            textProperty.setValue("Stavanger");
            expect(textProperty.getValue<string>()).to.equal("Stavanger");
        });
    });

    describe('Choice', () => {
        it('should parse value correctly', () => {
            expect(choiceProperty.choices.length).to.equal(1);
            expect(choiceProperty.fieldType).to.equal("choice");
            expect(choiceProperty.title).to.equal("Valg");
            expect(choiceProperty.getValue<string>()).to.equal("London");
        });

        it('should retrieve valid update value', () => {
            const valueForUpdate = choiceProperty.getValueForUpdate();
            expect(valueForUpdate).to.equal("London");
        });

        it('should be able to set a new value and retrieve it', () => {
            choiceProperty.setValue("Stavanger");
            expect(choiceProperty.getValue<string>()).to.equal("Stavanger");
        });
    });

    describe('MultiChoice', () => {
        it('should parse value correctly', () => {
            expect(multiChoiceProperty.choices.length).to.equal(1);
            expect(multiChoiceProperty.fieldType).to.equal("multichoice");
            expect(multiChoiceProperty.title).to.equal("Flervalg");
            expect(multiChoiceProperty.getValue<string[]>().length).to.equal(0);
        });

        it('should retrieve valid update value', () => {
            const valueForUpdate = multiChoiceProperty.getValueForUpdate();
            expect(valueForUpdate.hasOwnProperty("__metadata")).to.equal(true);
            expect(valueForUpdate.hasOwnProperty("results")).to.equal(true);
            expect(valueForUpdate.results.length).to.equal(0);
        });

        it('should be able to set a new value and retrieve it', () => {
            multiChoiceProperty.setValue(["London"]);
            expect(multiChoiceProperty.getValue<string[]>().length).to.equal(1);
            expect(multiChoiceProperty.getValue<string[]>()[0]).to.equal("London");
        });

        it('should be able to set a new value and retrieve a valid update value', () => {
            multiChoiceProperty.setValue(["London"]);
            const valueForUpdate = multiChoiceProperty.getValueForUpdate();
            expect(valueForUpdate.hasOwnProperty("__metadata")).to.equal(true);
            expect(valueForUpdate.hasOwnProperty("results")).to.equal(true);
            expect(valueForUpdate.results.length).to.equal(1);
            expect(valueForUpdate.results[0]).to.equal("London");
        });
    });

    describe('Boolean', () => {
        it('should parse value correctly', () => {
            expect(booleanProperty.fieldType).to.equal("boolean");
            expect(booleanProperty.title).to.equal("Ja/nei");
            expect(booleanProperty.getValue<boolean>()).to.equal(false);
        });

        it('should retrieve valid update value', () => {
            const valueForUpdate = booleanProperty.getValueForUpdate();
            expect(valueForUpdate).to.equal(false);
        });

        it('should be able to set a new value and retrieve it', () => {
            booleanProperty.setValue(true);
            expect(booleanProperty.getValue<boolean>()).to.equal(true);
        });
    });
});