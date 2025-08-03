# MCP Server HTTP - TypeScript

Este é um servidor MCP (Model Context Protocol) desenvolvido em TypeScript aplicando princípios SOLID e orientação a objetos.

## 🏗️ Arquitetura

O projeto foi estruturado seguindo os princípios SOLID:

- **Single Responsibility**: Cada classe tem uma única responsabilidade
- **Open/Closed**: Sistema extensível para novas ferramentas
- **Liskov Substitution**: Todas as ferramentas implementam a mesma interface
- **Interface Segregation**: Interfaces específicas e bem definidas
- **Dependency Inversion**: Injeção de dependências entre componentes

### Estrutura do Projeto

```
src/
├── interfaces/          # Interfaces TypeScript
│   ├── mcp.interface.ts     # Interfaces do protocolo MCP
│   ├── tool.interface.ts    # Interfaces para ferramentas
│   └── server.interface.ts  # Interfaces do servidor
├── services/            # Serviços principais
│   ├── tool-manager.ts      # Gerenciador de ferramentas
│   ├── mcp-handler.ts       # Manipulador do protocolo MCP
│   ├── http-server.ts       # Servidor HTTP Express
│   └── http-transport.ts    # Transporte HTTP para MCP
├── tools/               # Ferramentas (Tools)
│   ├── base-tool.ts         # Classe abstrata base
│   └── random-number-tool.ts # Ferramenta de número aleatório
├── utils/               # Utilitários
│   └── logger.ts            # Sistema de logging
├── __tests__/           # Testes unitários
│   ├── random-number-tool.test.ts
│   └── tool-manager.test.ts
└── server.ts            # Arquivo principal da aplicação
```

### Componentes Principais

#### ToolManager
Gerencia o registro, execução e listagem de ferramentas. Implementa o padrão Repository para ferramentas.

#### McpHandler
Processa requisições e notificações do protocolo MCP. Implementa a lógica de negócio do protocolo.

#### HttpServer
Gerencia o servidor Express e endpoints HTTP. Implementa o padrão Facade para as operações web.

#### BaseTool (Abstract)
Classe abstrata que define a interface comum para todas as ferramentas, aplicando Template Method pattern.

## 🚀 Como Executar

### Desenvolvimento
```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Executar testes
npm test

# Executar testes em modo watch
npm run test:watch
```

### Produção
```bash
# Compilar TypeScript
npm run build

# Executar servidor compilado
npm start
```

O servidor estará disponível em: `http://localhost:3000`

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
        "text": "Número aleatório gerado: 42"
      }
    ]
  }
}
```

## 📡 Endpoints Disponíveis

### Endpoint Principal (MCP Protocol)
- **URL:** `POST /mcp/v1`
- **Protocolo:** JSON-RPC 2.0
- **Métodos suportados:**
  - `initialize` - Inicializa a conexão MCP
  - `tools/list` - Lista ferramentas disponíveis
  - `tools/call` - Executa uma ferramenta
  - `ping` - Verifica conectividade

### Endpoints Auxiliares
- **GET /** - Informações do servidor
- **GET /health** - Health check
- **GET /mcp/tools** - Lista ferramentas (formato REST)

## 🧪 Testes

O projeto inclui testes unitários abrangentes:

```bash
# Executar todos os testes
npm test

# Executar testes com cobertura
npm test -- --coverage

# Executar testes em modo watch
npm run test:watch
```

### Estrutura de Testes
- Testes unitários para todas as ferramentas
- Testes de integração para o gerenciador de ferramentas
- Mocks e stubs apropriados
- Cobertura de código

## 🔧 Adicionando Novas Ferramentas

Para adicionar uma nova ferramenta, siga estes passos:

1. **Criar a classe da ferramenta:**
```typescript
// src/tools/my-new-tool.ts
import { BaseTool } from './base-tool.js';
import { ToolResult, ToolSchema } from '../interfaces/mcp.interface.js';

export class MyNewTool extends BaseTool {
  constructor() {
    const schema: ToolSchema = {
      type: "object",
      properties: {
        // definir propriedades aqui
      }
    };

    super("myNewTool", "Descrição da ferramenta", schema);
  }

  protected async executeInternal(args: Record<string, any>): Promise<ToolResult> {
    // implementar lógica aqui
    return this.createTextResponse("Resultado da ferramenta");
  }
}
```

2. **Registrar a ferramenta no servidor:**
```typescript
// src/server.ts - no método registerTools()
const myNewTool = new MyNewTool();
this.toolManager.registerTool(myNewTool);
```

3. **Criar testes:**
```typescript
// src/__tests__/my-new-tool.test.ts
import { MyNewTool } from '../tools/my-new-tool.js';

describe('MyNewTool', () => {
  // implementar testes
});
```

## ⚙️ Configuração

### Variáveis de Ambiente
- `PORT` - Porta do servidor (padrão: 3000)
- `CORS_ORIGIN` - Origem permitida para CORS (padrão: "*")

### Exemplo de .env
```
PORT=3000
CORS_ORIGIN=http://localhost:3000
```

## 📋 Scripts Disponíveis

- `npm run build` - Compila TypeScript para JavaScript
- `npm start` - Executa o servidor compilado
- `npm run dev` - Executa em modo desenvolvimento com hot reload
- `npm test` - Executa testes unitários
- `npm run test:watch` - Executa testes em modo watch

## 🔍 Health Check

Para verificar se o servidor está funcionando:
```bash
curl http://localhost:3000/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "server": "My First MCP HTTP Server",
  "version": "1.0.0",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 12345
}
```

## 🏷️ Tecnologias Utilizadas

- **TypeScript** - Linguagem de programação com tipagem estática
- **Express.js** - Framework web para Node.js
- **Jest** - Framework de testes
- **@modelcontextprotocol/sdk** - SDK oficial do MCP
- **CORS** - Middleware para Cross-Origin Resource Sharing
- **dotenv** - Carregamento de variáveis de ambiente

## 📝 Logging

O sistema utiliza um logger personalizado com diferentes níveis:
- **DEBUG** - Informações detalhadas para depuração
- **INFO** - Informações gerais de operação
- **WARN** - Avisos sobre situações potencialmente problemáticas
- **ERROR** - Erros que requerem atenção

## 🚦 Tratamento de Erros

O sistema implementa tratamento robusto de erros:
- Erros HTTP são capturados e retornados com códigos apropriados
- Erros do protocolo MCP seguem a especificação JSON-RPC 2.0
- Logs detalhados para facilitar depuração
- Graceful shutdown para parada segura do servidor

## 📄 Licença

ISC License - veja o arquivo `package.json` para detalhes.