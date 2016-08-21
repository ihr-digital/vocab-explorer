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