'use strict';

var union = require('./union');

var TEMPLATE_SYMBOL = '<symbol/>';

var SELECTOR_SVG = 'svg';

var ATTRIBUTE_ID = 'id';
var ATTRIBUTE_VIEWBOX = 'viewBox';
var ATTRIBUTE_ARIA_LABELLED_BY = 'aria-labelledby';
var ATTRIBUTE_ROLE = 'role';

var DEFAULT_ATTRS_TO_COPY = [
	ATTRIBUTE_VIEWBOX,
	ATTRIBUTE_ARIA_LABELLED_BY,
	ATTRIBUTE_ROLE
];


/**
 * Utility for cloning an <svg/> as a <symbol/> within
 * the composition of svgstore output.
 *
 * @param {string} id The id to be applied to the symbol tag
 * @param {string} loadedChild An object created by loading the content of the current file via the cheerio#load function.
 * @param {object} options for parsing the svg content
 * @returns {object} symbol The final cheerio-aware object created by cloning the SVG contents
 * @see <a href="https://github.com/cheeriojs/cheerio">The Cheerio Project</a>
 */
function svgToSymbol(id, loadedChild, options) {
	var svgElem = loadedChild(SELECTOR_SVG);

	// initialize a new <symbol> element
	var symbol = loadedChild(TEMPLATE_SYMBOL);
	symbol.attr(ATTRIBUTE_ID, id);

	copyRootSVGAttributes(options.customSymbolAttrs, symbol, svgElem);

	// Finally, append the contents of the `svgElem` to the symbol
	symbol.append(svgElem.contents());

	return symbol;
}


/**
 *  Make sure the symbol carries over the proper attributes on the original `<svg>`
 */
function copyRootSVGAttributes(customSymbolAttrs, symbol, originalSVG) {
	var customAttrs = Array.isArray(customSymbolAttrs) ? customSymbolAttrs : [];

	var attributesToCopy = union(DEFAULT_ATTRS_TO_COPY, customAttrs);
	var attrName, attrValue;
	for (var i = 0; i < attributesToCopy.length; i++) {
		attrName = attributesToCopy[i];
		attrValue = originalSVG.attr(attrName);

		if (typeof attrValue !== 'undefined' && attrValue !== null) {
			symbol.attr(attrName, attrValue);
		}
	}
}


module.exports = svgToSymbol;
