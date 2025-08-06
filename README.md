#TravelGenie AI –  AI-Powered Trip Planner

🔍 Project Overview
TravelGenie AI is a GenAI-powered assistant that helps users plan their dream vacation. Based on a user’s preferences (budget, destination type, dates, etc.), it recommends:

-Travel destinations

-Activities and things to do

-Estimated budget

-Places to stay

-A daily itinerary

The system is enhanced with function calling to fetch real-time data (e.g., hotel suggestions) and uses RAG to pull travel insights from real blogs or guides.


------

# ✅ How the Project Covers Required Concepts


 ## 1. System Prompt & User Prompt
✳️ System Prompt:
The system prompt defines the role and behavior of the AI. For TravelGenie AI, it guides the model to behave like a friendly, reliable travel planner who gives realistic, practical vacation plans.

Example:
"You are a smart and experienced travel planner who provides personalized travel suggestions, activities, and accommodation ideas based on user preferences. Use reliable sources and always respond in a structured, helpful format."

This ensures the AI stays consistent and professional.

✳️ User Prompt:
The user prompt is what the user types — it guides what kind of vacation they want.

Examples:

“Plan a 5-day trip to a beach location under ₹50,000.”

“I want to go on a solo trip to the mountains in December.”

“Suggest a romantic weekend getaway near Bangalore.”

The AI uses this input to create a custom travel plan.

## 2. Tuning Parameters
Tuning parameters are used to control how the model responds. These settings make sure TravelGenie is creative, but still useful and relevant.

Parameter	   Value	       Meaning
Temperature 	  0.6	    Adds mild creativity while staying useful
Top-p	          0.85	    Allows broader choices in suggestions
Frequency Penalty  0.3	    Prevents repeating the same activities or hotels
Max Tokens	      600        Limits the length of the response to keep it concise

This makes the assistant feel human-like, helpful, and clear in its replies.

 ## 3. Structured Output
The AI's response is not just plain text. Instead, it returns structured data — like a list or JSON — which makes it easy to show in a UI or store in a database.This helps in making frontend cards, PDFs, or dashboards easily.

## 4. Function Calling
Function calling allows the AI to trigger specific backend tasks or APIs when it needs to fetch or perform actions beyond just answering.

For TravelGenie AI, some example functions include:

searchHotels(location, budget) → finds hotels in real-time

getWeatherForecast(city, dates) → shows weather for planning

generateItinerary(destination, days) → builds a full-day plan

findNearbyAttractions(location) → lists activities near user


## 5. RAG (Retrieval-Augmented Generation)
RAG allows TravelGenie to pull real-world travel data from a custom dataset (like blogs or guides) and use it in the reply.

How it works:
User asks: “What are must-see places in Munnar?”

The system retrieves matching paragraphs from a travel blog stored in a database (like Pinecone or FAISS)

These are passed into the LLM so it can give grounded, fact-based answers

This makes TravelGenie more accurate, personalized, and helpful, and prevents it from hallucinating fake travel advice.