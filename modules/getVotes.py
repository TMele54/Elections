from bs4 import BeautifulSoup # BeautifulSoup is in bs4 package
import requests
import time
import pandas as pd

allz=True;

if allz:
    for yr in range(1892,2020,4):
        print(yr)
        input("HTHTHT")
        try:
            print("Capturing Year", yr)
            URL = 'https://www.archives.gov/electoral-college/' + str(yr)
            content = requests.get(URL)
            soup = BeautifulSoup(content.text, 'html.parser')

            rows = list()
            table = soup.findAll("table")[1]

            head = ["State","Electoral Vote of Each State"]

            l=[]
            l.append(head)
            k = 0;

            for tr in table.findAll("tr"):
                td = tr.find_all('td')
                row = [tr.text for tr in td]
                if len(row) != 0 and k == 0:
                    row = head + [tr.text for tr in td]
                    YO = row
                    k+=1
                else:
                    row = [tr.text for tr in td]
                    l.append(row)
                    print(k,row)


            df = pd.DataFrame(l, columns=YO)
            df = df.dropna()
            df.to_csv("elections/"+str(yr)+".csv")
            time.sleep(5)
        except:
            print("ERROR "*100)
