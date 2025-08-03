/**
 * Gerenciador de ferramentas (Tools Manager)
 * Responsável por registrar, gerenciar e executar ferramentas
 */

import { ITool, IToolManager, ToolExecutionResult } from '../interfaces/tool.interface.js';
import { ToolDefinition, ToolResult } from '../interfaces/mcp.interface.js';

export class ToolManager implements IToolManager {
  private tools: Map<string, ITool> = new Map();

  /**
   * Registra uma nova ferramenta
   */
  public registerTool(tool: ITool): void {
    if (this.tools.has(tool.name)) {
      throw new Error(`Ferramenta '${tool.name}' já está registrada`);
    }
    
    this.tools.set(tool.name, tool);
    console.log(`🔧 Ferramenta '${tool.name}' registrada com sucesso`);
  }

  /**
   * Obtém uma ferramenta pelo nome
   */
  public getTool(name: string): ITool | undefined {
    return this.tools.get(name);
  }

  /**
   * Obtém todas as ferramentas registradas
   */
  public getAllTools(): ITool[] {
    return Array.from(this.tools.values());
  }

  /**
   * Obtém as definições de todas as ferramentas para o protocolo MCP
   */
  public getToolDefinitions(): ToolDefinition[] {
    return this.getAllTools().map(tool => tool.getDefinition());
  }

  /**
   * Executa uma ferramenta pelo nome
   */
  public async executeTool(name: string, args?: Record<string, any>): Promise<ToolResult> {
    const tool = this.getTool(name);
    
    if (!tool) {
      return {
        content: [{
          type: "text",
          text: `Ferramenta '${name}' não encontrada`
        }],
        isError: true
      };
    }

    try {
      console.log(`🔧 Executando ferramenta: ${name}`);
      const startTime = Date.now();
      
      const result = await tool.execute(args);
      
      const executionTime = Date.now() - startTime;
      console.log(`✅ Ferramenta '${name}' executada em ${executionTime}ms`);
      
      return result;
    } catch (error) {
      console.error(`❌ Erro ao executar ferramenta '${name}':`, error);
      
      return {
        content: [{
          type: "text",
          text: `Erro ao executar ferramenta '${name}': ${error instanceof Error ? error.message : 'Erro desconhecido'}`
        }],
        isError: true
      };
    }
  }

  /**
   * Remove uma ferramenta do registro
   */
  public unregisterTool(name: string): boolean {
    const removed = this.tools.delete(name);
    if (removed) {
      console.log(`🗑️ Ferramenta '${name}' removida`);
    }
    return removed;
  }

  /**
   * Verifica se uma ferramenta está registrada
   */
  public hasTool(name: string): boolean {
    return this.tools.has(name);
  }

  /**
   * Obtém estatísticas do gerenciador de ferramentas
   */
  public getStats(): { totalTools: number; toolNames: string[] } {
    return {
      totalTools: this.tools.size,
      toolNames: Array.from(this.tools.keys())
    };
  }

  /**
   * Limpa todas as ferramentas registradas
   */
  public clear(): void {
    this.tools.clear();
    console.log('🧹 Todas as ferramentas foram removidas');
  }
}