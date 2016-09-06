//
// Tobias Tangle classes
//
(function () {

//----------------------------------------------------------
//
//  TBTextField
//
// An input box where the value types is reflected somewhere else.
// Similar to the TKNumberField
//
// Attributes:  data-size (optional): width of the box in characters

Tangle.classes.TBTextField = {

    initialize: function (element, options, tangle, variable) {
        this.input = new Element("input", {
    		type: "text",
    		"class":"TBTextFieldInput",
    		size: options.size || 6
        }).inject(element, "top");

        var inputChanged = (function () {
            var value = this.getValue();
            tangle.setValue(variable, value);
        }).bind(this);

        this.input.addEvent("keyup",  inputChanged);
        this.input.addEvent("blur",   inputChanged);
        this.input.addEvent("change", inputChanged);
	},

	getValue: function () {
        var value = this.input.get("value");  // TODO: sanitise string value?
        return value;
	},

	update: function (element, value) {
	    var currentValue = this.getValue();
	    if (value !== currentValue) { this.input.set("value", "" + value); }
	}
};
//----------------------------------------------------------

})();


// Tangle Setup and other functions.
function setUpTangle () {
    var element = document.getElementById("skosConceptMain");

    var tangle = new Tangle(element, {
        initialize: function () {
            this.concept = 'Religion and faith';
            this.uriFragment = 'http://www.tobias.org';
            this.ident = 100;
        },
        update: function () {
            this.conceptDisplay = this.concept;
            this.uriFragmentDisplay = this.uriFragment;
            this.uriFragmentForURIDisplay = cleanText(this.concept);
            this.identDisplay = this.ident;
        }
    });
}


// Function to transform plain text for the URI.
// Removes punctuation, lowercase characters, transform space to underscore.
function cleanText(txt) {
    newTxt = txt.replace(/ /g, '_').replace(/[.,\/#!$%\^&\*;:{}=\-'`~()]/g,"").toLowerCase();
    return newTxt;
}


// Initialise Tobias Tangle
window.addEvent('domready', function(){
    setUpTangle();
});
