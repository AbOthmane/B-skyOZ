######## CRAWLER ##########
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support import expected_conditions as EC
from selenium import webdriver
from bs4 import BeautifulSoup
import pandas as pd

chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument("--incognito")
browser = webdriver.Chrome(chrome_options=chrome_options)

Main_Page = "https://tabelog.com/"
Locations = {
    "Shibuya_Station":"tokyo/A1303/A130301/R4698/"
}
Cafe_Label = "rstLst/CC03/"

df = pd.DataFrame(columns=["Location","Name","Rst_Page","Rank","Lunch_Budget","Dinner_Budget"])
indice = 0
for location,location_path in Locations.items():
    # for area in location:
    url = Main_Page+location_path+Cafe_Label
    browser.get(url)
    parsed_page = BeautifulSoup(browser.page_source,"html.parser")
    rst_wraps = parsed_page.find_all("div",{"class":"list-rst__wrap"})

    for rst_wrap in rst_wraps:
        try:
            Name = rst_wrap.find("a",{"class":"list-rst__rst-name-target"}).get_text()
            Rst_Page = rst_wrap.find("a",{"class":"list-rst__rst-name-target"})["href"]
            # browser.get(Rst_Page)
            # parsed_page = BeautifulSoup(browser.page_source,"html.parser")

            Rank = rst_wrap.find("span",{"class":"list-rst__rating-val"}).get_text()
            Lunch_Budget = rst_wrap.find("span",{"class":"cpy-lunch-budget-val"}).get_text()
            Dinner_Budget = rst_wrap.find("span",{"class":"cpy-dinner-budget-val"}).get_text()
            df.loc[indice] = [location,Name,Rst_Page,Rank,Lunch_Budget,Dinner_Budget]
            indice+=1
        except:
            print("Skip")
            continue
browser.quit()
df.to_csv("data_1.csv")
