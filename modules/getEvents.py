import re, minecart
from PIL import Image

yrs = [str(yr) for yr in range(1900, 2013, 1)]
lines=[]

with open('../static/data/events.txt', 'r') as f:
    for line in f:
        y = line.split()
        #print(y)
        lines.append(line)

events = " ".join(lines)


result = re.search('2000(.*)2001', events)
print(result.group(1))


pdffile = open('../static/data/pdf/events.pdf', 'rb')

doc = minecart.Document(pdffile)
page = doc.get_page(3)
for shape in page.shapes.iter_in_bbox((0, 0, 100, 200)):
    print(shape.path, shape.fill.color.as_rgb())
input("III")
im = page.images[0].as_pil()
im.show()

