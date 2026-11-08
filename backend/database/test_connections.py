import asyncio
import logging
from backend.config import settings
from backend.database.postgres import engine
from backend.knowledge_graph.neo4j_client import neo4j_client
from backend.database.chroma import chroma_store

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ConnectionTester")

async def test_all_connections():
    logger.info("=== Testing Enterprise Database Connections ===")
    
    # 1. Test PostgreSQL
    try:
        async with engine.connect() as conn:
            result = await conn.execute("SELECT 1;")
            logger.info(f"✅ PostgreSQL Connection OK (Result: {result.scalar()})")
    except Exception as e:
        logger.error(f"❌ PostgreSQL Connection Failed: {e}")

    # 2. Test Neo4j
    try:
        await neo4j_client.connect()
        res = await neo4j_client.execute_query("RETURN 'Neo4j Connected!' AS msg;")
        logger.info(f"✅ Neo4j Graph Connection OK (Result: {res[0]['msg']})")
        await neo4j_client.close()
    except Exception as e:
        logger.error(f"❌ Neo4j Graph Connection Failed: {e}")

    # 3. Test ChromaDB
    try:
        chroma_store.initialize()
        col = chroma_store.get_collection()
        logger.info(f"✅ ChromaDB Vector Store OK (Collection Count: {col.count()})")
    except Exception as e:
        logger.error(f"❌ ChromaDB Vector Store Connection Failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_all_connections())
