# cell - 1
from pymongo import MongoClient
from langchain.vectorstores import Chroma
from langchain.docstore.document import Document
from langchain.embeddings import HuggingFaceEmbeddings
from flask import Flask, request, jsonify # API needed libraries

import requests
from langchain.schema import Document

# cell - 2

embedding_function = HuggingFaceEmbeddings(model_name="all-mpnet-base-v2")

vectordb = Chroma(
    collection_name="blog_posts",
    embedding_function=embedding_function,
    persist_directory="./chroma_data"
)

# cell - 3

# 2. Helper to upsert a single post
def upsert_post(post_doc):
    # Flatten body content into a single string
    body_blocks = post_doc.get("body", [])
    text = ""
    for block in body_blocks :
      if block['type'] == "ul" or block['type'] == 'ol' :
        text += "\n"
        text += ",".join( block['value'] )
      elif block['type'] == "link" :
        text += "\n" + block['name']
      else :
        text += "\n" + block['value']
      

    metadata = {
        "title": post_doc["title"],
        "_id": str(post_doc["_id"]),
        "source":str(post_doc["_id"])
    }

    doc = Document(page_content=text, metadata=metadata)
    vectordb.add_documents([doc], ids=[metadata["_id"]])
    print(f"✅ Upserted post: {metadata['title']}")

# 3. Bootstrap: index all existing posts
res = requests.get("https://bah27sznul.execute-api.ap-south-1.amazonaws.com/dev/posts/all-posts")

if res.status_code == 200:
  all_posts = res.json()
  for p in all_posts:
    upsert_post(p)
else:
  print("❌ Failed to fetch posts:", res.status_code)

# cell - 4

import getpass
import os

if "GOOGLE_API_KEY" not in os.environ:
    os.environ["GOOGLE_API_KEY"] = "AIzaSyAkJNyzl0m2fcr2XZu4ch_RxYw3lnFaPfA"


from langchain_google_genai import ChatGoogleGenerativeAI

llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0.1,
    max_tokens=None,
    timeout=None,
    max_retries=2,
    # other params...
)

# cell-5

from langchain.embeddings import HuggingFaceEmbeddings
from langchain.chains import RetrievalQAWithSourcesChain


chain = RetrievalQAWithSourcesChain.from_llm(
    llm=llm,
    retriever=vectordb.as_retriever(search_kwargs={"k": 10})
)


app = Flask(__name__)

@app.route("/" , methods=['GET'])
def root() :
  return "This is a Flask API , used to power Chatbot for Doughtflow application."

# end-point to serve chatbot question
@app.route("/ask" , methods=['POST'])
def ask() :
  question = request.get_json()['question']
  answer = chain( { "question": question } , return_only_outputs=True  )
  print(answer)
  return jsonify(
    {
      "answer":answer['answer'],
      "sources":answer['sources'].split(",")
    }
  )

@app.route("/add-post" , methods=['POST'])
def add_post() :
  new_post_added = request.get_json()['new_post']
  upsert_post(new_post_added)
  return jsonify({"success":True,"message":"post added to LLM ChatBot"})

  