from google import genai
import os
from dotenv import load_dotenv
from embeddings import embed

import warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)

load_dotenv()
apikey=os.getenv('gemini_api_key')

def query_generation(prompt):
    client=genai.Client(api_key=apikey)
    response=client.models.generate_content(
        model="gemini-2.0-flash",
        contents=f'''given the user prompt you are tasked to generate search query which helps to capture the real world context
         example
          user: weather today in coimbatore
          agent: what is the weather in coimbatore?
          user:{prompt}
          agent:'''
    )
    print("Searching query",response.text)
    context=embed(response.text)
    response2=client.models.generate_content(
        model="gemini-2.0-flash",contents=f'''
        Given the webresults {context},provide the answer for the given prompt:{prompt}'''
    )
    print("-----------------------------------------------------")
    print()
    print(f"Models output{response2.text}")
    return response2.text
# client = genai.Client(api_key=apikey)

# response = client.models.generate_content(
#     model="gemini-2.0-flash", contents="Explain how AI works in a few words"
# )
# print(response.text)