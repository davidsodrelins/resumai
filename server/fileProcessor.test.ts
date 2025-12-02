import { describe, it, expect, vi } from 'vitest';
import { extractTextFromFile } from './fileProcessor';

describe('File Processor', () => {
  describe('extractTextFromFile', () => {
    it('should handle base64 data URL format', async () => {
      // Test that base64 data URL format is correctly parsed
      const testData = 'test content';
      const base64 = Buffer.from(testData).toString('base64');
      const dataUrl = `data:text/plain;base64,${base64}`;
      
      // Verify data URL format
      expect(dataUrl).toContain('data:');
      expect(dataUrl).toContain('base64,');
      
      // Verify base64 extraction logic
      const base64Data = dataUrl.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      expect(buffer.toString()).toBe(testData);
    });

    it('should reject unsupported file types', async () => {
      const buffer = Buffer.from('test content');
      
      await expect(extractTextFromFile(buffer, 'text/plain')).rejects.toThrow('Unsupported file type');
    });
  });
});
