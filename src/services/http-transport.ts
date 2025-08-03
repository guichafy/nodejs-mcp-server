/**
 * Transporte HTTP para o protocolo MCP
 */

import { ITransport } from '../interfaces/server.interface.js';

export class HttpTransport implements ITransport {
  public onMessage: ((message: any) => void) | undefined = undefined;
  public onClose: (() => void) | undefined = undefined;
  public onError: ((error: Error) => void) | undefined = undefined;

  constructor() {
    // Construtor vazio - o transporte HTTP não requer configuração especial
  }

  /**
   * Inicia o transporte HTTP
   */
  public async start(): Promise<void> {
    // Para HTTP, o transporte já está iniciado com o servidor Express
    console.log('🌐 Transporte HTTP iniciado');
    return;
  }

  /**
   * Envia uma mensagem via HTTP
   */
  public async send(message: any): Promise<any> {
    // Para HTTP, as mensagens são enviadas como respostas HTTP
    // Esta implementação é principalmente para compatibilidade com a interface
    return message;
  }

  /**
   * Fecha o transporte HTTP
   */
  public async close(): Promise<void> {
    // Fechar conexões se necessário
    console.log('🔌 Transporte HTTP fechado');
    
    if (this.onClose) {
      this.onClose();
    }
    
    return;
  }

  /**
   * Simula o recebimento de uma mensagem
   */
  public receiveMessage(message: any): void {
    if (this.onMessage) {
      this.onMessage(message);
    }
  }

  /**
   * Simula um erro no transporte
   */
  public emitError(error: Error): void {
    if (this.onError) {
      this.onError(error);
    }
  }
}