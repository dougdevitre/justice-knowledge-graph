/**
 * @fileoverview REST API Endpoints
 *
 * Provides RESTful endpoints for simpler integrations
 * that do not require GraphQL. Supports basic CRUD and
 * search operations on the knowledge graph.
 *
 * @module @justice-os/knowledge-graph/api/rest-api
 */

import type { QueryEngine } from '../graph/query-engine';

/**
 * RestApi provides REST endpoints for the knowledge graph.
 */
export class RestApi {
  private queryEngine: QueryEngine;

  constructor(queryEngine: QueryEngine) {
    this.queryEngine = queryEngine;
  }

  /**
   * Start the REST API server.
   *
   * @param port - Port number to listen on
   */
  async start(port: number = 3000): Promise<void> {
    // TODO: Set up Express/Fastify routes
    // TODO: GET /nodes/:type, GET /nodes/:id, GET /nodes/:id/related
    // TODO: GET /search?q=term, GET /path/:from/:to
    throw new Error('Not implemented');
  }

  /** Stop the REST API server */
  async stop(): Promise<void> {
    throw new Error('Not implemented');
  }
}
