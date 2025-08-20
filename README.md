📘 Study Buddy AI – Your Personalized Learning Assistant

🔍 Project Overview
Study Buddy AI is a GenAI-powered tutor that helps students learn faster and better. Based on a user’s chosen topic and difficulty level, it automatically generates:

📘 Study Notes (concise and easy to understand)

📝 Quiz Questions (MCQs with multiple options)

💡 Explanations (step-by-step, expandable answers)

The project also demonstrates prompt engineering concepts (zero-shot, one-shot, multi-shot, dynamic prompting, chain-of-thought) and implements structured output, parameter tuning, function calling, and RAG to make the learning experience effective and user-friendly.


✅ How the Project Covers Required Concepts
1. System Prompt & User Prompt (RTFC Framework)

System Prompt: Defines the role, task, format, and constraints for the AI.
User Prompt: Dynamic input provided by the user (topic + difficulty).


2. Tuning Parameters

We fine-tune Gemini’s response behavior using parameters:

Parameter	Value	Purpose
Temperature	0.6	Adds mild creativity while keeping answers factual
Max Tokens	500	Prevents overly long outputs
Top-p	0.8	Ensures a balance between diverse and focused content
Frequency Penalty	0.2	Reduces repetition in study notes

This balance ensures the model is engaging, but accurate and concise.

3. Structured Output

Instead of free text, the AI outputs JSON format.

This makes it easy to build UI cards, flashcards, and quizzes in the frontend.

4. Function Calling

We simulate function-calling by letting the AI decide when to call backend functions for extra tasks.

Examples:

generateQuiz(topic, difficulty) → creates quiz MCQs

summarizeNotes(topic, difficulty) → produces short notes

explainAnswer(question) → generates explanations

This keeps the AI modular and extendable for future upgrades (like fetching PDFs or saving to database).


5. RAG (Retrieval-Augmented Generation)

RAG improves accuracy by pulling facts from custom knowledge bases (like textbooks, notes, or Wikipedia dumps).
User asks: “Explain Newton’s Laws with real-life examples.”

System retrieves relevant passages (e.g., "An object in motion stays in motion...")

These are fed into Gemini → AI gives grounded answers with examples (car braking, pushing a box).

This prevents hallucination and ensures factual correctness.
