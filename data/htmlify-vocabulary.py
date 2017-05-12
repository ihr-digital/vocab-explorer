import re

#take the take the XML version of the vocab and make it HTML

with open ('bbih-vocabulary.xml', 'r') as f1:
    text = f1.read()

text = re.sub('\n', '', text)
text = re.sub('<lev', '\n<lev', text)
text = re.sub('<bbih-vocab>', '', text)
text = re.sub('</bbih-vocab>', '', text)
text = re.sub('<lev[0-9]+><rhs id="([0-9]+)"[^>]+>([^<]+)<', '<ul><li><span class="term" data-rhs-id="\\1">\\2</span><', text)
text = re.sub('</rhs>\n', '</span>\n', text)
text = re.sub('</lev[0-9]+>', '</li></ul>', text)#is this line right?
text = re.sub('<usedFor><rhs id="([0-9]+)" multi="yes">', '<span class="usedFor-multi" data-rhs-id="\\1">', text)
text = re.sub('<usedFor><rhs id="([0-9]+)" multi="yes" factor="yes">', '<span class="usedFor-multi-factor" data-rhs-id="\\1">', text)
text = re.sub('<usedFor><rhs id="([0-9]+)">', '<span class="usedFor" data-rhs-id="\\1">', text)
text = re.sub('</rhs></usedFor>', '</span>', text)
text = re.sub('<relatedTerm><rhs id="([0-9]+)">', '<span class="relatedTerm" data-rhs-id="\\1">', text)
text = re.sub('</rhs></relatedTerm>', '</span>', text)
text = re.sub('</rhs></li>', '</li>', text)
text = re.sub('</rhs>', '', text)

f = open('bbih-vocabulary.html', 'w')
f.write(text)
f.close()
