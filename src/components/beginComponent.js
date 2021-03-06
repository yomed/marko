'use strict';

const ComponentDef = require('./ComponentDef');
const hasRenderBodyKey = Symbol.for("hasRenderBody");

var FLAG_WILL_RERENDER_IN_BROWSER = 1;
// var FLAG_HAS_BODY_EL = 2;
// var FLAG_HAS_HEAD_EL = 4;

function isInputSerializable(component) {
    var input = component.___input;
    
    if (!input) {
        return true;
    }

    if (input[hasRenderBodyKey] === true || input.renderBody !== undefined) {
        return false;
    } else {
        return true;
    }
}

module.exports = function beginComponent(componentsContext, component, isSplitComponent, parentComponentDef) {
    var globalContext = componentsContext.___globalContext;

    var componentId = component.id;

    var componentDef = componentsContext.___componentDef = new ComponentDef(component, componentId, globalContext);

    // On the server
    if (parentComponentDef && (parentComponentDef.___flags & FLAG_WILL_RERENDER_IN_BROWSER)) {
        componentDef.___flags |= FLAG_WILL_RERENDER_IN_BROWSER;
        return componentDef;
    }

    componentsContext.___components.push(componentDef);

    let out = componentsContext.___out;

    componentDef.___renderBoundary = true;

    if (isSplitComponent === false &&
        out.global.noBrowserRerender !== true &&
        isInputSerializable(component)) {
        componentDef.___flags |= FLAG_WILL_RERENDER_IN_BROWSER;
        out.w('<!--M#' + componentId + '-->');
    } else {
        out.w('<!--M^' + componentId + '-->');
    }

    return componentDef;
};
