/**
 * Interfaces para o protocolo MCP (Model Context Protocol)
 */

export interface JsonRpcMessage {
  jsonrpc: "2.0";
  id?: string | number | null;
  method?: string;
  params?: any;
  result?: any;
  error?: JsonRpcError;
}

export interface JsonRpcRequest extends JsonRpcMessage {
  id: string | number;
  method: string;
  params?: any;
}

export interface JsonRpcResponse extends JsonRpcMessage {
  id: string | number | null;
  result?: any;
  error?: JsonRpcError;
}

export interface JsonRpcNotification extends JsonRpcMessage {
  method: string;
  params?: any;
}

export interface JsonRpcError {
  code: number;
  message: string;
  data?: any;
}

export interface McpCapabilities {
  tools?: {
    listChanged?: boolean;
  };
  resources?: Record<string, any>;
  prompts?: Record<string, any>;
  logging?: Record<string, any>;
}

export interface McpServerInfo {
  name: string;
  version: string;
}

export interface InitializeResult {
  protocolVersion: string;
  capabilities: McpCapabilities;
  serverInfo: McpServerInfo;
}

export interface ToolSchema {
  type: string;
  properties?: Record<string, any>;
  additionalProperties?: boolean;
  required?: string[];
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: ToolSchema;
}

export interface ToolCallParams {
  name: string;
  arguments?: Record<string, any>;
}

export interface ToolContent {
  type: "text" | "image" | "resource";
  text?: string;
  data?: string;
  mimeType?: string;
}

export interface ToolResult {
  content: ToolContent[];
  isError?: boolean;
}

export interface McpConfig {
  name: string;
  version: string;
  port?: number;
}