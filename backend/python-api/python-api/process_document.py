# process_document.py
import os
import pypdf
import google.generativeai as genai
import numpy as np

# --- Configuration ---
API_KEY = "AIzaSyCHnQGRMfH6qYGl-fPPyRkMT8nb6-EevYU"
genai.configure(api_key=API_KEY)

def process_all_pdfs_in_folder(folder_path="data"):
    """
    Finds all PDFs in a folder, reads them, chunks the combined text,
    and creates a single embeddings file.
    """
    if not os.path.isdir(folder_path):
        print(f"❌ Error: Folder '{folder_path}' not found. Please create it and add your PDF files.")
        return

    # Find all PDF files in the specified folder
    pdf_files = [f for f in os.listdir(folder_path) if f.lower().endswith('.pdf')]
    
    if not pdf_files:
        print(f"❌ No PDF files found in the '{folder_path}' folder.")
        return

    print(f"Found {len(pdf_files)} PDF(s) to process: {', '.join(pdf_files)}")
    
    full_text = ""
    total_pages = 0
    
    # Loop through all found PDF files and extract their text
    for pdf_file in pdf_files:
        file_path = os.path.join(folder_path, pdf_file)
        print(f"Reading '{file_path}'...")
        try:
            reader = pypdf.PdfReader(file_path)
            total_pages += len(reader.pages)
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    full_text += page_text + "\n"
        except Exception as e:
            print(f"Could not read {pdf_file}. Skipping. Error: {e}")

    # --- Chunking and Embedding Logic (Unchanged) ---
    if full_text:
        chunk_size = 1000
        chunk_overlap = 200
        
        chunks = []
        start_index = 0
        while start_index < len(full_text):
            end_index = start_index + chunk_size
            chunks.append(full_text[start_index:end_index])
            start_index += chunk_size - chunk_overlap

        print(f"\nRead a total of {total_pages} pages. Created {len(chunks)} text chunks.")

        print("Embedding chunks... (This may take a moment)")
        result = genai.embed_content(
            model="models/text-embedding-004",
            content=chunks,
            task_type="RETRIEVAL_DOCUMENT",
            title="Caterpillar Machine Manuals"
        )
        embeddings = result['embedding']
        np.save('embeddings.npy', {'chunks': chunks, 'embeddings': embeddings})
        print("✅ Success! Combined knowledge base created and saved as embeddings.npy")
    else:
        print("❌ Error: Could not extract any text from the PDF files.")

if __name__ == '__main__':
    process_all_pdfs_in_folder()