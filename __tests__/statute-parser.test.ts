/**
 * @fileoverview Tests for StatuteParser
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { StatuteParser } from '../src/ingestion/statute-parser';

describe('StatuteParser', () => {
  let parser: StatuteParser;

  beforeEach(() => {
    parser = new StatuteParser();
  });

  describe('parse', () => {
    it('should accept raw text and a code identifier', async () => {
      await expect(
        parser.parse('535.010. Definitions...', 'RSMo'),
      ).rejects.toThrow('Not implemented');
    });

    it('should return an array of Statute objects', async () => {
      // TODO: Once implemented, verify Statute[] shape
      expect(true).toBe(true);
    });
  });

  describe('extractSections', () => {
    it('should split text on section number patterns', () => {
      const text = '535.010. Definitions. Text here. 535.020. Applicability. More text.';
      const sections = parser.extractSections(text);
      expect(sections.length).toBeGreaterThanOrEqual(2);
    });

    it('should handle empty text', () => {
      const sections = parser.extractSections('');
      expect(sections).toHaveLength(0);
    });

    it('should handle text without section numbers', () => {
      const sections = parser.extractSections('This is just plain text without sections.');
      expect(sections.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('extractCitations', () => {
    it('should find section references in text', () => {
      const text = 'As defined in section 535.010, the landlord must comply with 535.020.';
      const citations = parser.extractCitations(text, 'RSMo');
      expect(citations).toHaveLength(2);
      expect(citations[0].section).toBe('535.010');
      expect(citations[1].section).toBe('535.020');
    });

    it('should capture the offset of each citation', () => {
      const text = 'See section 535.010 for details.';
      const citations = parser.extractCitations(text, 'RSMo');
      expect(citations[0].offset).toBeGreaterThanOrEqual(0);
    });

    it('should return empty array when no citations present', () => {
      const citations = parser.extractCitations('No references here.', 'RSMo');
      expect(citations).toHaveLength(0);
    });

    it('should handle RSMo-prefixed citations', () => {
      const text = 'Under RSMo 535.300, the deposit must be returned.';
      const citations = parser.extractCitations(text, 'RSMo');
      expect(citations).toHaveLength(1);
      expect(citations[0].section).toBe('535.300');
    });
  });

  describe('extractDefinitions', () => {
    it('should find quoted term definitions', () => {
      const text = '"Landlord" means the owner of the dwelling unit. "Tenant" means the occupant.';
      const defs = parser.extractDefinitions(text, '535.010');
      expect(defs).toHaveLength(2);
      expect(defs[0].term).toBe('Landlord');
      expect(defs[1].term).toBe('Tenant');
    });

    it('should return empty array when no definitions found', () => {
      const defs = parser.extractDefinitions('No definitions here.', '535.010');
      expect(defs).toHaveLength(0);
    });
  });
});
