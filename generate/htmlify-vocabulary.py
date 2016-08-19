import re

#take the take the XML version of the vocab and make it HTML

with open ('bbih-vocabulary-as-xml.xml', 'r') as f1:
    text = f1.read()

text = re.sub('\n', '', text)
text = re.sub('<lev', '\n<lev', text)
text = re.sub('<bbih-vocab>', '\n<html><head><title>Bibliography of British and Irish History vocabulary explorer</title></head><body><ul><li>Bibliography of British and Irish History vocabulary explorer', text)
text = re.sub('</bbih-vocab>', '\n</li></ul></body></html>', text)
text = re.sub('<lev[0-9]+><rhs[^>]+>', '<ul><li>', text)
text = re.sub('</rhs>\n', '\n', text)
text = re.sub('</lev[0-9]+>', '</li></ul>', text)#is this line right?
text = re.sub('<usedFor><rhs id="[0-9]+" multi="yes">', '<span class="usedFor-multi">', text)
text = re.sub('<usedFor><rhs id="[0-9]+" multi="yes" factor="yes">', '<span class="usedFor-multi-factor">', text)
text = re.sub('<usedFor><rhs id="[0-9]+">', '<span class="usedFor">', text)
text = re.sub('</rhs></usedFor>', '</span>', text)
text = re.sub('<relatedTerm><rhs id="[0-9]+">', '<span class="relatedTerm">', text)
text = re.sub('</rhs></relatedTerm>', '</span>', text)
text = re.sub('</rhs></li>', '</li>', text)

#add the html body and head to lines 10 and 11 above, depending on what Marty wants




f = open('bbih-vocabulary-as-html.html', 'w')
f.write(text)
f.close()
