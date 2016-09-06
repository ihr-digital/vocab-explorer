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


    new Tree('treeView');
    setUpTangle();
});

function setUpTangle () {
	var element = document.getElementById("skosConceptMain");

	var tangle = new Tangle(element, {
		initialize: function () {
			this.concept = 'Religion and faith';
			this.uriFragment = 'http://www.tobias.org';
			this.ident = 100;
		},
		update: function () {
			this.conceptDisplay = this.concept;
			this.uriFragmentDisplay = this.uriFragment;
			this.uriFragmentForURIDisplay = cleanText(this.concept);
			this.identDisplay = this.ident;
		}
	});
}

/* Function to transform plain text for the URI.
 * Removes punctuation, lowercase characters, transform space to underscore.
 */
function cleanText(txt) {
	newTxt = txt.replace(/ /g, '_').replace(/[.,\/#!$%\^&\*;:{}=\-'`~()]/g,"").toLowerCase();
	return newTxt;
}