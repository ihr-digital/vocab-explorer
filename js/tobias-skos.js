/**
 * BBIH Vocabulary as a HTML jsTree view
 * (with SKOS snippet)
 * TOBIAS Project, IHR Digital, 2017-05
 */

// The tree and synonymn span selectors, a state variable for initial
// visibility of synonymns, and the reverse lookup synonymn dictionary.
var synSelector = '.usedFor, .relatedTerm, .usedFor-multi, .usedFor-multi-factor';
var treeSelector = '#tobias-jsTree';
var synVisible = false;


$( document ).ready(function(){
    // Initialise the tree and setup handlers
    $(treeSelector)
    // When tree is ready and when nodes are opened obey synonymn visibility state
    .on('ready.jstree before_open.jstree', function (e, data) {
      if (synVisible == false) {
        $(this).find(synSelector).hide();
      } else {
        $(this).find(synSelector).show();
      }
    })
    // When nodes are selected, trigger tangle on the #sticky-header
    .on('select_node.jstree', function (e, data) {
      $('#sticky-header').trigger('select_node.jstree', [ data ]);
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
      'state' : {
        'ttl' : 86400000,  // 1 day in milliseconds
      },
      // Customise some node types and persist opened state
      'plugins' : [ 'types', 'state' ],
    });


    // Bind jstree event of the same name. Events are triggered from
    // the tree and we get the same event/data params.
    $('#sticky-header').on('select_node.jstree', function (e, data) {
      $selectedNode = $(data.instance.get_node(data.selected, true));

      // Select the values out of the node and put into the tangle object.
      skosTangle.setValue('concept', $selectedNode.find('span.term:first').text());
      skosTangle.setValue('ident', $selectedNode.find('span.term:first').data('rhs-id'));
    });

    // Keep the sticky-header on screen as you scroll down.
    var $window = $(window),
    $sticky = $('#sticky-header'),
    stickyTop = $sticky.offset().top;
      $window.scroll(function() {
        $sticky.toggleClass('sticky', $window.scrollTop() + 10 > stickyTop);
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
        var value = this.input.get("value");
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
    var element = document.getElementById("sticky-header");

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

