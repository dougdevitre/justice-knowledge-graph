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

/**
 * EntityExtractor identifies legal entities in text using NLP.
 */
export class EntityExtractor {
  /**
   * Extract entities from legal text.
   *
   * @param text - The text to extract entities from
   * @returns Array of extracted entities with types and confidence
   */
  async extract(text: string): Promise<ExtractedEntity[]> {
    // TODO: Run NER model on text
    // TODO: Classify entities by node type
    // TODO: Resolve against existing graph nodes
    throw new Error('Not implemented');
  }
}
