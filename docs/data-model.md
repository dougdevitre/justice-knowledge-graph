# Data Model — Justice Knowledge Graph

Entity-relationship diagram showing the graph node types and their relationships.

```mermaid
erDiagram
    Statute {
        string id PK
        string title
        string code
        string section
        string text
        date effectiveDate
        date repealDate
        int version
        string jurisdictionId FK
    }

    Procedure {
        string id PK
        string name
        string description
        json steps
        int timelineDays
        string caseTypeId FK
        string jurisdictionId FK
    }

    CaseType {
        string id PK
        string name
        string category
        string description
        json aliases
    }

    Jurisdiction {
        string id PK
        string name
        string level "federal | state | county | city"
        string state
        string fipsCode
        string parentId FK
    }

    Court {
        string id PK
        string name
        string level
        string address
        string phone
        string jurisdictionId FK
    }

    Resource {
        string id PK
        string name
        string type
        string url
        string phone
        string address
    }

    Statute ||--o{ Statute : "REFERENCES"
    Statute ||--o| Statute : "SUPERSEDES"
    Statute ||--o| Statute : "AMENDS"
    Statute }o--|| Jurisdiction : "APPLIES_IN"
    Statute ||--o{ Procedure : "REQUIRES"

    Procedure }o--|| CaseType : "FOR_CASE_TYPE"
    Procedure }o--|| Jurisdiction : "APPLIES_IN"

    CaseType ||--o{ Resource : "SERVED_BY"
    Court }o--|| Jurisdiction : "LOCATED_IN"
    Court ||--o{ CaseType : "HANDLES"
    Resource }o--o{ Jurisdiction : "OPERATES_IN"
```

## Relationship Descriptions

| Relationship | Source | Target | Meaning |
|---|---|---|---|
| **REFERENCES** | Statute | Statute | Cross-reference citation between statutes |
| **SUPERSEDES** | Statute | Statute | Newer version replaces older version |
| **AMENDS** | Statute | Statute | Partial modification of a statute |
| **APPLIES_IN** | Statute/Procedure | Jurisdiction | Geographic applicability |
| **REQUIRES** | Statute | Procedure | Statute mandates a specific procedure |
| **FOR_CASE_TYPE** | Procedure | CaseType | Procedure applies to a specific case type |
| **SERVED_BY** | CaseType | Resource | Legal resource serving a case type |
| **LOCATED_IN** | Court | Jurisdiction | Court is physically located in a jurisdiction |
| **HANDLES** | Court | CaseType | Court has jurisdiction over a case type |
| **OPERATES_IN** | Resource | Jurisdiction | Resource provides services in a jurisdiction |
