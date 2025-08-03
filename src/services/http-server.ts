/**
 * Servidor HTTP usando Express
 * Responsável por gerenciar o servidor web e endpoints
 */

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { Server } from 'http';

import { 
  IHttpServer, 
  IMcpHandler, 
  ServerConfig, 
  RequestContext, 
  EndpointInfo,
  HealthStatus 
} from '../interfaces/server.interface.js';
import { JsonRpcMessage } from '../interfaces/mcp.interface.js';
import { IToolManager } from '../interfaces/tool.interface.js';

export class HttpServer implements IHttpServer {
  private app: Express;
  private server: Server | null = null;
  private config: ServerConfig;
  private mcpHandler: IMcpHandler;
  private toolManager: IToolManager;
  private startTime: Date;
  private isServerRunning: boolean = false;

  constructor(config: ServerConfig, mcpHandler: IMcpHandler, toolManager: IToolManager) {
    this.config = config;
    this.mcpHandler = mcpHandler;
    this.toolManager = toolManager;
    this.startTime = new Date();
    this.app = express();
    
    this.setupMiddlewares();
    this.setupRoutes();
  }

  /**
   * Configura os middlewares do Express
   */
  private setupMiddlewares(): void {
    // CORS
    this.app.use(cors(this.config.corsOptions || {}));
    
    // JSON parser
    this.app.use(express.json());
    
    // Request logging middleware
    this.app.use((req: Request, res: Response, next) => {
      const context: RequestContext = {
        request: req,
        response: res,
        startTime: new Date()
      };
      
      console.log(`📥 ${req.method} ${req.path} - ${context.startTime.toISOString()}`);
      next();
    });

    // Middlewares customizados se fornecidos
    if (this.config.middlewares) {
      this.config.middlewares.forEach(middleware => {
        this.app.use(middleware);
      });
    }
  }

  /**
   * Configura as rotas do servidor
   */
  private setupRoutes(): void {
    // Endpoint principal do MCP
    this.app.post('/mcp/v1', this.handleMcpRequest.bind(this));
    
    // Endpoint para listar ferramentas
    this.app.get('/mcp/tools', this.handleToolsList.bind(this));
    
    // Endpoint de health check
    this.app.get('/health', this.handleHealth.bind(this));
    
    // Endpoint raiz com informações do servidor
    this.app.get('/', this.handleRoot.bind(this));

    // Handler para rotas não encontradas
    this.app.use('*', this.handleNotFound.bind(this));

    // Handler de erro global
    this.app.use(this.handleError.bind(this));
  }

  /**
   * Manipula requisições MCP
   */
  private async handleMcpRequest(req: Request, res: Response): Promise<void> {
    try {
      const message: JsonRpcMessage = req.body;
      console.log('📨 Mensagem MCP recebida:', JSON.stringify(message, null, 2));
      
      const response = await this.mcpHandler.handleRequest(message);
      
      if (response) {
        res.json(response);
      } else {
        // Notificação - sem resposta necessária
        res.status(200).end();
      }
      
    } catch (error) {
      console.error('💥 Erro ao processar requisição MCP:', error);
      res.status(500).json({
        jsonrpc: "2.0",
        id: req.body?.id || null,
        error: {
          code: -32603,
          message: "Erro interno do servidor",
          data: error instanceof Error ? error.message : 'Erro desconhecido'
        }
      });
    }
  }

  /**
   * Manipula listagem de ferramentas
   */
  private async handleToolsList(req: Request, res: Response): Promise<void> {
    try {
      const toolDefinitions = this.toolManager.getToolDefinitions();
      res.json({ tools: toolDefinitions });
    } catch (error) {
      console.error('Erro ao listar ferramentas:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      });
    }
  }

  /**
   * Manipula health check
   */
  private handleHealth(req: Request, res: Response): void {
    const healthStatus: HealthStatus = {
      status: 'ok',
      server: this.config.name,
      version: this.config.version,
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime.getTime()
    };
    
    res.json(healthStatus);
  }

  /**
   * Manipula rota raiz
   */
  private handleRoot(req: Request, res: Response): void {
    const endpoints: EndpointInfo = {
      main: "/mcp/v1",
      tools: "/mcp/tools",
      health: "/health"
    };

    res.json({
      name: this.config.name,
      version: this.config.version,
      protocol: "MCP HTTP",
      endpoints
    });
  }

  /**
   * Manipula rotas não encontradas
   */
  private handleNotFound(req: Request, res: Response): void {
    res.status(404).json({
      error: "Endpoint não encontrado",
      path: req.path,
      method: req.method
    });
  }

  /**
   * Manipula erros globais
   */
  private handleError(error: any, req: Request, res: Response, next: any): void {
    console.error('🚨 Erro não capturado:', error);
    
    if (res.headersSent) {
      return next(error);
    }
    
    res.status(500).json({
      error: "Erro interno do servidor",
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }

  /**
   * Inicia o servidor HTTP
   */
  public async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const port = this.config.port || 3000;
        
        this.server = this.app.listen(port, () => {
          this.isServerRunning = true;
          console.log(`✅ Servidor MCP HTTP rodando na porta ${port}`);
          console.log(`📡 Endpoint principal: http://localhost:${port}/mcp/v1`);
          console.log(`🛠️  Ferramentas: http://localhost:${port}/mcp/tools`);
          console.log(`❤️  Health check: http://localhost:${port}/health`);
          resolve();
        });

        this.server.on('error', (error) => {
          this.isServerRunning = false;
          reject(error);
        });

      } catch (error) {
        this.isServerRunning = false;
        reject(error);
      }
    });
  }

  /**
   * Para o servidor HTTP
   */
  public async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.server) {
        resolve();
        return;
      }

      this.server.close((error) => {
        this.isServerRunning = false;
        if (error) {
          reject(error);
        } else {
          console.log('🔌 Servidor HTTP parado');
          resolve();
        }
      });
    });
  }

  /**
   * Verifica se o servidor está rodando
   */
  public isRunning(): boolean {
    return this.isServerRunning;
  }

  /**
   * Obtém a instância do Express
   */
  public getApp(): Express {
    return this.app;
  }

  /**
   * Obtém estatísticas do servidor
   */
  public getStats(): { 
    uptime: number; 
    isRunning: boolean; 
    startTime: Date;
    toolCount: number;
  } {
    return {
      uptime: Date.now() - this.startTime.getTime(),
      isRunning: this.isServerRunning,
      startTime: this.startTime,
      toolCount: this.toolManager.getAllTools().length
    };
  }
}