/**
 * BBIH Vocabulary as a HTML jsTree view
 * TOBIAS Project, IHR Digital, 2017-05
 */

// The synonymn span selector and state variable for visibility
var synSelector = '.usedFor, .relatedTerm, .usedFor-multi, .usedFor-multi-factor';
var synVisible = false;

window.addEvent('domready', function(){
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
    .on('ready.jstree', function(e, data) {
      // Add special multiline class to items with synonymns
      // .jstree-anchor-multiline
      // DO THIS TOMORROW...
      console.log('ready');
      console.log($('tobias-jsTree span.term').length);
    })
    // When nodes are selected, trigger event of the same name on #SKOSConceptMain
    .on('select_node.jstree', function (e, data) {
      $('#skosConceptMain').trigger('select_node.jstree', [ data ]);
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
      // 'contextmenu' : {
      //   'select_node' : false,
      //   'show_at_node' : false,
      //   'items' : customMenu,
      // },
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

      // console.log($selectedNode.html());
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

    // Setup toggle synonymns function for button click
    $('#toggleSyns').click(function() {
      $(synSelector).toggle();
      synVisible = !synVisible;
    });

});


// function customMenu(node)
// {
//     var items = {
//         'item1' : {
//             'label' : 'item1',
//             'action' : function () { /* action */ }
//         },
//         'item2' : {
//             'label' : 'item2',
//             'action' : function () { /* action */ }
//         }
//     }
// console.log(node);
//     // if (node.type === 'level_1') {
//     //     delete items.item2;
//     // } else if (node.type === 'level_2') {
//     //     delete items.item1;
//     // }

//     return items;
// }