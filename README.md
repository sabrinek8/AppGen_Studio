# AppGen Studio - AI-Powered React Native Web Generator

<div align="center">

![AppGen Studio Logo](https://img.shields.io/badge/AppGen-Studio-FF7900?style=for-the-badge&logo=react)

*Create production-ready React Native Web applications with AI-powered generation and real-time modifications*

[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![CrewAI](https://img.shields.io/badge/CrewAI-Powered-9C27B0?style=flat)](https://crewai.com/)
[![MLflow](https://img.shields.io/badge/MLflow-Tracking-0194E2?style=flat&logo=mlflow)](https://mlflow.org/)

[🚀 Quick Start](#-quick-start) • [📖 Documentation](#-documentation) • [🎯 Features](#-features) • [🏗️ Architecture](#-architecture)

</div>

---

## 🌟 Overview

AppGen Studio is a comprehensive full-stack application that revolutionizes React Native Web development through AI-powered code generation. Built with modern technologies, it provides developers with an intelligent assistant that can generate, modify, and optimize React applications in real-time.

### ✨ Key Highlights

- **🤖 AI-Powered Generation**: Generate complete React Native Web applications from natural language descriptions
- **💬 Conversational Modifications**: Modify your projects through natural language chat with specialized AI agents
- **📊 Quality Assurance**: Automated evaluation system with MLflow tracking for consistent quality
- **🎨 Modern UI**: Beautiful Orange Boosted design system with real-time code preview
- **📁 File Intelligence**: PDF processing and context-aware file uploads for enhanced generation

---

## 🎯 Features

### 🎨 Frontend Capabilities
- **Live Code Editor**: Integrated Sandpack editor with real-time preview
- **Chat Interface**: Conversational AI assistant with auto-rotating suggestions
- **File Management**: Drag-and-drop uploads with PDF text extraction
- **Project Export**: Multiple formats (JSON, ZIP) with proper file structure
- **Responsive Design**: Mobile-first Orange Boosted UI with accessibility support

### 🔧 Backend Power
- **Multi-Agent System**: Specialized AI agents for generation and modification tasks
- **LLM Support**: Compatible with Claude, OpenAI GPT, and Azure GitHub Models
- **Quality Evaluation**: Automated scoring with weighted criteria (Requirements: 50%, Code Quality: 25%, RNW Compliance: 25%)
- **Experiment Tracking**: Comprehensive MLflow integration for performance monitoring
- **PDF Processing**: Extract text from PDFs for enhanced context understanding

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph "Frontend (React)"
        A[React Native Web<br/>Code Generator] 
        B[Live Editor<br/>Preview]
        C[Chatbot]
        D[Project Management<br/>Features]
    end
    
    subgraph "Backend (FastAPI)"
        E[Routes API]
        F[Services Logic]
        G[CrewAI Agents]
        H[Evaluation]
        
        subgraph "CrewAI Agents"
            I[Frontend<br/>Generator]
            J[Frontend<br/>Optimizer]
        end
    end
    
    subgraph "LLM Proxy Orange"
        K[Vertex AI<br/>claude-sonnet-3.7]
        L[OpenAI<br/>GPT-4]
    end
    
    subgraph "MLflow"
        M[Metrics and LLM feedback<br/>visualization]
    end
    
    A --> E
    B --> E
    C --> E
    D --> E
    
    E --> F
    F --> G
    G --> K
    G --> L
    
    H --> M
    
    style A fill:#FFF2E6
    style B fill:#FFF2E6
    style C fill:#FFF2E6
    style D fill:#FFF2E6
    style I fill:#FFE6E6
    style J fill:#FFE6E6
    style K fill:#FFE6FF
    style L fill:#FFE6FF
    style M fill:#E6F3FF
```

### 🧩 Technology Stack

#### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Framework | 18+ |
| **Orange Boosted** | Design System | Latest |
| **Sandpack** | Code Editor | Latest |
| **Lucide React** | Icons | Latest |

#### Backend
| Technology | Purpose | Version |
|------------|---------|---------|
| **FastAPI** | Web Framework | Latest |
| **CrewAI** | AI Orchestration | Latest |
| **MLflow** | Experiment Tracking | Latest |
| **PyPDF2** | PDF Processing | Latest |

#### AI & ML
| Provider | Model | Usage |
|----------|-------|-------|
| **Vertex AI** | Claude Sonnet 3.7 | Primary Generation |
| **OpenAI** | GPT-4 | Alternative LLM |
| **Azure** | GitHub Models | Enterprise Option |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+ and npm/yarn
- **Python** 3.11+
- **Docker** (optional)
- API keys for your preferred LLM provider

### 1️⃣ Clone & Setup
```bash
git clone <repository-url>
cd appgen-studio
```

### 2️⃣ Backend Configuration
```bash
cd backend
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
API_KEY=your_llm_api_key
BASE_URL=your_llm_base_url
GITHUB_TOKEN=your_github_token (optional)
MLFLOW_TRACKING_URI=http://localhost:5000
EOF

# Start backend
uvicorn app.main:app --reload
```

### 3️⃣ Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 4️⃣ MLflow Dashboard (Optional)
```bash
cd backend
./setup_mlflow.sh
# MLflow UI available at http://localhost:5000
```

### 🎉 Access Your Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **MLflow**: http://localhost:5000

---

## 📖 Usage Guide

### 🎨 Generate Your First Project

1. **Navigate to Generator**
   ```
   ├── Describe your project: "Todo app with dark mode"
   ├── Add features: "Drag & drop, local storage, categories"
   ├── Upload files: Drag PDFs or code files for context
   └── Click "Generate Project"
   ```

2. **Real-time Preview**
   - Switch to "Preview" tab
   - See live code editor with your generated project
   - Make manual edits or use AI chat

3. **AI-Powered Modifications**
   ```
   💬 Chat: "Change the primary color to orange"
   💬 Chat: "Add a hamburger menu to the header"
   💬 Chat: "Implement user authentication"
   ```

### 📊 Quality Monitoring

AppGen Studio automatically evaluates every generated project:

- **Requirements Fulfillment** (50%): How well the project matches your description
- **Code Quality** (25%): Clean architecture, best practices, error handling
- **React Native Web Compliance** (25%): Proper RNW usage and responsiveness

View detailed metrics in the MLflow dashboard at http://localhost:5000

---

## 🔌 API Reference

### Core Endpoints

#### Project Generation
```http
POST /generate-project
Content-Type: application/json

{
  "description": "E-commerce shopping cart with filters",
  "features": "User auth, payment integration, mobile responsive"
}
```

#### Chat Modifications
```http
POST /api/chat/chat/{project_id}
Content-Type: application/json

{
  "message": "Add a sidebar navigation with collapsible menu"
}
```

#### PDF Processing
```http
POST /api/pdf/extract-pdf-text
Content-Type: multipart/form-data

file: specification.pdf
```

#### Evaluation
```http
POST /api/evaluation/evaluate
Content-Type: application/json

{
  "use_default_cases": true,
  "test_cases": [...]
}
```

---

## 🛠️ Advanced Configuration

### Environment Variables

```bash
# Required
API_KEY=your_llm_api_key
BASE_URL=your_llm_base_url

# Optional
GITHUB_TOKEN=github_token_for_models
MLFLOW_TRACKING_URI=http://localhost:5000
LOG_LEVEL=INFO
MAX_PDF_SIZE=10485760  # 10MB
```

### Docker Deployment

```dockerfile
# Backend
cd backend
docker build -t appgen-backend .
docker run -p 8000:8000 --env-file .env appgen-backend

# Frontend
cd frontend
npm run build
npx serve -s build -l 3000
```

### Production Setup

```bash
# Backend with Gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000

# Frontend build
npm run build
```

---

## 📊 Monitoring & Analytics

### MLflow Dashboard Features
- **Experiment Tracking**: All project generations with metadata
- **Performance Metrics**: Success rates, response times, quality scores
- **Model Comparison**: Compare different LLM providers
- **Artifact Storage**: Generated projects and evaluation reports

### Built-in Analytics
- **Token Usage Tracking**: Monitor LLM costs in `token_usage.log`
- **User Interaction Metrics**: Chat frequency, modification success rates
- **File Upload Analytics**: Success rates by file type and size

---

## 🐛 Troubleshooting

### Common Issues

**🔴 "Failed to generate project"**
```bash
# Check backend status
curl http://localhost:8000/health

# Verify API keys
echo $API_KEY | head -c 20
```

**🔴 "Chat not working"**
```javascript
// Clear localStorage if corrupted
localStorage.clear();
window.location.reload();
```

**🔴 "PDF upload fails"**
- Ensure file size < 10MB
- Check file format (must be valid PDF)
- Verify backend `/api/pdf/extract-pdf-text` endpoint

**🔴 "MLflow connection issues"**
```bash
# Restart MLflow server
mlflow server --host 127.0.0.1 --port 5000
```

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Setup
```bash
# Install pre-commit hooks
pip install pre-commit
pre-commit install

# Run tests
cd backend && python -m pytest
cd frontend && npm test
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---




## 🙏 Acknowledgments

- **Orange** for the beautiful Boosted design system
- **CrewAI** for powerful AI agent orchestration
- **MLflow** for comprehensive experiment tracking
- **Sandpack** for the amazing code editor experience

---

<div align="center">

**Made with ❤️ by me**

[⭐ Star this repository](https://github.com/your-repo/appgen-studio) if you found it helpful!

</div>
