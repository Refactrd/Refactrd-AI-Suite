import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv()

from app.services.ingestion import ingest_document

DOCS_DIR = "meridian_docs"

def main():
    files = sorted(os.listdir(DOCS_DIR))
    print(f"Found {len(files)} documents to ingest\n")

    for filename in files:
        if not filename.endswith(".txt"):
            continue
        filepath = os.path.join(DOCS_DIR, filename)
        with open(filepath, "rb") as f:
            file_bytes = f.read()
        print(f"Ingesting: {filename}...")
        try:
            result = ingest_document(file_bytes, filename)
            print(f"Done: {result['chunks']} chunks indexed\n")
        except Exception as e:
            print(f"Failed: {filename} - {e}\n")

    print("Ingestion complete.")

if __name__ == "__main__":
    main()