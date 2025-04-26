import requests
import json
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
        for i in range(0,10):
            url.append(json_value['results'][i]['url'])
            title.append(json_value['results'][i]['title'])
            short_content.append(json_value['results'][i]['content'])
            try:
                print("Search link ",url[i])
                response=requests.get(url[i])
                response.raise_for_status()
                response=BeautifulSoup(response.text,'html.parser').get_text()
                content.append(response.strip())
            except Exception as e:
                print(e)
        return(url,title,short_content,content)

search_query('why sky is blue')