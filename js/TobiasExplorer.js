/*
 * BBIH Vocabulary as a HTML tree view
 * TOBIAS Project, IHR Digital, 2017-05
 */

// The synonymn span selector and state variable for visibility
var synSelector = '.usedFor, .relatedTerm, .usedFor-multi';
var synVisible = false;

window.addEvent('domready', function(){
    // Initialise the tree and setup handlers
    $('#tobias-jsTree')
    // As nodes are opened, obey the synonymn visibility state
    // for the entire tree
    .on('before_open.jstree', function (e, data) {
      if (synVisible == false) {
        $(this).find(synSelector).hide();
      } else {
        $(this).find(synSelector).show();
      }

      // Add special multiline class to items with synonymns
      // .jstree-anchor-multiline
      // DO THIS TOMORROW...

    })
    // When nodes are selected, trigger event of the same name on #SKOSConceptMain
    .on('select_node.jstree', function (e, data) {
      $('#skosConceptMain').trigger('select_node.jstree', [ data ]);
    })
    // Create/init the tree
    .jstree({
      'core': {
        'data' : {
          'url' : 'data/bbih-vocabulary-sample.html',  // Get the tree list from here.
        },
        'multiple' : false,  // Single selections only.
      },
      'types' : {
        'default' : {
          'icon' : '',
        },
        'usedFor' : {
          'icon' : 'glyphicon glyphicon-ok',
        },
      },
      // Customise some types of nodes for icons and keep opened state
      'plugins' : [ 'types', 'state' ],
    });


    // Bind jstree event of the same name. Events are triggered from
    // the tree and we get the same event/data params.
    $('#skosConceptMain').on('select_node.jstree', function (e, data) {
      $selectedNode = $(data.instance.get_node(data.selected, true));

      // Select the values out of the node and put into the tangle object.
      skosTangle.setValue('concept', $selectedNode.find('span.term:first').text());

      console.log($selectedNode.html());
      

    });


    // Resize the SKOS code box when mouse hovers over it.
    codeBoxDefaultWidth = $('#skosConceptMain').width();
    $('#skosConceptMain').on('mouseenter', function(){
      w = $(this).find('code').width() - $(this).width() + 35;
      $(this).animate({ width: "+=" + w });
    })
    .on('mouseleave', function(){
      $(this).animate({ width: codeBoxDefaultWidth });
    })
    // Bind click/select all code behaviour for easy copy/paste
    .on('click', function() {
      $(this).find('code');
    });

    // Setup toggle synonymns function for button click
    $('#toggleSyns').click(function() {
      $(synSelector).toggle();
      synVisible = !synVisible;
    });
    // Event bubbling when typing into the tangle causes the syns to appear.
    // Also, typing 't' causes tree node selection behaviour, so disabling keypress for now.
    // $(document).keypress(function(event) {
    //   console.log(event);
    //   if (event.charCode == 116)  { // Key press 't'
    //     $(synSelector).toggle();
    //     synVisible = !synVisible;
    //   }
    // });

    // 


});
