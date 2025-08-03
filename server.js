import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// Criar o servidor Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Criar o servidor MCP
const mcpServer = new McpServer({
    name: "My First MCP HTTP Server",
    version: "1.0.0",
});

// Função para gerar um número aleatório
async function generateRandomNumber() {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    return {
        randomNumber,
    };
}

// Registrar a ferramenta no MCP
mcpServer.tool(
    "generateRandomNumber",
    {
        description: "Gera um número aleatório entre 1 e 100",
        inputSchema: {
            type: "object",
            properties: {},
        },
    },
    async () => {
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(await generateRandomNumber()),
                },
            ],
        };
    }
);

// Implementar transport HTTP personalizado
class HttpTransport {
    constructor() {
        this.onMessage = null;
        this.onClose = null;
        this.onError = null;
    }

    async start() {
        // Transport já está iniciado com o servidor Express
        return;
    }

    async send(message) {
        // Para HTTP, as mensagens são enviadas como respostas HTTP
        return message;
    }

    async close() {
        // Fechar conexões se necessário
        return;
    }
}

// Endpoint principal do MCP
app.post('/mcp/v1', async (req, res) => {
    try {
        const message = req.body;
        console.log('📨 Mensagem MCP recebida:', JSON.stringify(message, null, 2));
        
        // Verificar se é uma notificação (sem ID) ou uma requisição (com ID)
        const isNotification = !message.hasOwnProperty('id');
        
        // ===============================
        // TRATAR NOTIFICAÇÕES (sem ID)
        // ===============================
        if (isNotification) {
            console.log('🔔 Processando notificação:', message.method);
            
            if (message.method === 'notifications/initialized') {
                console.log('✅ Cliente MCP inicializado com sucesso');
                res.status(200).end(); // Notificações não precisam de resposta
                return;
            }
            
            if (message.method === 'notifications/progress') {
                console.log('📊 Notificação de progresso recebida');
                res.status(200).end();
                return;
            }
            
            if (message.method === 'notifications/cancelled') {
                console.log('❌ Operação cancelada');
                res.status(200).end();
                return;
            }
            
            // Notificação não reconhecida - mas isso é OK para notificações
            console.log('ℹ️ Notificação não tratada:', message.method);
            res.status(200).end();
            return;
        }
        
        // ===============================
        // TRATAR REQUISIÇÕES (com ID)
        // ===============================
        console.log('📬 Processando requisição:', message.method, 'ID:', message.id);
        
        if (message.method === 'initialize') {
            console.log('🚀 Inicializando servidor MCP...');
            res.json({
                jsonrpc: "2.0",
                id: message.id,
                result: {
                    protocolVersion: "2024-11-05",
                    capabilities: {
                        tools: {
                            listChanged: true
                        },
                        resources: {},
                        prompts: {},
                        logging: {}
                    },
                    serverInfo: {
                        name: "My First MCP HTTP Server",
                        version: "1.0.0"
                    }
                }
            });
            return;
        }
        
        if (message.method === 'tools/list') {
            console.log('🛠️ Listando ferramentas disponíveis...');
            res.json({
                jsonrpc: "2.0",
                id: message.id,
                result: {
                    tools: [
                        {
                            name: "generateRandomNumber",
                            description: "Gera um número aleatório entre 1 e 100",
                            inputSchema: {
                                type: "object",
                                properties: {},
                                additionalProperties: false
                            }
                        }
                    ]
                }
            });
            return;
        }
        
        if (message.method === 'tools/call') {
            const { name, arguments: args } = message.params || {};
            console.log(`🔧 Executando ferramenta: ${name}`);
            
            if (name === 'generateRandomNumber') {
                const result = await generateRandomNumber();
                console.log('🎲 Número gerado:', result);
                res.json({
                    jsonrpc: "2.0",
                    id: message.id,
                    result: {
                        content: [
                            {
                                type: "text",
                                text: `Número aleatório gerado: ${result.randomNumber}`
                            }
                        ]
                    }
                });
                return;
            } else {
                res.json({
                    jsonrpc: "2.0",
                    id: message.id,
                    error: {
                        code: -32601,
                        message: `Ferramenta '${name}' não encontrada`
                    }
                });
                return;
            }
        }
        
        if (message.method === 'ping') {
            console.log('🏓 Ping recebido');
            res.json({
                jsonrpc: "2.0",
                id: message.id,
                result: {}
            });
            return;
        }
        
        // Método não suportado
        console.log('❌ Método não suportado:', message.method);
        res.json({
            jsonrpc: "2.0",
            id: message.id,
            error: {
                code: -32601,
                message: `Método '${message.method}' não suportado`
            }
        });
        
    } catch (error) {
        console.error('💥 Erro ao processar requisição MCP:', error);
        res.status(500).json({
            jsonrpc: "2.0",
            id: req.body?.id || null,
            error: {
                code: -32603,
                message: "Erro interno do servidor",
                data: error.message
            }
        });
    }
});

// Endpoint para listar ferramentas disponíveis
app.get('/mcp/tools', async (req, res) => {
    try {
        const tools = [
            {
                name: "generateRandomNumber",
                description: "Gera um número aleatório entre 1 e 100",
                inputSchema: {
                    type: "object",
                    properties: {},
                }
            }
        ];
        res.json({ tools });
    } catch (error) {
        console.error('Erro ao listar ferramentas:', error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint de health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok',
        server: 'MCP HTTP Server',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// Endpoint raiz com informações do servidor
app.get('/', (req, res) => {
    res.json({
        name: "My First MCP HTTP Server",
        version: "1.0.0",
        protocol: "MCP HTTP",
        endpoints: {
            main: "/mcp/v1",
            tools: "/mcp/tools",
            health: "/health"
        }
    });
});

// Inicializar o servidor
async function init() {
    try {
        console.log('🚀 Iniciando servidor MCP HTTP...');
        
        app.listen(PORT, () => {
            console.log(`✅ Servidor MCP HTTP rodando na porta ${PORT}`);
            console.log(`📡 Endpoint principal: http://localhost:${PORT}/mcp/v1`);
            console.log(`🛠️  Ferramentas: http://localhost:${PORT}/mcp/tools`);
            console.log(`❤️  Health check: http://localhost:${PORT}/health`);
        });
        
    } catch (error) {
        console.error('❌ Erro ao inicializar servidor:', error);
        process.exit(1);
    }
}

// call the initialization
init();