/**
 * Manipulador do protocolo MCP (Model Context Protocol)
 * Responsável por processar requisições e notificações MCP
 */

import { 
  IMcpHandler, 
  ServerConfig 
} from '../interfaces/server.interface.js';
import { 
  JsonRpcMessage, 
  JsonRpcRequest, 
  JsonRpcResponse, 
  JsonRpcNotification,
  InitializeResult,
  ToolCallParams 
} from '../interfaces/mcp.interface.js';
import { IToolManager } from '../interfaces/tool.interface.js';

export class McpHandler implements IMcpHandler {
  private config: ServerConfig;
  private toolManager: IToolManager;
  private initialized: boolean = false;

  constructor(config: ServerConfig, toolManager: IToolManager) {
    this.config = config;
    this.toolManager = toolManager;
  }

  /**
   * Processa uma mensagem MCP (requisição ou notificação)
   */
  public async handleRequest(message: JsonRpcMessage): Promise<JsonRpcResponse | void> {
    // Verificar se é uma notificação (sem ID) ou uma requisição (com ID)
    const isNotification = !message.hasOwnProperty('id');
    
    if (isNotification) {
      await this.handleNotification(message as JsonRpcNotification);
      return; // Notificações não retornam resposta
    }

    // Processar requisição
    const request = message as JsonRpcRequest;
    console.log('📬 Processando requisição:', request.method, 'ID:', request.id);

    try {
      let result: any;

      switch (request.method) {
        case 'initialize':
          result = await this.initialize(request.params);
          break;
        case 'tools/list':
          result = await this.listTools();
          break;
        case 'tools/call':
          result = await this.callTool(request.params);
          break;
        case 'ping':
          result = await this.ping();
          break;
        default:
          throw new Error(`Método '${request.method}' não suportado`);
      }

      return {
        jsonrpc: "2.0",
        id: request.id,
        result
      };

    } catch (error) {
      console.error('💥 Erro ao processar requisição MCP:', error);
      
      return {
        jsonrpc: "2.0",
        id: request.id,
        error: {
          code: error instanceof Error && error.name === 'MethodNotSupported' ? -32601 : -32603,
          message: error instanceof Error ? error.message : 'Erro interno do servidor',
          data: error instanceof Error ? error.stack : undefined
        }
      };
    }
  }

  /**
   * Processa notificações MCP
   */
  public async handleNotification(message: JsonRpcNotification): Promise<void> {
    console.log('🔔 Processando notificação:', message.method);

    switch (message.method) {
      case 'notifications/initialized':
        console.log('✅ Cliente MCP inicializado com sucesso');
        break;
      case 'notifications/progress':
        console.log('📊 Notificação de progresso recebida');
        break;
      case 'notifications/cancelled':
        console.log('❌ Operação cancelada');
        break;
      default:
        console.log('ℹ️ Notificação não tratada:', message.method);
    }
  }

  /**
   * Inicializa o servidor MCP
   */
  public async initialize(params?: any): Promise<InitializeResult> {
    console.log('🚀 Inicializando servidor MCP...');
    
    this.initialized = true;
    
    return {
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
        name: this.config.name,
        version: this.config.version
      }
    };
  }

  /**
   * Lista todas as ferramentas disponíveis
   */
  public async listTools(): Promise<{ tools: any[] }> {
    console.log('🛠️ Listando ferramentas disponíveis...');
    
    const toolDefinitions = this.toolManager.getToolDefinitions();
    
    return {
      tools: toolDefinitions.map(tool => ({
        name: tool.name,
        description: tool.description,
        inputSchema: {
          ...tool.inputSchema,
          additionalProperties: false
        }
      }))
    };
  }

  /**
   * Executa uma ferramenta
   */
  public async callTool(params: ToolCallParams): Promise<any> {
    const { name, arguments: args } = params || {};
    
    if (!name) {
      throw new Error('Nome da ferramenta não fornecido');
    }

    console.log(`🔧 Executando ferramenta: ${name}`);
    
    const result = await this.toolManager.executeTool(name, args);
    
    if (result.isError) {
      throw new Error(result.content[0]?.text || 'Erro desconhecido na execução da ferramenta');
    }
    
    return result;
  }

  /**
   * Responde a um ping
   */
  public async ping(): Promise<{}> {
    console.log('🏓 Ping recebido');
    return {};
  }

  /**
   * Verifica se o servidor está inicializado
   */
  public isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Obtém informações do servidor
   */
  public getServerInfo(): { name: string; version: string; initialized: boolean } {
    return {
      name: this.config.name,
      version: this.config.version,
      initialized: this.initialized
    };
  }

  /**
   * Obtém estatísticas do manipulador MCP
   */
  public getStats(): { toolCount: number; initialized: boolean } {
    return {
      toolCount: this.toolManager.getAllTools().length,
      initialized: this.initialized
    };
  }
}