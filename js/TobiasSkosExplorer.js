/**
 * BBIH Vocabulary as a HTML jsTree view
 * TOBIAS Project, IHR Digital, 2017-05
 */

// The synonymn span selector and state variable for visibility
var synSelector = '.usedFor, .relatedTerm, .usedFor-multi, .usedFor-multi-factor';
var synVisible = false;

$( document ).ready(function(){
    // Initialise the tree and setup handlers
    $('#tobias-jsTree')
    // As nodes are opened, obey global synonymn visibility state
    .on('before_open.jstree', function (e, data) {
      if (synVisible == false) {
        $(this).find(synSelector).hide();
      } else {
        $(this).find(synSelector).show();
      }
    })
    // When nodes are selected, trigger event of the same name on #SKOSConceptMain
    .on('select_node.jstree', function (e, data) {
      $('#skosConceptMain').trigger('select_node.jstree', [ data ]);
    })
    // Create/init the tree
    .jstree({
      'core': {
        'data' : {
          'url' : 'data/bbih-vocabulary.html',  // Get the tree data from here.
        },
        'multiple' : false,  // Single selection only.
        'themes': {
          'name': 'proton',  // Awesome oss theme!
          'responsive': true,
          'icons' : false,
        },
      },
      'types' : {
        'default' : {
          'icon' : '',
        },
        'usedFor' : {
          'icon' : 'glyphicon glyphicon-ok',
        },
      },
      // Customise some node types and persist opened state
      'plugins' : [ 'types', 'state' ],
    });


    // Bind jstree event of the same name. Events are triggered from
    // the tree and we get the same event/data params.
    $('#skosConceptMain').on('select_node.jstree', function (e, data) {
      $selectedNode = $(data.instance.get_node(data.selected, true));

      // Select the values out of the node and put into the tangle object.
      skosTangle.setValue('concept', $selectedNode.find('span.term:first').text());
    });


    // Resize the SKOS code box when mouse hovers over it.
    codeBoxDefaultWidth = $('#skosConceptMain pre.xml').width();
    $('#skosConceptMain pre.xml').on('mouseenter', function(){
      w = $(this).find('code').width() + 15;
      $(this).animate({ width: w });
    })
    .on('mouseleave', function(){
      $(this).animate({ width: codeBoxDefaultWidth });
    });

});


//
// Tobias Tangle classes
//
// Keep global page reference to the tangle object
var skosTangle = null;

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
    return tangle;
}


// Function to transform plain text for the URI.
// Removes punctuation, lowercase characters, transform space to underscore.
function cleanText(txt) {
    newTxt = txt.replace(/ /g, '_').replace(/[.,\/#!$%\^&\*;:{}=\-'`~()]/g,"").toLowerCase();
    return newTxt;
}


// Initialise and keep reference to the Tobias SKOS Tangle
window.addEvent('domready', function(){
    skosTangle = setUpTangle();
});

