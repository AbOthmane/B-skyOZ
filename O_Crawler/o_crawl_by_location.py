######## CRAWLER ##########
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support import expected_conditions as EC
from selenium import webdriver
from bs4 import BeautifulSoup
import pandas as pd
import urllib.parse
import re
from datetime import date


chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument("--incognito")
browser = webdriver.Chrome(chrome_options=chrome_options)

Main_Page = "https://tabelog.com/"
Locations = {
    "Shibuya_Station":"tokyo/A1303/A130301/R4698/"
}
Cafe_Label = "rstLst/CC03/"
#add pages feature
# ajouter 1 au nombre de pages et voir si la page contient des cafes
# add google search for crowdedness

df = pd.DataFrame(columns=["Location","Name","Rst_Page","Rank","Lunch_Budget","Dinner_Budget","Lat","Lon","Open_Date","Konzatsu"])
indice = 0
for location,location_path in Locations.items():
    next_page_exists = True
    page_indice = 1
    while next_page_exists:
        # for area in location:
        url = Main_Page+location_path+Cafe_Label+str(page_indice)+"/"
        browser.get(url)
        parsed_page = BeautifulSoup(browser.page_source,"html.parser")

        if len(parsed_page.find_all("div",{"class":"rstlist-notfound"}))>0:
            next_page_exists = False
        else:
            page_indice += 1

        rst_wraps = parsed_page.find_all("div",{"class":"list-rst__wrap"})

        for rst_wrap in rst_wraps:
            try:
                Name = rst_wrap.find("a",{"class":"list-rst__rst-name-target"}).get_text()
                Rst_Page = rst_wrap.find("a",{"class":"list-rst__rst-name-target"})["href"]
                ### rst page data
                browser.get(Rst_Page)
                parsed_page = BeautifulSoup(browser.page_source,"html.parser")

                Lat = Lon = 0
                try:
                    map_wrap = parsed_page.find("div",{"class":"rstinfo-table__map-wrap"})
                    map_url = map_wrap.find("img")["data-original"]
                    parsed = urllib.parse.urlparse(map_url)
                    coords_str = urllib.parse.parse_qs(parsed.query)['markers'][0]
                    coords = re.findall(r"([0-9.]*),([0-9.]*)", coords_str)[0]
                    Lat = coords[0]
                    Lon = coords[1]

                except:
                    print("[Error parsing coords]")

                Open_Date = 0
                try:
                    open_date_str = parsed_page.find("th", string="オープン日").parent.td.p.get_text()
                    open_year = int(open_date_str[:4])
                    open_month = int(open_date_str[open_date_str.find("年")+1:open_date_str.find("月")])
                    open_day = int(open_date_str[open_date_str.find("月")+1:open_date_str.find("日")])
                    Open_Date = date(open_year, open_month, open_day)
                except:
                    print("[Error parsing opening date]")
                try:
                    Rank = rst_wrap.find("span",{"class":"list-rst__rating-val"}).get_text()
                    Lunch_Budget = rst_wrap.find("span",{"class":"cpy-lunch-budget-val"}).get_text()
                    Dinner_Budget = rst_wrap.find("span",{"class":"cpy-dinner-budget-val"}).get_text()
                except:
                    print("[Error parsing rank/budgets]")



                Konzatsu = 0
                



                df.loc[indice] = [location,Name,Rst_Page,Rank,Lunch_Budget,Dinner_Budget,Lat,Lon,Open_Date,Konzatsu]

                indice+=1
            except:
                print("Skip")
                continue
browser.quit()
df.to_csv("data_1.csv")
