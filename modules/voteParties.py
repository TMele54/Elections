import os
import csv, json
import pprint

parties = "C:\\Users\\tonym\\OneDrive\\AAM_Portfolio\\votes\\static\\data\\presidents\\yrPresPart.csv"

votes = "C:\\Users\\tonym\\OneDrive\\AAM_Portfolio\\votes\\static\\data\\stateVotes\\votes.json"

vizData = "C:\\Users\\tonym\\OneDrive\\AAM_Portfolio\\votes\\static\\data\\vizData\\vizbaby.json"

_parties= list(csv.DictReader(open(parties)))

with open(votes,'r') as json_file:
    _votes = json.load(json_file)

thirty=1
idk=1
updated=[]

op2 = {}
for vyr in _votes: #YEAR
    o = []
    print(vyr[0]['year'])
    for st in vyr: # STATE IN YEAR
        op = {};
        op["state"] = st["State"]
        op["points"] = st["Electoral Votes"]
        op["year"] = st["year"]
        ky = st.keys();
        #print(st["year"],st["State"],st["Electoral Votes"])
        if st['year'] == "1924":
            pass#print(st)
        if st['year'] == "2016":
            ky = [list(ky)[2], list(ky)[4]]
        else:
            ky = [list(ky)[2], list(ky)[3]]

        for i in range(0,len(ky)):  # keys in state and year
            token = ky[i].split(",")[0].replace("*", "")
            for ypp in _parties:
                if ypp['year'] == st['year']:
                    if ypp["president"] == token:  # 2016 table is different
                        op["president_name"] = token
                        op["president_party"] = ypp["party"]
                        op["opponent_name"] = ky[1].split(",")[0].replace("*", "")
                        op["opponent_party"] = "Republican" if op["president_party"] == "Democrat" else "Democrat"

                        if st[ky[0]] == "-":
                            op["state_majority"] = op["opponent_party"]
                        else:
                            op["state_majority"] = op["president_party"]
                        o.append(op)

    op2[st['year']] = o
    #updated.append(o)

pp = pprint.PrettyPrinter(indent=4,depth=100)

print("*"*50)
print("Data Source")
print("*"*50)
#pp.pprint(updated[0:2])
pp.pprint(len(op2))
print("*"*50)
print("Data Source")
print("*"*50)

with open(vizData, 'w') as f:
    json.dump(op2, f, indent=4, sort_keys=True)
