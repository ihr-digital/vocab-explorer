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
        // $(this).find(synSelector).hide();
      } else {
        // $(this).find(synSelector).show();
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

});

