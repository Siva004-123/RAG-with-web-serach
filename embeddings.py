from langchain_community.embeddings import SentenceTransformerEmbeddings
import numpy as np
import faiss
from google_search import search_query

def embed(query):
    content=search_query(query)
    embeddings = SentenceTransformerEmbeddings(model_name="all-mpnet-base-v2")
    vectors = embeddings.embed_documents(content)
    embedding_dimension = len(vectors[0])
    document_vectors_np = np.array(vectors).astype('float32')
    index = faiss.IndexFlatL2(embedding_dimension)
    index.add(document_vectors_np)
    query_vector = embeddings.embed_query(query)
    query_vector_np = np.array([query_vector]).astype('float32')  # Reshape the query vector

    k = 2  # Number of nearest neighbors to retrieve
    distances, indices = index.search(query_vector_np, k)
    result_content=[]
    for i in indices[0]:
        result_content.append(content[i])
    return result_content
