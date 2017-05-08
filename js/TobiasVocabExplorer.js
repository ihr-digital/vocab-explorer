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
    // .on('hover_node.jstree', function (e, data) {
    //   console.log('hover_node');
    //   // event.preventDefault();
    // })
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


// Setup the jQuery synonymn tooltips.
// Done here to bind events to the document (and avoid the jstree intercepting events)
$(document).on('mouseover', synSelector, function(event) {
  $(this).qtip({ // Grab some elements to apply the tooltip to
      content: {
        text: 'My common piece of text here',
        title: 'title',
      },
      position: {
        my: 'top left',
        at: 'bottom left',
      },
      show: {
        event: 'click',
        solo: true,
        // ready: true,
        delay: 0,
      },
      hide: {
        fixed: true,
        delay: 500,
      },
      style: {
        classes: 'qtip-bootstrap qtip-shadow',
        tip: {
            corner: 'left centre'
        }
      },
    }, event);

});
