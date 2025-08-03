/**
 * Classe abstrata base para todas as ferramentas (Tools)
 */

import { ITool, ToolExecutionContext, ToolExecutionResult } from '../interfaces/tool.interface.js';
import { ToolDefinition, ToolResult, ToolSchema } from '../interfaces/mcp.interface.js';

export abstract class BaseTool implements ITool {
  public readonly name: string;
  public readonly description: string;
  public readonly inputSchema: ToolSchema;

  constructor(name: string, description: string, inputSchema: ToolSchema) {
    this.name = name;
    this.description = description;
    this.inputSchema = inputSchema;
  }

  /**
   * Executa a ferramenta com os argumentos fornecidos
   */
  public async execute(args?: Record<string, any>): Promise<ToolResult> {
    const context: ToolExecutionContext = {
      toolName: this.name,
      arguments: args || {},
      timestamp: new Date()
    };

    try {
      // Validar argumentos antes da execução
      this.validateArguments(args || {});
      
      // Executar a lógica específica da ferramenta
      const result = await this.executeInternal(args || {});
      
      return result;
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Erro ao executar ferramenta ${this.name}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
        }],
        isError: true
      };
    }
  }

  /**
   * Retorna a definição da ferramenta para o protocolo MCP
   */
  public getDefinition(): ToolDefinition {
    return {
      name: this.name,
      description: this.description,
      inputSchema: this.inputSchema
    };
  }

  /**
   * Valida os argumentos fornecidos para a ferramenta
   */
  protected validateArguments(args: Record<string, any>): void {
    // Implementação básica de validação
    if (this.inputSchema.required) {
      for (const requiredField of this.inputSchema.required) {
        if (!(requiredField in args)) {
          throw new Error(`Campo obrigatório '${requiredField}' não fornecido`);
        }
      }
    }
  }

  /**
   * Método abstrato que deve ser implementado por cada ferramenta específica
   */
  protected abstract executeInternal(args: Record<string, any>): Promise<ToolResult>;

  /**
   * Método utilitário para criar respostas de texto simples
   */
  protected createTextResponse(text: string): ToolResult {
    return {
      content: [{
        type: "text",
        text
      }]
    };
  }

  /**
   * Método utilitário para criar respostas de erro
   */
  protected createErrorResponse(error: string): ToolResult {
    return {
      content: [{
        type: "text",
        text: error
      }],
      isError: true
    };
  }
}