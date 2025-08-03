/**
 * Testes para ToolManager
 */

import { ToolManager } from '../services/tool-manager.js';
import { RandomNumberTool } from '../tools/random-number-tool.js';

describe('ToolManager', () => {
  let toolManager: ToolManager;
  let randomTool: RandomNumberTool;

  beforeEach(() => {
    toolManager = new ToolManager();
    randomTool = new RandomNumberTool();
  });

  describe('registerTool', () => {
    it('deve registrar uma ferramenta com sucesso', () => {
      expect(() => toolManager.registerTool(randomTool)).not.toThrow();
      expect(toolManager.hasTool('generateRandomNumber')).toBe(true);
    });

    it('deve lançar erro ao tentar registrar ferramenta duplicada', () => {
      toolManager.registerTool(randomTool);
      
      expect(() => toolManager.registerTool(randomTool))
        .toThrow("Ferramenta 'generateRandomNumber' já está registrada");
    });
  });

  describe('getTool', () => {
    it('deve retornar ferramenta registrada', () => {
      toolManager.registerTool(randomTool);
      
      const tool = toolManager.getTool('generateRandomNumber');
      expect(tool).toBe(randomTool);
    });

    it('deve retornar undefined para ferramenta não registrada', () => {
      const tool = toolManager.getTool('nonExistentTool');
      expect(tool).toBeUndefined();
    });
  });

  describe('getAllTools', () => {
    it('deve retornar array vazio quando não há ferramentas', () => {
      const tools = toolManager.getAllTools();
      expect(tools).toEqual([]);
    });

    it('deve retornar todas as ferramentas registradas', () => {
      toolManager.registerTool(randomTool);
      
      const tools = toolManager.getAllTools();
      expect(tools).toHaveLength(1);
      expect(tools[0]).toBe(randomTool);
    });
  });

  describe('getToolDefinitions', () => {
    it('deve retornar definições de todas as ferramentas', () => {
      toolManager.registerTool(randomTool);
      
      const definitions = toolManager.getToolDefinitions();
      expect(definitions).toHaveLength(1);
      expect(definitions[0].name).toBe('generateRandomNumber');
    });
  });

  describe('executeTool', () => {
    beforeEach(() => {
      toolManager.registerTool(randomTool);
    });

    it('deve executar ferramenta com sucesso', async () => {
      const result = await toolManager.executeTool('generateRandomNumber');
      
      expect(result.isError).toBeFalsy();
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
    });

    it('deve retornar erro para ferramenta não encontrada', async () => {
      const result = await toolManager.executeTool('nonExistentTool');
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain("Ferramenta 'nonExistentTool' não encontrada");
    });
  });

  describe('getStats', () => {
    it('deve retornar estatísticas corretas', () => {
      const statsEmpty = toolManager.getStats();
      expect(statsEmpty.totalTools).toBe(0);
      expect(statsEmpty.toolNames).toEqual([]);

      toolManager.registerTool(randomTool);
      
      const statsWithTool = toolManager.getStats();
      expect(statsWithTool.totalTools).toBe(1);
      expect(statsWithTool.toolNames).toEqual(['generateRandomNumber']);
    });
  });

  describe('clear', () => {
    it('deve remover todas as ferramentas', () => {
      toolManager.registerTool(randomTool);
      expect(toolManager.getAllTools()).toHaveLength(1);
      
      toolManager.clear();
      expect(toolManager.getAllTools()).toHaveLength(0);
    });
  });
});