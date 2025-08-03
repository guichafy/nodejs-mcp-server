/**
 * Interfaces para o servidor HTTP e MCP
 */

import { Request, Response } from 'express';
import { JsonRpcMessage, JsonRpcRequest, JsonRpcResponse, McpConfig } from './mcp.interface.js';
import { IToolManager } from './tool.interface.js';

export interface IHttpServer {
  start(): Promise<void>;
  stop(): Promise<void>;
  isRunning(): boolean;
}

export interface IMcpHandler {
  handleRequest(message: JsonRpcMessage): Promise<JsonRpcResponse | void>;
  handleNotification(message: JsonRpcMessage): Promise<void>;
  initialize(params?: any): Promise<any>;
  listTools(): Promise<any>;
  callTool(params: any): Promise<any>;
  ping(): Promise<any>;
}

export interface ITransport {
  start(): Promise<void>;
  send(message: any): Promise<any>;
  close(): Promise<void>;
  onMessage?: (message: any) => void;
  onClose?: () => void;
  onError?: (error: Error) => void;
}

export interface ServerConfig extends McpConfig {
  corsOptions?: {
    origin?: string | string[];
    credentials?: boolean;
  };
  middlewares?: any[];
}

export interface RequestContext {
  request: Request;
  response: Response;
  startTime: Date;
}

export interface EndpointInfo {
  main: string;
  tools: string;
  health: string;
}

export interface HealthStatus {
  status: 'ok' | 'error';
  server: string;
  version: string;
  timestamp: string;
  uptime?: number;
}