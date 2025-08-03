/**
 * Interfaces para o sistema de ferramentas (Tools)
 */

import { ToolDefinition, ToolResult, ToolSchema } from './mcp.interface.js';

export interface ITool {
  readonly name: string;
  readonly description: string;
  readonly inputSchema: ToolSchema;
  
  execute(args?: Record<string, any>): Promise<ToolResult>;
  getDefinition(): ToolDefinition;
}

export interface IToolManager {
  registerTool(tool: ITool): void;
  getTool(name: string): ITool | undefined;
  getAllTools(): ITool[];
  getToolDefinitions(): ToolDefinition[];
  executeTool(name: string, args?: Record<string, any>): Promise<ToolResult>;
}

export interface ToolExecutionContext {
  toolName: string;
  arguments: Record<string, any>;
  timestamp: Date;
}

export interface ToolExecutionResult {
  success: boolean;
  result?: ToolResult;
  error?: Error;
  executionTime: number;
}