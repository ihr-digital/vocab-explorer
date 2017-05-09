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
    .on('model.jstree', function (e, data) {
      // TODO: look into $.deferred to make this hash generation happen async.
      console.log('model.jstree event');
      modelData = data;
      console.log(data.instance.get_node(data.nodes[0]));

      // Iterate all the node data (because the dom objects aren't all visible)
      // and build a reverse hash table for each of the synonymns. This allows
      // the contextual menus to hyperlink back and forth in the tree.
      // $(data.nodes).each(function(index, element) {
      //   console.log('Processing ' + index);
      //   // console.log(data.instance.get_node(element).text);
      // });

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
      // "search": {
      //       "case_insensitive": true,
      //       "show_only_matches" : true,
      // },
      // Customise some node types and persist opened state
      'plugins' : [ 'types', 'state' ]//, 'search' ],
    });


    // Setup toggle synonymns function for button click
    $('#toggleSyns').click(function() {
      $(synSelector).toggle();
      synVisible = !synVisible;
    });
    // .keypress(function(event) {
    //   console.log(event);
    //   if (event.charCode == 116)  { // Key press 't'
    //     $(synSelector).toggle();
    //     synVisible = !synVisible;
    //   }
    // });
    // Setup the jQuery synonymn tooltips on the tree's spans.
    $(treeSelector).on('mouseenter', synSelector, function (event) {
        $(this).qtip({
            overwrite: false, // Don't overwrite tooltips already bound
            show: {
                event: 'click', //event.type, // Use the same event type as above
                solo: true,
                // ready: true, // Show immediately - important!
                effect: function() {
                  $(this).slideDown(200);
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
              fixed: true,
              delay: 300,
            },
            // style: {
            //   classes: 'qtip-light qtip-shadow',
            //   tip: {
            //       corner: 'left centre'
            //   }
            // },
        });
    });

    // Keep the Toggle synonymns paragraph/button on screen as you scroll down.
    var $window = $(window),
        $sticky = $('#toggleSynsPara'),
        stickyTop = $sticky.offset().top;
    $window.scroll(function() {
      $sticky.toggleClass('sticky', $window.scrollTop() + 10 > stickyTop);
    });

    // // Bind the search box keystrokes to the jstree search
    // var tOut = false;
    // $(".search-input").keyup(function() {
    //   var searchString = $(this).val();
    //   console.log(searchString);
    //   if(tOut) {
    //     clearTimeout(tOut);
    //   }
    //   tOut = setTimeout(function() {
    //     $(treeSelector).jstree(true).search(searchString);
    //   }, 250);
    // });

});



//----------------------------------------------------------
//
// Function to generate the tooltip title depending on the
// class of the object.
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
// Function to generate the tooltip content - lookup list of
// related synonymns.
//
function getTooltipContent (obj) {
  synText = $(obj).text();

  if ($(obj).hasClass('usedFor-multi') ||
      $(obj).hasClass('usedFor-multi-factor') ||
      $(obj).hasClass('relatedTerm')) {

    // Search the tree for other terms with this synonymn
    tipContent = '<ul>';
    nodes = $(treeSelector).find('span')
    .filter(function() {
      return $(this).text() == synText;
    })
    .prevAll('span.term')
    .each(function(i, selected){
      tipContent += '<li><a href="http://drupalvm.history.ac.uk/vocab-explorer/index-skos.html" >' + $(selected).text() + '</a></li>';
    });

    // console.log(synText);
    tipContent += '</ul>';
    return tipContent;
  }

  // usedFor terms return their parent term.
  $term = $(obj).prevAll('.term');

  return '"' + $(obj).prevAll('.term').text() + '" is the preferred term.';  // No title
}