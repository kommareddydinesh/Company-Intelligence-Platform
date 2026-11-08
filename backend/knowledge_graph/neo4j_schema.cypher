// Neo4j Cypher Schema & Constraints Definition
// Enterprise Company Intelligence Platform

// 1. Unique Constraints
CREATE CONSTRAINT company_id_unique IF NOT EXISTS FOR (c:Company) REQUIRE c.id IS UNIQUE;
CREATE CONSTRAINT company_name_unique IF NOT EXISTS FOR (c:Company) REQUIRE c.name IS UNIQUE;
CREATE CONSTRAINT industry_name_unique IF NOT EXISTS FOR (i:Industry) REQUIRE i.name IS UNIQUE;
CREATE CONSTRAINT tech_name_unique IF NOT EXISTS FOR (t:Technology) REQUIRE t.name IS UNIQUE;
CREATE CONSTRAINT person_name_unique IF NOT EXISTS FOR (p:Person) REQUIRE p.name IS UNIQUE;
CREATE CONSTRAINT investor_name_unique IF NOT EXISTS FOR (inv:Investor) REQUIRE inv.name IS UNIQUE;
CREATE CONSTRAINT country_name_unique IF NOT EXISTS FOR (ctr:Country) REQUIRE ctr.name IS UNIQUE;
CREATE CONSTRAINT product_name_unique IF NOT EXISTS FOR (prd:Product) REQUIRE prd.name IS UNIQUE;

// 2. Indexes for Fast Graph Traversal
CREATE INDEX company_industry_idx IF NOT EXISTS FOR (c:Company) ON (c.industry);
CREATE INDEX company_country_idx IF NOT EXISTS FOR (c:Company) ON (c.country);
CREATE INDEX tech_category_idx IF NOT EXISTS FOR (t:Technology) ON (t.category);

// 3. Schema Documentation & Relationship Types Reference
// (c1:Company)-[:COMPETES_WITH {similarity_score}]->(c2:Company)
// (inv:Investor)-[:INVESTED_IN {round_type, amount_usd}]->(c:Company)
// (c:Company)-[:USES_TECHNOLOGY]->(t:Technology)
// (c:Company)-[:LOCATED_IN]->(ctr:Country)
// (c:Company)-[:OPERATES_IN]->(i:Industry)
// (c1:Company)-[:ACQUIRED {amount_usd, year}]->(c2:Company)
// (p:Person)-[:FOUNDED]->(c:Company)
// (c:Company)-[:OFFERS_PRODUCT]->(prd:Product)
