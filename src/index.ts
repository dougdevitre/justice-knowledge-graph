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

export { GraphDatabase } from './graph/database';
export { GraphSchema } from './graph/schema';
export { QueryEngine } from './graph/query-engine';

export { IngestionPipeline } from './ingestion/pipeline';
export { StatuteParser } from './ingestion/statute-parser';
export { EntityExtractor } from './ingestion/entity-extractor';
export { RelationshipMapper } from './ingestion/relationship-mapper';

export { GraphQLApi } from './api/graphql-api';
export { RestApi } from './api/rest-api';

export { ChangeTracker } from './versioning/change-tracker';

export type {
  GraphNode,
  GraphEdge,
  Jurisdiction,
  Statute,
  Procedure,
  CaseType,
  QueryResult,
} from './types';
