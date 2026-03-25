/**
 * @fileoverview Type definitions for the Justice Knowledge Graph
 *
 * Defines all shared types for graph nodes, edges, queries,
 * and domain-specific legal entities.
 *
 * @module @justice-os/knowledge-graph/types
 */

/** Types of nodes in the knowledge graph */
export type NodeType =
  | 'Statute'
  | 'Procedure'
  | 'CaseType'
  | 'Resource'
  | 'Jurisdiction'
  | 'Court';

/** Types of edges (relationships) in the knowledge graph */
export type EdgeType =
  | 'APPLIES_IN'
  | 'REQUIRES'
  | 'REFERENCES'
  | 'SUPERSEDES'
  | 'SUPERSEDED_BY'
  | 'FOR_CASE_TYPE'
  | 'SERVED_BY'
  | 'OPERATES_IN'
  | 'LOCATED_IN'
  | 'HANDLES'
  | 'AMENDS'
  | 'RELATED_TO';

/** Base graph node with shared properties */
export interface GraphNode {
  /** Unique node identifier */
  id: string;
  /** Node type */
  type: NodeType;
  /** Human-readable name */
  name: string;
  /** Additional properties */
  properties: Record<string, unknown>;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

/** A directed edge between two graph nodes */
export interface GraphEdge {
  /** Unique edge identifier */
  id: string;
  /** Edge type (relationship) */
  type: EdgeType;
  /** Source node ID */
  sourceId: string;
  /** Target node ID */
  targetId: string;
  /** Additional edge properties */
  properties: Record<string, unknown>;
  /** Weight or strength of the relationship (0-1) */
  weight?: number;
}

/** A jurisdiction (federal, state, county, city) */
export interface Jurisdiction {
  /** Unique identifier */
  id: string;
  /** Jurisdiction name */
  name: string;
  /** Level: federal, state, county, city */
  level: 'federal' | 'state' | 'county' | 'city';
  /** State code (e.g., 'MO') */
  state?: string;
  /** FIPS code for geographic identification */
  fipsCode?: string;
  /** Parent jurisdiction ID */
  parentId?: string;
}

/** A legal statute or law */
export interface Statute {
  /** Unique identifier */
  id: string;
  /** Statute title */
  title: string;
  /** Legal code (e.g., 'RSMo') */
  code: string;
  /** Section number (e.g., '535.010') */
  section: string;
  /** Full text of the statute */
  text: string;
  /** Date the statute became effective */
  effectiveDate: Date;
  /** Date the statute was repealed (if applicable) */
  repealDate?: Date;
  /** Jurisdiction ID where this statute applies */
  jurisdictionId: string;
  /** Version number for tracking amendments */
  version: number;
}

/** A legal procedure (sequence of steps in a legal process) */
export interface Procedure {
  /** Unique identifier */
  id: string;
  /** Procedure name */
  name: string;
  /** Detailed description */
  description: string;
  /** Ordered steps in the procedure */
  steps: string[];
  /** Estimated timeline in days */
  timelineDays: number;
  /** Case type this procedure applies to */
  caseTypeId: string;
  /** Jurisdiction ID */
  jurisdictionId: string;
}

/** A type of legal case */
export interface CaseType {
  /** Unique identifier */
  id: string;
  /** Case type name (e.g., 'Eviction') */
  name: string;
  /** Category (civil, criminal, family, etc.) */
  category: string;
  /** Description */
  description: string;
  /** Common alternative names */
  aliases: string[];
}

/** Result of a graph query */
export interface QueryResult {
  /** Matching nodes */
  nodes: GraphNode[];
  /** Edges connecting the matched nodes */
  edges: GraphEdge[];
  /** Total count (may exceed returned nodes if paginated) */
  totalCount: number;
  /** Whether more results are available */
  hasMore: boolean;
}

/** Options for traversal queries */
export interface TraversalOptions {
  /** Maximum depth to traverse */
  maxDepth: number;
  /** Edge types to follow */
  edgeTypes?: EdgeType[];
  /** Node types to include in results */
  nodeTypes?: NodeType[];
  /** Maximum number of nodes to return */
  limit?: number;
}

/** Database connection configuration */
export interface DatabaseConfig {
  /** Connection URI */
  uri: string;
  /** Authentication credentials */
  credentials: {
    username: string;
    password: string;
  };
  /** Database name (default: 'justice') */
  database?: string;
}
