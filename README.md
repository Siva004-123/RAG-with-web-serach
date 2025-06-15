# RAG with Web Search

![GitHub License](https://img.shields.io/github/license/Siva004-123/RAG-with-web-search) ![GitHub Stars](https://img.shields.io/github/stars/Siva004-123/RAG-with-web-search)

A Retrieval-Augmented Generation (RAG) system combining real-time web search with a large language model (LLM) for context-aware responses. It features a React frontend, FastAPI backend, Dockerized SearXNG search engine, and a pipeline using Gemini for query fine-tuning and FAISS for vector-based context retrieval.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)

## Features
- React-based frontend for query input and response display.
- FastAPI backend for query processing and LLM integration.
- Dockerized SearXNG for privacy-focused web searches.
- RAG pipeline: Gemini fine-tunes queries, FAISS vectorizes SearXNG results, and Gemini generates responses.
- Modular design for easy extension with other LLMs or search engines.

## Tech Stack
- **Frontend**: React, JavaScript, HTML, CSS
- **Backend**: FastAPI, Python
- **Search Engine**: SearXNG (Docker)
- **RAG**: Gemini (LLM), FAISS (vector store)
- **Containerization**: Docker

## Installation

### Prerequisites
- Node.js (>=18.x)
- Python (>=3.10)
- Docker and Docker Compose
- Gemini API key ([Google Cloud](https://cloud.google.com/))
- Git

Save and commit:

git add README.md
git commit -m "Add README file"
git push origin main

