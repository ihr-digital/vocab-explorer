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
      console.log('model');
      console.log(data);
      // event.preventDefault();
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


    // Setup toggle synonymns function for button click
    $('#toggleSyns').click(function() {
      $(synSelector).toggle();
      synVisible = !synVisible;
    });

});


// Setup the jQuery synonymn tooltips.
// Done here after document ready because qtip lazy-loads tooltips
$(document).on('mouseover', synSelector, function(event) {
  $(this).qtip({ // Grab some elements to apply the tooltip to
      content: {
        text: getTooltipContent(this),
        title: getTooltipTitle(this),
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
        effect: function() {
          $(this).slideDown(200);
        }
      },
      hide: {
        fixed: true,
        delay: 300,
      },
      style: {
        classes: 'qtip-light qtip-shadow',
        tip: {
            corner: 'left centre'
        }
      },
    }, event);

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

    console.log(synText);
    tipContent += '</ul>';
    return tipContent;
  }

  // usedFor terms return their parent term.
  $term = $(obj).prevAll('.term');

  return '"' + $(obj).prevAll('.term').text() + '" is the preferred term.';  // No title
}