/// <reference types="mocha" />
/// <reference types="sinon" />

import * as React from 'react';
import { assert, expect } from 'chai';
import { mount } from 'enzyme';
import { DisplayMode } from '@microsoft/sp-core-library';
import pnp from 'sp-pnp-js';

import ArticleMetadata from '../components/ArticleMetadata';

declare const sinon;

describe('ArticleMetadata in Read Mode', () => {
    let componentDidMountSpy;
    let fetchPropertiesSpy;
    let renderedElement;

    // Props for ArticleMetadata
    let list = pnp.sp.web.lists.getById("caf15ef9-de66-45a4-87ed-bea9dbe54ddd");
    let pageItem = list.items.getById(9);

    before(() => {
        componentDidMountSpy = sinon.spy(ArticleMetadata.prototype, 'componentDidMount');
        fetchPropertiesSpy = sinon.spy(ArticleMetadata.prototype, 'fetchProperties');
        renderedElement = mount(<ArticleMetadata
            list={list}
            pageItem={pageItem}
            displayMode={DisplayMode.Read}
            supportedFieldTypes={["text", "choice", "boolean"]} />);
    });

    after(() => {
        componentDidMountSpy.restore();
        fetchPropertiesSpy.restore();
    });

    it('<ArticleMetadata /> should call componentDidMount only once', () => {
        // Check if the componentDidMount is called once
        expect(componentDidMountSpy.calledOnce).to.equal(true);
    });

    it('<ArticleMetadata /> should call fetchProperties only once', () => {
        // Check if the fetchProperties is called once
        expect(fetchPropertiesSpy.calledOnce).to.equal(true);
    });

    it('<ArticleMetadata /> should render nothing when showInReadMode = false', () => {
        // Check if nothing is rendered (no <div /> in dom)
        expect(renderedElement.find('div').length).to.equal(0);
    });
});