/*
 * BBIH Vocabulary as a HTML tree view
 * TOBIAS Project, IHR Digital, 2017-05
 */

// The synonymn span selector and state variable for visibility
var synSelector = '.usedFor, .relatedTerm, .usedFor-multi';
var synVisible = false;

window.addEvent('domready', function(){
    // Initialise the tree and setup handlers
    // $.jstree.defaults.core.themes.variant = "large";
    $('#tobias-jsTree')
    // Listen for events
    // As nodes are opened, obey the synonymn visibility state
    .on('before_open.jstree', function (e, data) {
      // console.log(data);
      if (synVisible == false) {
        $(this).find(synSelector).hide();
      } else {
        $(this).find(synSelector).show();
      }
    })
    // When nodes are selected, populate the SKOSConceptMain code box
    .on('select_node.jstree', function (e, data) {
      console.log('select node', $(data.selected));
      // console.log(data);
    })
    // Create/init the tree
    .jstree({
      'core': {
        'data' : {
          'url' : 'data/bbih-vocabulary-sample.html',  // Get the tree list from here.
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
      // Customise some types of nodes for icons
      // Keep the opened/selected state of the tree
      'plugins' : [ 'types', 'state' ],
    });

    // Keep the SKOS markup box on screen as you scroll down.
    var $window = $(window),
        $sticky = $('#skosConceptMain'),
        stickyTop = $sticky.offset().top;
    $window.scroll(function() {
      $sticky.toggleClass('sticky', $window.scrollTop() > stickyTop);
    });

    // Setup toggle synonymns function for button click and keypress
    $('#toggleSyns').click(function() {
      console.log(synVisible);
      $(synSelector).toggle();
      synVisible = !synVisible;
    });
    $(document).keypress(function(event) {
      if (event.keyCode == 116)  { // Key press 't'
        console.log(synVisible);
        $(synSelector).toggle();
        synVisible = !synVisible;
      }
    });

});
