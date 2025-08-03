# Servidor MCP HTTP

Este é um servidor MCP (Model Context Protocol) do tipo HTTP que expõe ferramentas através de endpoints HTTP usando o protocolo JSON-RPC 2.0.

## 🚀 Como Executar

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Iniciar o servidor:**
   ```bash
   npm start
   ```

   O servidor estará disponível em: `http://localhost:3000`

## 📡 Endpoints Disponíveis

### Endpoint Principal (MCP Protocol)
- **URL:** `POST /mcp/v1`
- **Protocolo:** JSON-RPC 2.0
- **Métodos suportados:**
  - `initialize` - Inicializa a conexão MCP
  - `tools/list` - Lista ferramentas disponíveis
  - `tools/call` - Executa uma ferramenta

### Endpoints Auxiliares
- **GET /** - Informações do servidor
- **GET /health** - Health check
- **GET /mcp/tools** - Lista ferramentas (formato REST)

## 🛠️ Ferramentas Disponíveis

### generateRandomNumber
Gera um número aleatório entre 1 e 100.

**Parâmetros:** Nenhum

**Exemplo de uso:**
```bash
curl -X POST http://localhost:3000/mcp/v1 \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "generateRandomNumber",
      "arguments": {}
    }
  }'
```

**Resposta:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\"randomNumber\":42}"
      }
    ]
  }
}
```

## 🔧 Configuração

### Variáveis de Ambiente
- `PORT` - Porta do servidor (padrão: 3000)

### Exemplo de .env
```
PORT=3000
```

## 📋 Exemplos de Requisições

### 1. Inicializar conexão MCP
```bash
curl -X POST http://localhost:3000/mcp/v1 \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
      "protocolVersion": "2024-11-05"
    }
  }'
```

### 2. Listar ferramentas
```bash
curl -X POST http://localhost:3000/mcp/v1 \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/list"
  }'
```

### 3. Executar ferramenta
```bash
curl -X POST http://localhost:3000/mcp/v1 \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "tools/call",
    "params": {
      "name": "generateRandomNumber",
      "arguments": {}
    }
  }'
```

## 🏗️ Arquitetura

O servidor utiliza:
- **Express.js** - Servidor HTTP
- **@modelcontextprotocol/sdk** - SDK do MCP
- **JSON-RPC 2.0** - Protocolo de comunicação
- **CORS** - Suporte a requisições cross-origin

## 📝 Logs

O servidor exibe logs informativos no console:
- Inicialização do servidor
- Endpoint principal e auxiliares
- Erros de processamento

## 🔍 Health Check

Para verificar se o servidor está funcionando:
```bash
curl http://localhost:3000/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "server": "MCP HTTP Server",
  "version": "1.0.0",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```