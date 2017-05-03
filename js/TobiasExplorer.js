/*
 * BBIH Vocabulary as a HTML tree view
 * TOBIAS Project, IHR Digital, 2017-05
 */
window.addEvent('domready', function(){
    var synSelector = '.usedFor, .relatedTerm, .usedFor-multi';
    $(synSelector).hide();

    // Setup toggle function for button click and keypress
    $('#toggleSyns').click(function() {
        $(synSelector).toggle();
    });
    $(document).keypress(function(event) {
      if (event.keyCode == 116)  // Key press 't'
        $(synSelector).toggle();
    });

    // Initialise the tree
    // $.jstree.defaults.core.themes.variant = "large";
    $('#tobias-jsTree').jstree({
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
      // Select the whole row
      'plugins' : [ 'types', 'state', 'wholerow' ],
    });
});
