# Configuração do MCP Server HTTP no GitHub Copilot

## 🎯 Visão Geral

Este guia mostra como configurar seu servidor MCP HTTP personalizado no GitHub Copilot para que você possa usar suas ferramentas customizadas diretamente no Chat do Copilot.

## 📁 Arquivos de Configuração Disponíveis

- **`.vscode/mcp.json`** - Configuração básica para o repositório
- **`.vscode/mcp-advanced.json`** - Configuração com autenticação
- **`.vscode/mcp-production.json`** - Configuração para ambiente de produção

## 🔧 Tipos de Configuração

### 1. Local (Desenvolvimento)
```json
{
  "servers": {
    "my-mcp-server": {
      "type": "http",
      "url": "http://localhost:3000/mcp/v1"
    }
  }
}
```

### 2. Remoto (Produção)
```json
{
  "servers": {
    "my-mcp-server": {
      "type": "http",
      "url": "https://meu-servidor.com/mcp/v1",
      "headers": {
        "Authorization": "Bearer ${input:api_key}"
      }
    }
  }
}
```

### 3. Server-Sent Events (SSE)
```json
{
  "servers": {
    "my-mcp-server": {
      "type": "sse",
      "url": "https://meu-servidor.com/mcp/sse"
    }
  }
}
```

## 🚀 Como Usar

### Passo 1: Escolha o Arquivo de Configuração
- **Desenvolvimento**: Use `.vscode/mcp.json`
- **Com autenticação**: Use `.vscode/mcp-advanced.json`
- **Produção**: Use `.vscode/mcp-production.json`

### Passo 2: Iniciar o Servidor
```bash
npm start
```

### Passo 3: Configurar no VS Code
1. Abra o arquivo de configuração escolhido
2. Clique no botão "Start" que aparece no VS Code
3. Digite as informações solicitadas (URL, chave de API, etc.)

### Passo 4: Usar no Copilot Chat
1. Abra o Copilot Chat (Ctrl+Shift+I)
2. Selecione modo "Agent"
3. Clique no ícone de ferramentas para ver as ferramentas MCP
4. Use comandos como:
   - "Gere um número aleatório"
   - "Use a ferramenta generateRandomNumber"

## 🛠️ Ferramentas Disponíveis

### generateRandomNumber
- **Descrição**: Gera um número aleatório entre 1 e 100
- **Parâmetros**: Nenhum
- **Exemplo de uso**: "Preciso de um número aleatório"

## 🔍 Troubleshooting

### Servidor não aparece nas ferramentas
- Verifique se o servidor está rodando (`npm start`)
- Confirme se a URL está correta no mcp.json
- Reinicie o servidor MCP no VS Code

### Erro 401 Unauthorized
- Verifique se a chave de API está correta
- Confirme se os headers de autenticação estão configurados

### Timeout na conexão
- Aumente o valor de `timeout` no `requestInit`
- Verifique se o servidor está acessível na URL configurada

## 📚 Referências

- [Documentação oficial do MCP](https://modelcontextprotocol.io)
- [GitHub Copilot MCP Guide](https://docs.github.com/en/copilot/customizing-copilot/extending-copilot-chat-with-mcp)
- [VS Code MCP Documentation](https://code.visualstudio.com/docs/copilot/copilot-mcp)

## 🤝 Contribuição

Para adicionar novas ferramentas ao servidor:
1. Implemente a ferramenta no `server.js`
2. Atualize o endpoint `/mcp/v1` para processar a nova ferramenta
3. Teste localmente antes de fazer deploy

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs do servidor (`npm start`)
2. Confirme se todos os endpoints estão funcionando
3. Teste manualmente com curl antes de usar no Copilot