/**
 * BBIH Vocabulary as a HTML jsTree view
 * TOBIAS Project, IHR Digital, 2017-05
 */

// The synonymn span selector and state variable for visibility
var synSelector = '.usedFor, .relatedTerm, .usedFor-multi, .usedFor-multi-factor';
var synVisible = true;
var treeSelector = '#tobias-jsTree';


$( document ).ready(function(){
    // Initialise the tree and setup handlers
    $(treeSelector)
    // As nodes are opened, obey global synonymn visibility state
    .on('before_open.jstree', function (e, data) {
      if (synVisible == false) {
        $(this).find(synSelector).hide();
      } else {
        $(this).find(synSelector).show();
      }
    })
    .on('select_node.jstree', function (e, data) {
      
    })
    // Create/init the tree
    .jstree({
      'core': {
        'data' : {
          'url' : 'data/bbih-vocabulary-sample.html',  // Get the tree data from here.
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


    // Setup toggle synonymns function for button click
    $('#toggleSyns').click(function() {
      $(synSelector).toggle();
      synVisible = !synVisible;
    });


    // Setup the jQuery context menu to show/use when interacting with
    // the synonymns
    $.contextMenu({
      selector: ".jstree-node span",
      trigger: 'left',
      build: function($trigger, e) {
            // this callback is executed every time the menu is to be shown
            // its results are destroyed every time the menu is hidden
            // e is the original contextmenu event, containing e.pageX and e.pageY (amongst other data)
            return {
                callback: function(key, options) {
                    var m = "clicked: " + key;
                    window.console && console.log(m);
                },
                items: {
                    "edit": {name: "Edit", icon: "edit"},
                    "cut": {name: "Cut", icon: "cut"},
                    "copy": {name: "Copy", icon: "copy"},
                    "paste": {name: "Paste", icon: "paste"},
                    "delete": {name: "Delete", icon: "delete"},
                    "sep1": "---------",
                    "quit": {name: "Quit", icon: function($element, key, item){ return 'context-menu-icon context-menu-icon-quit'; }}
                }
            };
        }
    });
});

 $(document).on("keydown", ".context-menu-icon",
        function(e){ 
            console.log("key:", e.keyCode);
        }
    );
$(document).on("contextmenu:focus", ".context-menu-item", 
    function(e){ 
        console.log("focus:", this);
        e.stopPropagation();
    }
);