/**
 * Testes para RandomNumberTool
 */

import { RandomNumberTool } from '../tools/random-number-tool.js';

describe('RandomNumberTool', () => {
  let tool: RandomNumberTool;

  beforeEach(() => {
    tool = new RandomNumberTool();
  });

  describe('getDefinition', () => {
    it('deve retornar a definição correta da ferramenta', () => {
      const definition = tool.getDefinition();
      
      expect(definition.name).toBe('generateRandomNumber');
      expect(definition.description).toBe('Gera um número aleatório entre 1 e 100');
      expect(definition.inputSchema.type).toBe('object');
      expect(definition.inputSchema.properties).toEqual({});
    });
  });

  describe('execute', () => {
    it('deve gerar um número aleatório entre 1 e 100', async () => {
      const result = await tool.execute();
      
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toMatch(/Número aleatório gerado: \d+/);
      expect(result.isError).toBeFalsy();
    });

    it('deve gerar números diferentes em múltiplas execuções', async () => {
      const results = await Promise.all([
        tool.execute(),
        tool.execute(),
        tool.execute(),
        tool.execute(),
        tool.execute()
      ]);

      const numbers = results.map(result => {
        const match = result.content[0].text?.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
      });

      // Verificar se os números estão no range correto
      numbers.forEach(num => {
        expect(num).toBeGreaterThanOrEqual(1);
        expect(num).toBeLessThanOrEqual(100);
      });

      // Verificar se não são todos iguais (alta probabilidade de serem diferentes)
      const uniqueNumbers = new Set(numbers);
      expect(uniqueNumbers.size).toBeGreaterThan(1);
    });
  });

  describe('getRandomNumber', () => {
    it('deve retornar um objeto com número aleatório', async () => {
      const result = await tool.getRandomNumber();
      
      expect(result).toHaveProperty('randomNumber');
      expect(typeof result.randomNumber).toBe('number');
      expect(result.randomNumber).toBeGreaterThanOrEqual(1);
      expect(result.randomNumber).toBeLessThanOrEqual(100);
    });
  });
});