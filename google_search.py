import requests
import json
import re
from bs4 import BeautifulSoup

#searching the given query
def search_query(query):
    response=requests.get(f"http://localhost:8080/search?q={query}&format=json")
    if response.status_code==200:
        json_value=json.loads(response.text)
        url=[]
        title=[]
        short_content=[]
        content=[]
        for i in range(0,5):
            url.append(json_value['results'][i]['url'])
            try:
                print("Search link ",url[i])
                response=requests.get(url[i],timeout=5)
                response.raise_for_status()
                response=BeautifulSoup(response.text,'html.parser').get_text()
                response= re.sub(r"\n+", "\n", response)
                content.append(response.strip())
            except Exception as e:
                print(e)
        return(content)

