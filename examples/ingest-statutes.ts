/**
 * @fileoverview Ingest Missouri RSMo Statutes
 *
 * Demonstrates how to ingest Missouri Revised Statutes (RSMo)
 * Chapter 535 (Landlord-Tenant) into the Justice Knowledge Graph,
 * including parsing, entity extraction, and relationship mapping.
 *
 * @example
 * ```bash
 * npx ts-node examples/ingest-statutes.ts
 * ```
 */

import {
  GraphDatabase,
  IngestionPipeline,
  StatuteParser,
  EntityExtractor,
  RelationshipMapper,
} from '@justice-os/knowledge-graph';
import type { IngestionConfig } from '@justice-os/knowledge-graph/ingestion/pipeline';

async function ingestMissouriStatutes(): Promise<void> {
  // 1. Connect to the graph database
  const db = new GraphDatabase({
    uri: process.env.NEO4J_URI ?? 'bolt://localhost:7687',
    credentials: {
      username: process.env.NEO4J_USER ?? 'neo4j',
      password: process.env.NEO4J_PASSWORD ?? 'password',
    },
  });

  await db.connect();
  console.log('Connected to Neo4j');

  // 2. Create the ingestion pipeline
  const pipeline = new IngestionPipeline(db);

  // 3. Configure the ingestion run for RSMo Chapter 535
  const config: IngestionConfig = {
    sourceType: 'statute',
    source: '/data/rsmo/chapter-535-landlord-tenant.txt',
    jurisdiction: 'MO',
    overwrite: false,
    batchSize: 50,
  };

  // 4. Validate before ingesting
  const validationErrors = await pipeline.validate(config);
  if (validationErrors.length > 0) {
    console.error('Validation failed:', validationErrors);
    await db.disconnect();
    return;
  }

  console.log('Validation passed. Starting ingestion...');

  // 5. Run the ingestion pipeline
  const result = await pipeline.ingest(config);

  console.log('\n=== Ingestion Complete ===');
  console.log(`Nodes created: ${result.nodesCreated}`);
  console.log(`Edges created: ${result.edgesCreated}`);
  console.log(`Nodes updated: ${result.nodesUpdated}`);
  console.log(`Duration: ${result.durationMs}ms`);

  if (result.errors.length > 0) {
    console.log(`\nErrors (${result.errors.length}):`);
    for (const err of result.errors) {
      console.log(`  - [${err.source}] ${err.message}`);
    }
  }

  // 6. Verify by querying the graph
  const statutes = await db.query(
    'MATCH (s:Statute {code: $code}) RETURN s LIMIT 5',
    { code: 'RSMo' },
  );
  console.log(`\nVerification: found ${statutes.length} RSMo statutes in graph`);

  await db.disconnect();
  console.log('Done.');
}

ingestMissouriStatutes().catch(console.error);
