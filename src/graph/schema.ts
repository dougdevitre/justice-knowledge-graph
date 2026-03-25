/**
 * @fileoverview GraphSchema — Node and Edge Type Definitions
 *
 * Defines the schema for the Justice Knowledge Graph, including
 * node types (Statute, Procedure, CaseType, Resource, Jurisdiction, Court)
 * and edge types (APPLIES_IN, REQUIRES, REFERENCES, SUPERSEDES, etc.).
 * Provides validation and constraint enforcement.
 *
 * @module @justice-os/knowledge-graph/graph/schema
 */

import type { NodeType, EdgeType } from '../types';

/** Schema definition for a node type */
export interface NodeTypeDefinition {
  /** The node type name */
  type: NodeType;
  /** Required properties */
  requiredProperties: string[];
  /** Optional properties with their types */
  optionalProperties: Record<string, string>;
  /** Unique constraint fields */
  uniqueConstraints: string[];
  /** Index fields for faster lookup */
  indexedFields: string[];
}

/** Schema definition for an edge type */
export interface EdgeTypeDefinition {
  /** The edge type name */
  type: EdgeType;
  /** Allowed source node types */
  allowedSources: NodeType[];
  /** Allowed target node types */
  allowedTargets: NodeType[];
  /** Required edge properties */
  requiredProperties: string[];
  /** Whether multiple edges of this type between the same nodes are allowed */
  allowDuplicates: boolean;
}

/**
 * GraphSchema defines and validates the structure of the
 * Justice Knowledge Graph, enforcing type safety for nodes and edges.
 *
 * @example
 * ```typescript
 * const schema = GraphSchema.default();
 * const isValid = schema.validateNode({
 *   type: 'Statute',
 *   properties: { code: 'RSMo', section: '535.010', ... },
 * });
 * ```
 */
export class GraphSchema {
  private nodeTypes: Map<NodeType, NodeTypeDefinition> = new Map();
  private edgeTypes: Map<EdgeType, EdgeTypeDefinition> = new Map();

  /**
   * Create the default Justice Knowledge Graph schema with all
   * standard node and edge type definitions.
   *
   * Node types: Statute, Procedure, CaseType, Resource, Jurisdiction, Court
   * Edge types: APPLIES_IN, REQUIRES, REFERENCES, SUPERSEDES, SUPERSEDED_BY,
   *             FOR_CASE_TYPE, SERVED_BY, OPERATES_IN, LOCATED_IN, HANDLES,
   *             AMENDS, RELATED_TO
   */
  static default(): GraphSchema {
    const schema = new GraphSchema();

    // --- Node Types ---

    schema.registerNodeType({
      type: 'Statute',
      requiredProperties: ['title', 'code', 'section', 'text', 'effectiveDate'],
      optionalProperties: { repealDate: 'Date', version: 'number' },
      uniqueConstraints: ['code+section+version'],
      indexedFields: ['code', 'section', 'effectiveDate'],
    });

    schema.registerNodeType({
      type: 'Procedure',
      requiredProperties: ['name', 'description', 'steps'],
      optionalProperties: { timelineDays: 'number' },
      uniqueConstraints: ['name+jurisdictionId'],
      indexedFields: ['name', 'caseTypeId'],
    });

    schema.registerNodeType({
      type: 'CaseType',
      requiredProperties: ['name', 'category'],
      optionalProperties: { description: 'string', aliases: 'string[]' },
      uniqueConstraints: ['name'],
      indexedFields: ['name', 'category'],
    });

    schema.registerNodeType({
      type: 'Resource',
      requiredProperties: ['name', 'type'],
      optionalProperties: { url: 'string', phone: 'string', address: 'string' },
      uniqueConstraints: ['name+jurisdictionId'],
      indexedFields: ['type', 'name'],
    });

    schema.registerNodeType({
      type: 'Jurisdiction',
      requiredProperties: ['name', 'level'],
      optionalProperties: { state: 'string', fipsCode: 'string', parentId: 'string' },
      uniqueConstraints: ['fipsCode'],
      indexedFields: ['name', 'level', 'state'],
    });

    schema.registerNodeType({
      type: 'Court',
      requiredProperties: ['name', 'level'],
      optionalProperties: { address: 'string', phone: 'string' },
      uniqueConstraints: ['name+jurisdictionId'],
      indexedFields: ['name', 'level'],
    });

    // --- Edge Types ---

    schema.registerEdgeType({
      type: 'APPLIES_IN',
      allowedSources: ['Statute', 'Procedure'],
      allowedTargets: ['Jurisdiction'],
      requiredProperties: [],
      allowDuplicates: false,
    });

    schema.registerEdgeType({
      type: 'REQUIRES',
      allowedSources: ['Statute', 'Procedure'],
      allowedTargets: ['Procedure'],
      requiredProperties: [],
      allowDuplicates: false,
    });

    schema.registerEdgeType({
      type: 'REFERENCES',
      allowedSources: ['Statute', 'Procedure'],
      allowedTargets: ['Statute'],
      requiredProperties: [],
      allowDuplicates: false,
    });

    schema.registerEdgeType({
      type: 'SUPERSEDES',
      allowedSources: ['Statute'],
      allowedTargets: ['Statute'],
      requiredProperties: ['effectiveDate'],
      allowDuplicates: false,
    });

    schema.registerEdgeType({
      type: 'SUPERSEDED_BY',
      allowedSources: ['Statute'],
      allowedTargets: ['Statute'],
      requiredProperties: ['effectiveDate'],
      allowDuplicates: false,
    });

    schema.registerEdgeType({
      type: 'FOR_CASE_TYPE',
      allowedSources: ['Procedure'],
      allowedTargets: ['CaseType'],
      requiredProperties: [],
      allowDuplicates: false,
    });

    schema.registerEdgeType({
      type: 'SERVED_BY',
      allowedSources: ['CaseType'],
      allowedTargets: ['Resource'],
      requiredProperties: [],
      allowDuplicates: false,
    });

    schema.registerEdgeType({
      type: 'OPERATES_IN',
      allowedSources: ['Resource'],
      allowedTargets: ['Jurisdiction'],
      requiredProperties: [],
      allowDuplicates: false,
    });

    schema.registerEdgeType({
      type: 'LOCATED_IN',
      allowedSources: ['Court'],
      allowedTargets: ['Jurisdiction'],
      requiredProperties: [],
      allowDuplicates: false,
    });

    schema.registerEdgeType({
      type: 'HANDLES',
      allowedSources: ['Court'],
      allowedTargets: ['CaseType'],
      requiredProperties: [],
      allowDuplicates: false,
    });

    schema.registerEdgeType({
      type: 'AMENDS',
      allowedSources: ['Statute'],
      allowedTargets: ['Statute'],
      requiredProperties: ['effectiveDate'],
      allowDuplicates: false,
    });

    schema.registerEdgeType({
      type: 'RELATED_TO',
      allowedSources: ['Statute', 'Procedure', 'CaseType', 'Resource', 'Court'],
      allowedTargets: ['Statute', 'Procedure', 'CaseType', 'Resource', 'Court'],
      requiredProperties: [],
      allowDuplicates: false,
    });

    return schema;
  }

  /** Register a node type definition */
  registerNodeType(definition: NodeTypeDefinition): void {
    this.nodeTypes.set(definition.type, definition);
  }

  /** Register an edge type definition */
  registerEdgeType(definition: EdgeTypeDefinition): void {
    this.edgeTypes.set(definition.type, definition);
  }

  /** Validate a node against the schema */
  validateNode(node: { type: NodeType; properties: Record<string, unknown> }): boolean {
    const def = this.nodeTypes.get(node.type);
    if (!def) return false;
    return def.requiredProperties.every((prop) => prop in node.properties);
  }

  /** Validate an edge against the schema */
  validateEdge(edge: {
    type: EdgeType;
    sourceType: NodeType;
    targetType: NodeType;
    properties: Record<string, unknown>;
  }): boolean {
    const def = this.edgeTypes.get(edge.type);
    if (!def) return false;
    if (!def.allowedSources.includes(edge.sourceType)) return false;
    if (!def.allowedTargets.includes(edge.targetType)) return false;
    return def.requiredProperties.every((prop) => prop in edge.properties);
  }

  /** Get all registered node type definitions */
  getNodeTypes(): NodeTypeDefinition[] {
    return Array.from(this.nodeTypes.values());
  }

  /** Get all registered edge type definitions */
  getEdgeTypes(): EdgeTypeDefinition[] {
    return Array.from(this.edgeTypes.values());
  }
}
