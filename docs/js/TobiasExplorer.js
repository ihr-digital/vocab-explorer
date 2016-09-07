/*
 * BBIH Vocabulary as a HTML tree view
 * TOBIAS Project, IHR Digital, 2016-07
 */
window.addEvent('domready', function(){
    var synSelector = '.usedFor, .relatedTerm, .usedFor-multi';
    $(synSelector).hide();

    // Setup toggle click function
    $('#toggleSyns').click(function() {
        $(synSelector).toggle();
    });

    $('#jsTree1').jstree();

    // $.jstree.defaults.core.themes.variant = "large";
    $('#jsTree2').jstree({
    "types" : {
      "default" : {
        "icon" : ""
      },
      "usedFor" : {
        "icon" : "glyphicon glyphicon-ok"
      }
    },
    "plugins" : [ "types" ]
  });
});
