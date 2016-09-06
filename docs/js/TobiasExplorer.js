/*
 * BBIH Vocabulary as a HTML tree view
 * TOBIAS Project, IHR Digital, 2016-07
 */
window.addEvent('domready', function(){
    // Extend the Mootools Element with show/hide/toggle functions.
	Element.implement({
		//implement show
		show: function() {
			this.setStyle('display','');
		},
		//implement hide
		hide: function() {
			this.setStyle('display','none');
		},
		// implement toggle
		toggle: function() {
			console.log('toggle');
			if (this.getStyle('display') != 'none') {
				this.hide();
			} else {
				this.show();
			}
		}
	});

    var synSelector = '.usedFor, .relatedTerm, .usedFor-multi';
    $$(synSelector).hide();

    // Setup toggle click function
    $$('#toggleSyns').addEvent('click', function(e) {
        $$(synSelector).toggle();
    });


    // new Tree('treeView');
});
