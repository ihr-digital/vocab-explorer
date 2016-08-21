/*
 * BBIH Vocabulary as a HTML tree view
 * TOBIAS Project, IHR Digital, 2016-07
 */
window.addEvent('domready', function(){
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