# app.py
from fastapi import FastAPI
from pydantic import BaseModel
from query_ai import query_llm  # Update to new filename


app = FastAPI()

class QueryRequest(BaseModel):
    question: str

@app.post("/query/")
def query_endpoint(request: QueryRequest):
    answer = query_llm(request.question)
    return {"response": answer}

# Run using:
# uvicorn app:app --host 0.0.0.0 --port 8000 --reload
