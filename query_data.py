from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

CHROMA_PATH = "chroma"

PROMPT_TEMPLATE = """
Answer the question based only on the following context:

{context}

---

Answer the question based on the above context: {question}
"""

def detect_intent(query_text):
    """Use GPT to detect user intent."""
    model = ChatOpenAI()
    prompt = f"""
    Classify the user's intent based on this query:
    Query: {query_text}
    
    Possible intents:
    - Gratitude
    - Greeting
    - Question about manuals
    - Other
    
    Return only the intent.
    """
    return model.predict(prompt).strip()

def query_data(query_text):
    intent = detect_intent(query_text)
    
    if intent == "Greeting":
        return "Hello! How can I assist you today?"
    elif intent == "Gratitude":
        return "You're welcome!" 
    
    #db hazirlama
    embedding_function = OpenAIEmbeddings()
    db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)

    #3 en iyi sonuc
    results = db.similarity_search_with_relevance_scores(query_text, k=3)
    if len(results) == 0 or results[0][1] < 0.7:
        return "I couldn’t find any relevant information. Could you please rephrase or provide more details?"

    #prompt hazirlama
    context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in results])
    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    prompt = prompt_template.format(context=context_text, question=query_text)

    #cevap
    model = ChatOpenAI()
    response_text = model.predict(prompt)

    return response_text
