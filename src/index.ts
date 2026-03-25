/**
 * @fileoverview Justice Knowledge Graph — Connect Laws, Cases, People, and Processes
 *
 * Open graph database connecting laws, procedures, case types, resources,
 * and jurisdictions. Enables smarter AI reasoning and powers search
 * and navigation across the Justice OS ecosystem.
 *
 * @packageDocumentation
 * @module @justice-os/knowledge-graph
 */

// --- Graph Core ---
export { GraphDatabase } from './graph/database';
export { GraphSchema } from './graph/schema';
export { QueryEngine } from './graph/query-engine';

// --- Ingestion Pipeline ---
export { IngestionPipeline } from './ingestion/pipeline';
export { StatuteParser } from './ingestion/statute-parser';
export { EntityExtractor } from './ingestion/entity-extractor';
export { RelationshipMapper } from './ingestion/relationship-mapper';

// --- API Layer ---
export { GraphQLApi } from './api/graphql-api';
export { RestApi } from './api/rest-api';

// --- Versioning ---
export { ChangeTracker } from './versioning/change-tracker';

// --- Types ---
export type {
  GraphNode,
  GraphEdge,
  NodeType,
  EdgeType,
  Jurisdiction,
  Statute,
  Procedure,
  CaseType,
  QueryResult,
  TraversalOptions,
  DatabaseConfig,
} from './types';
