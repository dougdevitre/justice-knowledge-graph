/**
 * @fileoverview Find Related Laws via Graph Traversal
 *
 * Demonstrates how to find laws related to a specific statute
 * by traversing the knowledge graph. Shows cross-references,
 * dependent procedures, and related case types.
 *
 * @example
 * ```bash
 * npx ts-node examples/find-related-laws.ts
 * ```
 */

import {
  GraphDatabase,
  QueryEngine,
  ChangeTracker,
} from '@justice-os/knowledge-graph';
import type {
  QueryResult,
  Statute,
  Procedure,
  GraphNode,
} from '@justice-os/knowledge-graph';

async function findRelatedLaws(): Promise<void> {
  // 1. Connect to the graph database
  const db = new GraphDatabase({
    uri: process.env.NEO4J_URI ?? 'bolt://localhost:7687',
    credentials: {
      username: process.env.NEO4J_USER ?? 'neo4j',
      password: process.env.NEO4J_PASSWORD ?? 'password',
    },
  });

  await db.connect();
  const query = new QueryEngine(db);

  // 2. Start with a specific statute: RSMo 535.010 (Landlord-Tenant definitions)
  const startStatuteId = 'RSMo-535.010';
  console.log(`Finding laws related to ${startStatuteId}...\n`);

  // 3. Find statutes that REFERENCE this one
  const referencedBy: QueryResult = await query.findRelated(
    startStatuteId,
    'REFERENCES',
  );

  console.log(`Statutes referencing ${startStatuteId}:`);
  for (const node of referencedBy.nodes) {
    console.log(`  - ${node.name} (${node.type})`);
  }

  // 4. Find procedures that REQUIRE this statute
  const requiredBy: QueryResult = await query.findRelated(
    startStatuteId,
    'REQUIRES',
  );

  console.log(`\nProcedures requiring ${startStatuteId}:`);
  for (const node of requiredBy.nodes) {
    const proc = node as unknown as Procedure;
    console.log(`  - ${proc.name} (${proc.steps?.length ?? 0} steps)`);
  }

  // 5. Traverse up to 3 hops to find the broader legal neighborhood
  const neighborhood = await query.traverseFrom(startStatuteId, {
    maxDepth: 3,
    edgeTypes: ['REFERENCES', 'REQUIRES', 'APPLIES_IN', 'FOR_CASE_TYPE'],
    limit: 20,
  });

  console.log(`\nBroader legal neighborhood (3-hop traversal):`);
  console.log(`  Nodes: ${neighborhood.nodes.length}`);
  console.log(`  Edges: ${neighborhood.edges.length}`);

  // Group by node type
  const byType = new Map<string, GraphNode[]>();
  for (const node of neighborhood.nodes) {
    const list = byType.get(node.type) ?? [];
    list.push(node);
    byType.set(node.type, list);
  }

  for (const [type, nodes] of byType) {
    console.log(`  ${type}: ${nodes.map((n) => n.name).join(', ')}`);
  }

  // 6. Check the version history for this statute
  const tracker = new ChangeTracker();
  const history = await tracker.getHistory(startStatuteId);

  console.log(`\nVersion history for ${startStatuteId}:`);
  for (const version of history) {
    console.log(
      `  v${version.version} (effective ${version.effectiveDate.toISOString().split('T')[0]})`,
    );
  }

  await db.disconnect();
  console.log('\nDone.');
}

findRelatedLaws().catch(console.error);
