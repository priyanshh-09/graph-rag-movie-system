#  GraphRAG Movie Intelligence System

An AI-powered movie question-answering and recommendation system using hybrid retrieval (Graph + Vector).

##  Features
- Hybrid retrieval using Neo4j (graph) + Pinecone (vector)
- Entity extraction and resolution
- LLM-based query routing (graph vs similarity)
- Natural language → Cypher query conversion
- Interactive chat UI with system reasoning display

## Tech Stack
- Node.js, Express
- React + TailwindCSS
- Neo4j (Graph DB)
- Pinecone (Vector DB)
- Gemini API (LLM)

## ⚙️ Setup

### Backend
```bash
cd Backend
npm install
node server.js
