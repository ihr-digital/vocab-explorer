/**
 * BBIH Vocabulary as a HTML jsTree view
 * (with synonymns, context menus and search)
 * TOBIAS Project, IHR Digital, 2017-05
 */

// The tree and synonymn span selectors, a state variable for initial
// visibility of synonymns, and the reverse lookup synonymn dictionary.
var synSelector = '.usedFor, .relatedTerm, .usedFor-multi, .usedFor-multi-factor';
var treeSelector = '#tobias-jsTree';
var synVisible = true;
var synLookup = {};  // The syn reverse lookup dict.


//----------------------------------------------------------
//
// Setup jsTree, tooltips, toggle and search behaviour.
//
$(document).ready(function(){
    // Initialise the tree and setup handlers
    $(treeSelector)
    .on('before_open.jstree', function (e, data) {
      // As nodes are opened, obey global synonymn visibility state
      if (synVisible == false) {
        $(this).find(synSelector).hide();
      } else {
        $(this).find(synSelector).show();
      }
    })
    .on('model.jstree', function (e, data) {
      // Iterate all the node data (because the dom objects aren't all visible)
      // and build a reverse hash table for each of the synonymns. This allows
      // the contextual menus to hyperlink back and forth in the tree.
      // We get the node text, parse it into jquery, and select the spans text.
      data.nodes.forEach(function(i) {
        $('<div/>').html(data.instance.get_node(i).text)
        .find(synSelector).each(function() {
          // Add id to the synLookup dictionary
          var currNids = synLookup[$(this).text()] || [];
          currNids.push(i);
          synLookup[$(this).text()] = currNids;
        });
      });
    })
    .on('activate_node.jstree', function (e, data) {
      var node = data.node;

      // Hide breadcrumb if node is not selected.
      if (!$(treeSelector).jstree(true).is_selected(node)) {
        $('#breadcrumb').html('');
        return;
      }

      // Build the breadcrumb
      var nodeIds = $(treeSelector).jstree(true).get_path(node, false, true);
      var breadcrumb = [];

      nodeIds.forEach(function(id) {
        var n = $(treeSelector).jstree(true).get_node(id).text;
        // Dummy div to perform the .find() from the parsed HTML string.
        var t = $('<div />').append($.parseHTML(n)).find('span.term').text();
        breadcrumb.push('<a data-jstree-id="'+ id +'"" href="javascript:void(0)">'+ t +'</a>');
      });

      $('#breadcrumb').html(breadcrumb.join(' &gt; '));
    })
    // Create/init the tree
    .jstree({
      'core': {
        'data' : {
          'url' : 'data/bbih-vocabulary.html',  // Get the tree data from here.
        },
        'multiple' : false,  // Single selection only.
        'themes': {
          'name': 'proton',  // Awesome oss jsTree theme!
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
        // 'ttl' : 86400000,  // 1 day in milliseconds
        'ttl' : 60000,  // 30 seconds in milliseconds
      },
      // Customise some node types and persist opened state
      'plugins' : [ 'types', 'state', 'search' ],
    });


    // Setup the jQuery synonymn tooltips on the tree's spans.
    $(treeSelector).on('mouseenter', synSelector, function (event) {
        $(this).qtip({
            overwrite: false, // Don't overwrite tooltips already bound
            show: {
                event: 'click', //event.type, // Use the same event type as above
                solo: true,
                // ready: true, // Show immediately - important!
                effect: function() {
                  $(this).slideDown(100);
                }
            },
            content: {
              text: getTooltipContent(this),
              title: getTooltipTitle(this),
            },
            position: {
              my: 'top left',
              at: 'bottom left',
            },
            hide: {
              event: 'click',
              fixed: true,
              inactive: 3000,
            },
            events: {
              render: function(event, api) {
                var elem = api.elements.tip;  // Use 'tip' element
              }
            },
            style: {
              classes: 'qtip-bootstrap qtip-shadow',
            },
        });
    });


    // Setup toggle synonymns function for button click
    $('#toggleSyns').click(function() {
      $(synSelector).toggle();
      synVisible = !synVisible;
    });


    // Bind the search box keystrokes to the jstree search
    // var tOut = false;
    $("#search-input").keyup(function() {
      clearTimeout($.data(this, 'timer'));
      var context = this;  // To pass this into the anon func
      var wait = setTimeout(function() {
        $(treeSelector).jstree(true).search($(context).val(), true);
      }, 1000);
      $(this).data('timer', wait);
    });

    // Keep the sticky-header on screen as you scroll down.
    var $window = $(window),
    $sticky = $('#sticky-header'),
    stickyTop = $sticky.offset().top;
      $window.scroll(function() {
        $sticky.toggleClass('sticky', $window.scrollTop() + 10 > stickyTop);
      });


});


//----------------------------------------------------------
//
// Function to generate the tooltip title
// Title depends on the class of the object.
//
function getTooltipTitle (obj) {
  if ($(obj).hasClass('usedFor-multi')) {
    return 'Use <em>one or more</em> of these terms:';

  } else if ($(obj).hasClass('usedFor-multi-factor')) {
    return 'Use <strong>ALL</strong> of these terms:';

  } else if ($(obj).hasClass('relatedTerm')) {
    return 'Consider these additional terms:';
  }

  return null;  // No title
}


//----------------------------------------------------------
//
// Function to generate the tooltip content
// Lookup list of related synonymns.
//
var synNode = null;
function getTooltipContent (obj) {
  var synText = $(obj).text();
  synNode = $(obj).closest('li.jstree-node');

  // Specific classes get syn list.
  if ($(obj).hasClass('usedFor-multi') ||
      $(obj).hasClass('usedFor-multi-factor') ||
      $(obj).hasClass('relatedTerm')) {

    // Search the tree for other terms with this synonymn
    var nodeIds = synLookup[synText] || [];  // Default empty array
    var nodes = {};
    nodeIds.forEach(function(id) {
      var n = $(treeSelector).jstree(true).get_node(id).text;
      // Dummy div to perform the .find() from the parsed HTML string.
      var t = $('<div />').append($.parseHTML(n)).find('span.term').text();
      nodes[id] = t;  // id: term name
    });

    // Sort the related nodes alphabetically
    // TODO: sort it.

    // Generate list from nodes dict
    tipContent = '<ul>';
    for(var index in nodes) {
      if (index == $(synNode).attr('id')) {
        // If node is the current node, display without link.
        tipContent += '<li><em>'+ nodes[index] +'</em></li>';
      } else {
        tipContent += '<li><a data-jstree-id="'+ index +'"" href="javascript:void(0)" >'+ nodes[index] +'</a></li>';
      }
    };
    tipContent += '</ul>';

    return tipContent;
  }

  // .usedFor terms simply return their parent term.
  return '"<em>' + $(obj).prevAll('.term').text() + '</em>" is the preferred term.';
}


//----------------------------------------------------------
//
// Dynamically attach click handler to the tooltip hyperlinks
// to smooth scroll to the jsTree node.
// (the hyperlink stores the data-jstree-id attribute)
//
$(document).on('click',  'a[data-jstree-id]', function() {
  $(treeSelector).jstree(true).activate_node($(this).data('jstree-id'))
  var nid = '#' + $(this).data('jstree-id');

  $('html, body').animate({
    scrollTop: $(nid).offset().top - 200
  }, 500);  // 0.5sec animation
});