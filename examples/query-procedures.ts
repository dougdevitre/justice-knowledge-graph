/**
 * @fileoverview Query Procedures Example
 *
 * Demonstrates how to query the Justice Knowledge Graph for
 * eviction procedures in a specific jurisdiction, explore
 * related statutes, and traverse the graph.
 *
 * @example
 * ```bash
 * npx ts-node examples/query-procedures.ts
 * ```
 */

import {
  GraphDatabase,
  QueryEngine,
} from '@justice-os/knowledge-graph';
import type {
  QueryResult,
  Procedure,
  Statute,
} from '@justice-os/knowledge-graph';

async function queryEvictionProcedures(): Promise<void> {
  // 1. Connect to the graph database
  const db = new GraphDatabase({
    uri: process.env.NEO4J_URI ?? 'bolt://localhost:7687',
    credentials: {
      username: process.env.NEO4J_USER ?? 'neo4j',
      password: process.env.NEO4J_PASS ?? 'password',
    },
  });

  const query = new QueryEngine(db);

  // 2. Find all eviction procedures in Missouri
  const procedures: QueryResult = await query.findByType('Procedure', {
    jurisdiction: 'MO',
    caseType: 'eviction',
  });

  console.log(`Found ${procedures.nodes.length} eviction procedures in MO:\n`);

  for (const node of procedures.nodes) {
    const proc = node as Procedure;
    console.log(`  ${proc.name}`);
    console.log(`  Steps: ${proc.steps.length}`);
    console.log(`  Timeline: ${proc.timelineDays} days`);

    // 3. Find related statutes for each procedure
    const relatedStatutes = await query.findRelated(proc.id, 'REFERENCES');
    console.log(`  Related statutes:`);
    for (const statute of relatedStatutes.nodes) {
      const s = statute as Statute;
      console.log(`    - ${s.code} ${s.section}: ${s.title}`);
    }
    console.log();
  }

  // 4. Traverse from a specific statute to related resources
  const traversal = await query.traverseFrom('RSMo-535.010', {
    maxDepth: 3,
    edgeTypes: ['REFERENCES', 'REQUIRES', 'SERVED_BY'],
  });

  console.log(`Traversal from RSMo-535.010:`);
  console.log(`  Nodes visited: ${traversal.nodes.length}`);
  console.log(`  Edges traversed: ${traversal.edges.length}`);

  // 5. Find shortest path between two concepts
  const path = await query.shortestPath(
    'RSMo-535.010',
    'legal-aid-of-western-missouri',
  );

  console.log(`\nShortest path:`);
  console.log(`  ${path.nodes.map((n) => n.name).join(' -> ')}`);

  await db.close();
}

queryEvictionProcedures().catch(console.error);
