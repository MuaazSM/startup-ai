import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from typing import Optional

# Load environment variables
load_dotenv()

# Initialize LLM (OpenAI GPT-4o)
llm = ChatOpenAI(
    model_name="gpt-4o",
    temperature=0.7,
    openai_api_key=os.getenv("OPENAI_API_KEY")
)

def query_llm(user_query: str, params: Optional[dict] = None):
    """Query GPT-4o with user question and return the response."""
    
    if params:
        # If parameters are provided, include them in the prompt
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are an expert startup advisor. Use the provided case studies to answer questions."),
            ("user", "{question}\nParameters:\n{parameters}")
        ])
        input_data = {"question": user_query, "parameters": params}
    else:
        # If no parameters, provide a generic prompt
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are an expert startup advisor."),
            ("user", "{question}")
        ])
        input_data = {"question": user_query}
    
    chain = prompt | llm
    response = chain.invoke(input_data)
    return response.content

if __name__ == "__main__":
    user_question = input("Enter your business question: ")
    # Example: Uncomment and modify params as needed
    # params = {"current_stage": "Pre-seed", "amount": "$100,000"}
    params = None  # Use `None` for a generic response
    answer = query_llm(user_question, params)
    print("\n--- GPT-4o Response ---\n")
    print(answer)
