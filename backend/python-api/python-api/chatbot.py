from flask import Flask, request, jsonify
import google.generativeai as genai
import numpy as np
import time

# --- Configuration ---
API_KEY = "AIzaSyCHnQGRMfH6qYGl-fPPyRkMT8nb6-EevYU"
genai.configure(api_key=API_KEY)

# --- Load the Knowledge Base (the "Brain") ---
try:
    data = np.load('embeddings.npy', allow_pickle=True).item()
    document_chunks = data['chunks']
    document_embeddings = np.array(data['embeddings'])
    print("✅ Chatbot knowledge base loaded successfully.")
except FileNotFoundError:
    print("❌ Error: embeddings.npy not found. Please run process_document.py first.")
    document_chunks = None

# --- Flask App ---
app = Flask(__name__)

def find_best_chunks(query_embedding, doc_embeddings, top_k=3):
    dot_products = np.dot(query_embedding, doc_embeddings.T)
    top_indices = np.argsort(dot_products)[-top_k:][::-1]
    return [document_chunks[i] for i in top_indices], dot_products[top_indices]

def get_chatbot_response(query: str) -> str:
    if document_chunks is None:
        return "Error: Knowledge base is not loaded."

    # Step 1: Embed the user's query
    try:
        query_embedding_result = genai.embed_content(
            model="models/text-embedding-004",
            content=query,
            task_type="RETRIEVAL_QUERY"
        )
        query_embedding = query_embedding_result['embedding']
    except Exception as e:
        return f"Error generating embedding: {e}"

    # Step 2: Find relevant chunks
    relevant_chunks, similarity_scores = find_best_chunks(query_embedding, document_embeddings)

    # Step 3: Confidence check
    CONFIDENCE_THRESHOLD = 0.6
    if similarity_scores.size == 0 or similarity_scores[0] < CONFIDENCE_THRESHOLD:
        return "I couldn't find a confident answer in the documentation. Would you like me to connect you to a live support agent?"

    # Step 4: Generate the final answer using Gemini
    try:
        context = "\n".join(relevant_chunks)
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        prompt = f"Based ONLY on the following context, answer the user's question:\n\nContext:\n{context}\n\nQuestion:\n{query}"
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"An error occurred with the AI model: {e}"
    
