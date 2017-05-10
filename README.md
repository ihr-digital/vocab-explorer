# BBIH Vocabulary as HTML and SKOS with a web UI explorer for both

## TOBIAS Project
### IHR Digital, 2016-07

The SKOS explorer is all strung together from a lot of little opensource bits and pieces, and hosted on [github pages here](http://drupalvm.history.ac.uk/vocab-explorer/index.html)

The `/data` directory contains the BBIH Vocabulary data and some transformation scripts to convert the source data into SKOS and a HTML list. The HTML list is dynamically loaded into the Vocabulary and SKOS explorer webpage and rendered as a usable/navigable tree using the excellent [JSTree jquery plugin](https://www.jstree.com/). The SKOS explorer page is themed by a slightly customised css taken from the Github pages [minimal theme](https://github.com/pages-themes/minimal) and the JSTree is themed using the [jsTree Bootstrap Theme](https://github.com/orangehill/jstree-bootstrap-theme). The Generated skos:Concept text fields and code block are dynamically updated using Brett Victor's [Tangle.js](http://worrydream.com/Tangle/).


