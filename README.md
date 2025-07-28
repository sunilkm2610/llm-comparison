# AI Model Comparison Tool

A Next.js application that allows users to compare responses from three different AI models (OpenAI GPT-4o, Anthropic Claude 3 Sonnet, and XAI Grok) simultaneously. The tool provides detailed performance metrics, cost analysis, and maintains a comparison history using PostgreSQL.

URL -

## 📋 Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- API keys for OpenAI, Anthropic, and XAI

### 1. Clone and Install

```bash
git clone <repository-url>
cd ai-comparison-tool
npm install
```

### 2. Install shadcn/ui Components

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card textarea badge skeleton alert separator
```

### 3. Database Setup

Create a PostgreSQL database and run the following schema:

```sql
-- Create database tables
CREATE TABLE IF NOT EXISTS comparisons (
  id SERIAL PRIMARY KEY,
  prompt TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_tokens INTEGER DEFAULT 0,
  total_cost DECIMAL(10, 6) DEFAULT 0,
  successful_responses INTEGER DEFAULT 0,
  average_latency INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS model_responses (
  id SERIAL PRIMARY KEY,
  comparison_id INTEGER REFERENCES comparisons(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,
  model VARCHAR(100) NOT NULL,
  response TEXT,
  prompt_tokens INTEGER DEFAULT 0,
  completion_tokens INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  estimated_cost DECIMAL(10, 6) DEFAULT 0,
  latency INTEGER DEFAULT 0,
  success BOOLEAN DEFAULT false,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_comparisons_created_at ON comparisons(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_model_responses_comparison_id ON model_responses(comparison_id);
CREATE INDEX IF NOT EXISTS idx_model_responses_provider ON model_responses(provider);
```

### 4. Environment Variables

Create a `.env.local` file:

```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/ai_comparison_db

# AI Provider API Keys
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
XAI_API_KEY=your_xai_api_key_here

# Optional: Use mock XAI if API not available
USE_MOCK_XAI=false
```

### 5. Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000` to use the application.

## 🎯 Technical Decisions and Tradeoffs

### 1. **Function-Based Architecture**

**Decision**: Used functions instead of classes or complex patterns.

**Pros**:

- Easy to understand and explain
- Simple debugging and testing
- Clear separation of concerns
- Minimal learning curve

**Cons**:

- Less object-oriented benefits
- Might need refactoring for complex features

### 2. **Parallel Processing with Promise.allSettled**

**Decision**: Send all three API requests simultaneously.

**Pros**:

- Faster total response time
- Independent error handling
- Better user experience

**Cons**:

- Higher API rate limit usage
- Potential for partial failures

### 3. **Server Actions vs. API Routes**

**Decision**: Used Next.js Server Actions instead of API routes.

**Pros**:

- Type-safe client-server communication
- Automatic serialization
- Better developer experience
- Less boilerplate code

**Cons**:

- Next.js specific (less portable)
- Newer pattern (less community resources)

## 🔮 Future Improvements

### 1. **Enhanced AI Provider Support**

- **Google Gemini Integration**: Add Google's Gemini API
- **Azure OpenAI**: Support enterprise OpenAI deployments
- **Local Models**: Integration with Ollama or similar for local inference
- **Model Selection**: Allow users to choose specific model versions

### 2. **Advanced Features**

- **Prompt Templates**: Pre-defined prompts for common use cases
- **Batch Processing**: Upload CSV of prompts for bulk comparison
- **Response Rating**: User feedback on response quality
- **Export Options**: PDF/CSV export of comparison results

### 3. **User Experience Improvements**

- **Authentication**: User accounts and personal history
- **Collaboration**: Share and collaborate on comparisons
- **Mobile App**: React Native mobile application
- **Dark Mode**: Complete dark mode implementation
- **Accessibility**: Enhanced screen reader support

### 4. **Technical Improvements**

- **Microservices**: Split into smaller, focused services
- **Container Deployment**: Docker containerization
- **CI/CD Pipeline**: Automated testing and deployment
- **Load Balancing**: Handle high traffic scenarios
