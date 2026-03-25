/**
 * @fileoverview Tests for GraphDatabase CRUD operations
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { GraphDatabase } from '../src/graph/database';
import type { DatabaseConfig, GraphNode, GraphEdge } from '../src/types';

describe('GraphDatabase', () => {
  let db: GraphDatabase;
  const config: DatabaseConfig = {
    uri: 'bolt://localhost:7687',
    credentials: { username: 'neo4j', password: 'test' },
    database: 'test',
  };

  beforeEach(() => {
    db = new GraphDatabase(config);
  });

  describe('connect / disconnect', () => {
    it('should initialize without being connected', () => {
      expect(db.isConnected).toBe(false);
    });

    it('should throw not-implemented on connect', async () => {
      await expect(db.connect()).rejects.toThrow('Not implemented');
    });

    it('should set connected to false on disconnect', async () => {
      await db.disconnect();
      expect(db.isConnected).toBe(false);
    });
  });

  describe('createNode', () => {
    it('should require a connection before creating nodes', async () => {
      const node = { id: 'n1', type: 'Statute' as const, name: 'Test', properties: {} };
      await expect(db.createNode(node)).rejects.toThrow('Not connected');
    });

    it('should accept a valid node shape', () => {
      const node = { id: 'n1', type: 'Statute' as const, name: 'RSMo 535.010', properties: { code: 'RSMo' } };
      expect(node.type).toBe('Statute');
      expect(node.properties.code).toBe('RSMo');
    });
  });

  describe('getNode', () => {
    it('should require a connection before querying', async () => {
      await expect(db.getNode('n1')).rejects.toThrow('Not connected');
    });
  });

  describe('createEdge', () => {
    it('should require a connection before creating edges', async () => {
      const edge = {
        type: 'REFERENCES' as const,
        sourceId: 'n1',
        targetId: 'n2',
        properties: {},
      };
      await expect(db.createEdge(edge)).rejects.toThrow('Not connected');
    });
  });

  describe('deleteNode', () => {
    it('should require a connection before deleting', async () => {
      await expect(db.deleteNode('n1')).rejects.toThrow('Not connected');
    });
  });

  describe('query', () => {
    it('should require a connection for raw queries', async () => {
      await expect(db.query('MATCH (n) RETURN n')).rejects.toThrow('Not connected');
    });
  });

  describe('transaction', () => {
    it('should require a connection for transactions', async () => {
      await expect(db.transaction(async () => {})).rejects.toThrow('Not connected');
    });
  });
});
