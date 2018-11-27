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
browser2 = webdriver.Chrome(chrome_options=chrome_options)

Main_Page = "https://tabelog.com/"
Locations = {
    "Shibuya_Station":"tokyo/A1303/A130301/R4698/"
}
Cafe_Label = "rstLst/CC03/"

df = pd.DataFrame(columns=["Location","Name","Rst_Page","Rank","Lunch_Budget","Dinner_Budget"])
budget_map = {"~999":0, "1000~1999":1, "2000~2999":2, "3000:3999":3,"4000~4999":4}
budget_map = {{"{}~{}".format(1000*k,1000*(k+1)-1):j*(j+1)/2+k for k in range(j)} for j in range(4)}
indice = 0
for location,location_path in Locations.items():
    # for area in location:
    url = Main_Page+location_path+Cafe_Label
    browser.get(url)
    parsed_page = BeautifulSoup(browser.page_source,"html.parser")
    rst_wraps = parsed_page.find_all("div",{"class":"list-rst__wrap"})

    for rst_wrap in rst_wraps:
        Name = ""
        Rst_page = ""
        Rank = 0
        Lunch_Budget = 0
        Dinner_Budget = 0
        try:
            ## from search page
            Name = rst_wrap.find("a",{"class":"list-rst__rst-name-target"}).get_text()
            Rst_Page = rst_wrap.find("a",{"class":"list-rst__rst-name-target"})["href"]
            Rank = rst_wrap.find("span",{"class":"list-rst__rating-val"}).get_text()
            Lunch_Budget = rst_wrap.find("span",{"class":"cpy-lunch-budget-val"}).get_text()
            Dinner_Budget = rst_wrap.find("span",{"class":"cpy-dinner-budget-val"}).get_text()
            ## from hotel page


            ## from google
            df.loc[indice] = [location,Name,Rst_Page,Rank,Lunch_Budget,Dinner_Budget]
            indice+=1
        except:
            print("Skip")
            continue
browser.quit()
df.to_csv("O_Data/data_1.csv")
