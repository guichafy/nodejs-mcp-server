/**
 * Servidor MCP HTTP Principal
 * Aplicando princípios SOLID e orientação a objetos
 */

import dotenv from 'dotenv';
import { ServerConfig } from './interfaces/server.interface.js';
import { ToolManager } from './services/tool-manager.js';
import { McpHandler } from './services/mcp-handler.js';
import { HttpServer } from './services/http-server.js';
import { RandomNumberTool } from './tools/random-number-tool.js';

// Carregar variáveis de ambiente
dotenv.config();

/**
 * Classe principal da aplicação
 * Responsável por inicializar e coordenar todos os componentes
 */
class McpServerApplication {
  private config: ServerConfig;
  private toolManager: ToolManager;
  private mcpHandler: McpHandler;
  private httpServer: HttpServer;

  constructor() {
    // Configuração do servidor
    this.config = this.createServerConfig();
    
    // Inicializar componentes seguindo princípios de Injeção de Dependência
    this.toolManager = new ToolManager();
    this.mcpHandler = new McpHandler(this.config, this.toolManager);
    this.httpServer = new HttpServer(this.config, this.mcpHandler, this.toolManager);
    
    // Registrar ferramentas disponíveis
    this.registerTools();
  }

  /**
   * Cria a configuração do servidor
   */
  private createServerConfig(): ServerConfig {
    return {
      name: "My First MCP HTTP Server",
      version: "1.0.0",
      port: Number(process.env.PORT) || 3000,
      corsOptions: {
        origin: process.env.CORS_ORIGIN || "*",
        credentials: true
      }
    };
  }

  /**
   * Registra todas as ferramentas disponíveis
   */
  private registerTools(): void {
    console.log('🔧 Registrando ferramentas...');
    
    // Registrar ferramenta de número aleatório
    const randomNumberTool = new RandomNumberTool();
    this.toolManager.registerTool(randomNumberTool);
    
    // Aqui podem ser registradas mais ferramentas no futuro
    // seguindo o princípio Open/Closed (aberto para extensão, fechado para modificação)
    
    const stats = this.toolManager.getStats();
    console.log(`✅ ${stats.totalTools} ferramenta(s) registrada(s): ${stats.toolNames.join(', ')}`);
  }

  /**
   * Inicia a aplicação
   */
  public async start(): Promise<void> {
    try {
      console.log('🚀 Iniciando servidor MCP HTTP...');
      console.log(`📋 Configuração: ${this.config.name} v${this.config.version}`);
      
      // Iniciar servidor HTTP
      await this.httpServer.start();
      
      console.log('✅ Servidor MCP HTTP iniciado com sucesso!');
      
      // Configurar handlers de processo para graceful shutdown
      this.setupProcessHandlers();
      
    } catch (error) {
      console.error('❌ Erro ao inicializar servidor:', error);
      process.exit(1);
    }
  }

  /**
   * Para a aplicação gracefully
   */
  public async stop(): Promise<void> {
    try {
      console.log('🔌 Parando servidor MCP HTTP...');
      
      await this.httpServer.stop();
      
      console.log('✅ Servidor parado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao parar servidor:', error);
      throw error;
    }
  }

  /**
   * Configura handlers para sinais do processo
   */
  private setupProcessHandlers(): void {
    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      console.log(`\\n📡 Recebido sinal ${signal}. Parando servidor...`);
      try {
        await this.stop();
        process.exit(0);
      } catch (error) {
        console.error('Erro durante parada do servidor:', error);
        process.exit(1);
      }
    };

    // Capturar sinais de terminação
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

    // Capturar exceções não tratadas
    process.on('uncaughtException', (error) => {
      console.error('🚨 Exceção não capturada:', error);
      gracefulShutdown('uncaughtException');
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('🚨 Promise rejeitada não tratada:', reason);
      console.error('Promise:', promise);
      gracefulShutdown('unhandledRejection');
    });
  }

  /**
   * Obtém estatísticas da aplicação
   */
  public getApplicationStats(): {
    server: any;
    tools: any;
    mcp: any;
  } {
    return {
      server: this.httpServer.getStats(),
      tools: this.toolManager.getStats(),
      mcp: this.mcpHandler.getStats()
    };
  }

  /**
   * Obtém a configuração da aplicação
   */
  public getConfig(): ServerConfig {
    return { ...this.config };
  }
}

/**
 * Função principal para iniciar a aplicação
 */
async function main(): Promise<void> {
  const app = new McpServerApplication();
  await app.start();
}

// Inicializar aplicação se este arquivo for executado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('💥 Erro fatal na aplicação:', error);
    process.exit(1);
  });
}

// Exportar classe principal para testes
export { McpServerApplication };
export default McpServerApplication;