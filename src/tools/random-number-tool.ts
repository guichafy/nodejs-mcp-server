/**
 * Ferramenta para gerar números aleatórios
 */

import { BaseTool } from './base-tool.js';
import { ToolResult, ToolSchema } from '../interfaces/mcp.interface.js';

interface RandomNumberResult {
  randomNumber: number;
}

export class RandomNumberTool extends BaseTool {
  constructor() {
    const schema: ToolSchema = {
      type: "object",
      properties: {},
      additionalProperties: false
    };

    super(
      "generateRandomNumber",
      "Gera um número aleatório entre 1 e 100",
      schema
    );
  }

  protected async executeInternal(args: Record<string, any>): Promise<ToolResult> {
    const result = await this.generateRandomNumber();
    
    return this.createTextResponse(
      `Número aleatório gerado: ${result.randomNumber}`
    );
  }

  /**
   * Gera um número aleatório entre 1 e 100
   */
  private async generateRandomNumber(): Promise<RandomNumberResult> {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    return { randomNumber };
  }

  /**
   * Método público para obter apenas o número (para compatibilidade)
   */
  public async getRandomNumber(): Promise<RandomNumberResult> {
    return this.generateRandomNumber();
  }
}