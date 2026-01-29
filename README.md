# Enterprise RBAC Chatbot

A secure internal chatbot system with Role-Based Access Control (RBAC) and Retrieval-Augmented Generation (RAG).

## 🚀 Setup & Installation

1.  **Clone / Folder Setup**:
    Ensure you are in the root directory `rbac-system`.

2.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

3.  **Data Processing (Week 1 & 2)**:
    Parse documents and assign metadata roles.
    ```bash
    python "week 2/src/chunking.py"
    python "week 2/src/parse_markdown.py"
    python "week 2/src/parse_csv.py"
    python "week 2/src/text_cleaning.py"
    python "week 2/src/metadata_tagging.py"
    ```

4.  **Vector DB (Week 3)**:
    Generate embeddings and index them.
    ```bash
    python "week 3/src/embeddings.py"
    python "week 3/src/index_embeddings.py"
    ```

5.  **Run Backend (Week 5)**:
    Start the FastAPI server.
    ```bash
    python "week 5/src/main.py"
    ```
    API will runs at `http://127.0.0.1:8000`.
    Docs at `http://127.0.0.1:8000/docs`.

## 🧪 Testing

- **RBAC Tests**: `python "week 4/tests/rbac_tests.py"`
- **Search Benchmark**: `python "week 4/tests/benchmark.py"`

## 👤 Default Users (Seeded)

| Username | Password | Role | Access |
|---|---|---|---|
| `admin` | `admin123` | `c-level` | All Departments |
| `finance_user` | `pass123` | `finance` | Finance + General |
| `hr_user` | `pass123` | `hr` | HR + General |
| `marketing_user` | `pass123` | `marketing` | Marketing + General |
| `eng_user` | `pass123` | `engineering` | Engineering + General |
| `employee` | `pass123` | `employees` | General Only |

## 🏗 Architecture
- **Preprocessing**: LangChain + TikToken
- **Embeddings**: Sentence-Transformers (`all-MiniLM-L6-v2`)
- **Vector DB**: ChromaDB
- **Backend**: FastAPI + SQLite + JWT
- **RBAC**: Custom Middleware + Metadata Filtering
