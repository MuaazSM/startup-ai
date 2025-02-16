# query_llm.py
import os
from typing import List, Dict
import openai
from dotenv import load_dotenv
from search_engine import StartupKnowledgeSearch

def get_enhanced_prompt(query: str, contexts: List[Dict] = None) -> str:
    """Create an enhanced prompt with or without contexts"""
    
    if contexts and len(contexts) > 0:
        # We have relevant contexts, use them
        context_str = "\n\n".join([
            f"Context {i+1} (Relevance: {c['score']:.2f}):\n{c['text']}"
            for i, c in enumerate(contexts)
        ])
        
        return f"""As an expert startup advisor, please answer this question: {query}

Relevant Case Studies:
{context_str}

Please provide a detailed response drawing from both these case studies and your general knowledge. If the case studies don't fully address the question, supplement with relevant startup best practices and principles.

Step-by-step thought process:
1) First, analyze the specific insights from the provided case studies
2) Then, consider any relevant general startup principles
3) Finally, synthesize a comprehensive answer

Your response should be:
- Practical and actionable
- Supported by examples where possible
- Clear and well-structured
"""
    else:
        # No relevant contexts, use general knowledge prompt
        return f"""As an expert startup advisor with deep knowledge of successful startups, please answer this question: {query}

Even though we don't have specific case studies for this query, please provide a detailed response based on:
1) General startup best practices
2) Common patterns in successful startups
3) Fundamental business principles

Your response should:
- Be practical and actionable
- Include relevant examples where possible
- Explain the reasoning behind each recommendation
- Address potential challenges and solutions

Please structure your response clearly and provide specific, actionable steps when applicable."""

def get_llm_response(query: str, contexts: List[Dict] = None) -> str:
    """Get response from GPT-4o with fallback logic"""
    try:
        # Create the appropriate prompt
        prompt = get_enhanced_prompt(query, contexts)
        
        # Get response from GPT-4o
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": """You are an expert startup advisor with deep knowledge of both successful and failed startups. 
                    Your goal is to provide practical, actionable advice that combines specific examples with fundamental principles.
                    Always maintain a balanced view, acknowledging both opportunities and challenges."""
                },
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,  # Balance between creativity and consistency
            max_tokens=1000   # Allow for detailed responses
        )
        
        return response.choices[0].message.content
        
    except Exception as e:
        # Fallback response in case of any errors
        print(f"Error getting LLM response: {str(e)}")
        return create_fallback_response(query)

def create_fallback_response(query: str) -> str:
    """Create a structured fallback response when primary response fails"""
    return f"""I apologize for the technical difficulty in providing a complete response to your question about: {query}

However, I can offer some general guidance:

1. Start with thorough research and validation
2. Focus on solving a clear problem for your target market
3. Build a minimum viable product (MVP) to test assumptions
4. Gather and act on user feedback early
5. Be prepared to iterate based on market response

For more specific advice, you might want to:
- Research similar successful startups
- Connect with mentors in your industry
- Join startup communities and networks
- Consider startup accelerator programs

Would you like to rephrase your question or focus on a specific aspect of your startup journey?"""

def main():
    # Load environment variables
    load_dotenv()
    openai.api_key = os.getenv("OPENAI_API_KEY")
    
    # Initialize search engine
    search = StartupKnowledgeSearch()
    
    print("\nStartup Advisor Ready! Ask any question about startups.")
    print("(Type 'quit' to exit)")
    
    while True:
        try:
            # Get query
            query = input("\nYour question: ")
            if query.lower() == 'quit':
                break
                
            # Get relevant contexts
            print("\nSearching relevant case studies...")
            contexts = search.search(query)
            
            # Get LLM response
            print("Generating response...")
            response = get_llm_response(query, contexts)
            
            # Print response
            print("\n=== Response ===")
            print(response)
            
        except KeyboardInterrupt:
            print("\nExiting...")
            break
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            fallback = create_fallback_response(query)
            print("\n=== Fallback Response ===")
            print(fallback)

if __name__ == "__main__":
    main()