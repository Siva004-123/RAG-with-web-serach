import requests
import json
import re
from bs4 import BeautifulSoup


#searching the given query
def search_query(query):
    from backend import send_message
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
                requests.post("http://localhost:5000/send", json={'url': url[i]})
                print("Search link ",url[i])
                headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'}
                response=requests.get(url[i],timeout=5,headers=headers)
                response.raise_for_status()
                response=BeautifulSoup(response.text,'html.parser').get_text()
                response= re.sub(r"\n+", "\n", response)
                content.append(response.strip())
            except Exception as e:
                print(e)
        return(content)

