/**
 * @fileoverview EntityExtractor — NLP Entity Extraction
 *
 * Uses NLP techniques to identify legal entities (courts, statutes,
 * procedures, parties) within text and extract them as graph nodes.
 *
 * @module @justice-os/knowledge-graph/ingestion/entity-extractor
 */

import type { GraphNode, NodeType } from '../types';

/** An extracted entity with its source location */
export interface ExtractedEntity {
  /** The entity text as found in the source */
  text: string;
  /** Inferred node type */
  type: NodeType;
  /** Character offset in the source text */
  offset: number;
  /** Confidence score (0-1) */
  confidence: number;
  /** Resolved graph node (if matched to existing) */
  resolvedNode?: GraphNode;
}

/** Configuration for the entity extractor */
export interface ExtractorConfig {
  /** Minimum confidence threshold for inclusion (default 0.5) */
  minConfidence?: number;
  /** Node types to extract (default: all) */
  targetTypes?: NodeType[];
  /** Whether to attempt deduplication (default true) */
  deduplicate?: boolean;
}

/**
 * EntityExtractor identifies legal entities in text using NLP.
 * Supports configurable confidence thresholds, type filtering,
 * and deduplication against existing graph nodes.
 *
 * @example
 * ```typescript
 * const extractor = new EntityExtractor({ minConfidence: 0.7 });
 * const entities = await extractor.extract(
 *   'Under RSMo 535.010, the Circuit Court of Jackson County...',
 * );
 * ```
 */
export class EntityExtractor {
  /** Extractor configuration */
  private config: Required<ExtractorConfig>;

  constructor(config?: ExtractorConfig) {
    this.config = {
      minConfidence: config?.minConfidence ?? 0.5,
      targetTypes: config?.targetTypes ?? [],
      deduplicate: config?.deduplicate ?? true,
    };
  }

  /**
   * Extract entities from legal text.
   *
   * @param text - The text to extract entities from
   * @returns Array of extracted entities with types and confidence
   */
  async extract(text: string): Promise<ExtractedEntity[]> {
    // TODO: Run NER model on text
    // TODO: Classify entities by node type
    // TODO: Filter by minConfidence and targetTypes
    // TODO: Resolve against existing graph nodes
    throw new Error('Not implemented');
  }

  /**
   * Classify an extracted text span into a graph node type.
   *
   * @param text - The entity text
   * @param context - Surrounding text for disambiguation
   * @returns The most likely node type
   */
  classify(text: string, context: string): NodeType {
    // TODO: Use heuristics and/or ML model to classify
    // Statute references, court names, procedure names, etc.
    throw new Error('Not implemented');
  }

  /**
   * Remove duplicate entities from extraction results.
   * Merges entities that refer to the same real-world concept.
   *
   * @param entities - Raw extracted entities
   * @returns Deduplicated entities with merged confidence scores
   */
  deduplicate(entities: ExtractedEntity[]): ExtractedEntity[] {
    if (!this.config.deduplicate) return entities;

    const seen = new Map<string, ExtractedEntity>();
    for (const entity of entities) {
      const key = `${entity.type}:${entity.text.toLowerCase().trim()}`;
      const existing = seen.get(key);
      if (existing) {
        // Keep the higher-confidence version
        if (entity.confidence > existing.confidence) {
          seen.set(key, entity);
        }
      } else {
        seen.set(key, entity);
      }
    }

    return Array.from(seen.values());
  }

  /**
   * Attempt to link extracted entities to existing nodes in the graph.
   *
   * @param entities - Extracted entities to link
   * @param existingNodes - Known graph nodes to match against
   * @returns Entities with resolvedNode populated where matched
   */
  linkEntities(entities: ExtractedEntity[], existingNodes: GraphNode[]): ExtractedEntity[] {
    return entities.map((entity) => {
      const match = existingNodes.find(
        (n) =>
          n.type === entity.type &&
          n.name.toLowerCase() === entity.text.toLowerCase().trim(),
      );
      return match ? { ...entity, resolvedNode: match } : entity;
    });
  }
}
