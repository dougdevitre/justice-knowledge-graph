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
import type { NodeType } from '../types';

/** Configuration for the REST API server */
export interface RestApiConfig {
  /** Port to listen on (default 3000) */
  port?: number;
  /** Base path prefix (default '/api/v1') */
  basePath?: string;
  /** CORS origin whitelist */
  corsOrigins?: string[];
  /** API key for authentication (optional) */
  apiKey?: string;
}

/**
 * RestApi provides REST endpoints for the knowledge graph.
 *
 * Supported routes:
 * - `GET  /nodes/:type`         - List nodes by type
 * - `GET  /nodes/:id`           - Get a single node
 * - `GET  /nodes/:id/related`   - Get related nodes
 * - `GET  /search?q=term`       - Full-text search
 * - `GET  /path/:from/:to`      - Shortest path between nodes
 * - `POST /nodes`               - Create a node
 * - `DELETE /nodes/:id`         - Delete a node
 *
 * @example
 * ```typescript
 * const api = new RestApi(queryEngine, { port: 3000 });
 * await api.start();
 * ```
 */
export class RestApi {
  /** Query engine for graph operations */
  private queryEngine: QueryEngine;
  /** Server configuration */
  private config: Required<RestApiConfig>;

  constructor(queryEngine: QueryEngine, config?: RestApiConfig) {
    this.queryEngine = queryEngine;
    this.config = {
      port: config?.port ?? 3000,
      basePath: config?.basePath ?? '/api/v1',
      corsOrigins: config?.corsOrigins ?? ['*'],
      apiKey: config?.apiKey ?? '',
    };
  }

  /**
   * Register all route handlers on the HTTP framework.
   * Called internally by {@link start}.
   */
  registerRoutes(): void {
    // TODO: GET  ${basePath}/nodes/:type    -> queryEngine.findByType
    // TODO: GET  ${basePath}/nodes/:id      -> queryEngine (getNode via db)
    // TODO: GET  ${basePath}/nodes/:id/related -> queryEngine.findRelated
    // TODO: GET  ${basePath}/search?q=term  -> queryEngine.search
    // TODO: GET  ${basePath}/path/:from/:to -> queryEngine.shortestPath
    // TODO: POST ${basePath}/nodes          -> db.createNode
    // TODO: DELETE ${basePath}/nodes/:id    -> db.deleteNode
    throw new Error('Not implemented');
  }

  /**
   * Authentication middleware that validates API keys.
   *
   * @param apiKey - The API key from the request header
   * @returns Whether the key is valid
   */
  authenticate(apiKey: string): boolean {
    if (!this.config.apiKey) return true;
    return apiKey === this.config.apiKey;
  }

  /**
   * Start the REST API server.
   *
   * @param port - Port number to listen on (overrides config)
   */
  async start(port?: number): Promise<void> {
    const listenPort = port ?? this.config.port;
    // TODO: Create Express/Fastify app
    // TODO: Apply CORS, auth, JSON body parser middleware
    // TODO: Register routes
    // TODO: Start HTTP server on listenPort
    throw new Error('Not implemented');
  }

  /**
   * Stop the REST API server gracefully.
   */
  async stop(): Promise<void> {
    // TODO: Drain connections and close server
    throw new Error('Not implemented');
  }
}
