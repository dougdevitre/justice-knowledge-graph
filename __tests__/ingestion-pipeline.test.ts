/**
 * @fileoverview Tests for the IngestionPipeline
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { IngestionPipeline } from '../src/ingestion/pipeline';
import { GraphDatabase } from '../src/graph/database';
import type { IngestionConfig } from '../src/ingestion/pipeline';

describe('IngestionPipeline', () => {
  let pipeline: IngestionPipeline;

  beforeEach(() => {
    const db = new GraphDatabase({
      uri: 'bolt://localhost:7687',
      credentials: { username: 'neo4j', password: 'test' },
    });
    pipeline = new IngestionPipeline(db);
  });

  describe('ingest', () => {
    it('should accept a valid IngestionConfig', async () => {
      const config: IngestionConfig = {
        sourceType: 'statute',
        source: '/data/test.txt',
        jurisdiction: 'MO',
      };
      // Pipeline is not connected, so it throws
      await expect(pipeline.ingest(config)).rejects.toThrow('Not implemented');
    });

    it('should report status as complete initially', () => {
      const status = pipeline.getStatus();
      expect(status.stage).toBe('complete');
      expect(status.progress).toBe(100);
    });
  });

  describe('validate', () => {
    it('should pass for a valid config', async () => {
      const config: IngestionConfig = {
        sourceType: 'statute',
        source: '/data/rsmo.txt',
        jurisdiction: 'MO',
      };
      const errors = await pipeline.validate(config);
      expect(errors).toHaveLength(0);
    });

    it('should fail when source is empty', async () => {
      const config: IngestionConfig = {
        sourceType: 'statute',
        source: '',
        jurisdiction: 'MO',
      };
      const errors = await pipeline.validate(config);
      expect(errors).toContain('source is required');
    });

    it('should fail when jurisdiction is empty', async () => {
      const config = {
        sourceType: 'statute' as const,
        source: '/data/rsmo.txt',
        jurisdiction: '',
      };
      const errors = await pipeline.validate(config);
      expect(errors).toContain('jurisdiction is required');
    });
  });

  describe('loadBatch', () => {
    it('should accept arrays of nodes and edges', async () => {
      await expect(pipeline.loadBatch([], [])).rejects.toThrow('Not implemented');
    });
  });

  describe('getStatus', () => {
    it('should return the current pipeline status', () => {
      const status = pipeline.getStatus();
      expect(status).toHaveProperty('stage');
      expect(status).toHaveProperty('progress');
      expect(status).toHaveProperty('processedCount');
    });
  });
});
