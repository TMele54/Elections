from os import listdir
from os.path import isfile, join
import csv
import pprint
import json

pp = pprint.PrettyPrinter(indent=4,width=1)

mypath = 'C:\\Users\\tonym\\OneDrive\\AAM_Portfolio\\votes\\static\\data\\elections\\'
mypath2 = 'C:\\Users\\tonym\\OneDrive\\AAM_Portfolio\\votes\\static\\data\\'
files = [f for f in listdir(mypath) if isfile(join(mypath, f))]

bigl =[]
bigd = {}

for f in files:
    d = list(csv.DictReader(open(mypath+f)))
    for o in d:
        o.pop("")
        o.update({"year": f.split(".")[0]})

    #bigd[f.split(".")[0]] = d
    bigl.append(d)

json.dumps(bigl)
with open(mypath2+"votes.json", 'w') as f:
    json.dump(bigl , f)
