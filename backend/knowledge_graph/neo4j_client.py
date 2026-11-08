import logging
from neo4j import AsyncGraphDatabase, AsyncDriver
from backend.config import settings

logger = logging.getLogger(__name__)

class Neo4jClient:
    def __init__(self):
        self._driver: AsyncDriver = None

    async def connect(self):
        """Initializes the Neo4j Async Driver connection pool."""
        try:
            self._driver = AsyncGraphDatabase.driver(
                settings.NEO4J_URI,
                auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD)
            )
            logger.info("Connected to Neo4j Graph Database successfully.")
        except Exception as e:
            logger.error(f"Failed to connect to Neo4j Graph Database: {e}")
            raise e

    async def close(self):
        """Closes the Neo4j Driver pool."""
        if self._driver:
            await self._driver.close()
            logger.info("Closed Neo4j Graph Database connection.")

    async def execute_query(self, query: str, parameters: dict = None) -> list:
        """Executes a Cypher query asynchronously and returns record dictionaries."""
        if not self._driver:
            await self.connect()
        
        async with self._driver.session() as session:
            result = await session.run(query, parameters or {})
            records = await result.data()
            return records

neo4j_client = Neo4jClient()

async def get_neo4j_client() -> Neo4jClient:
    """Dependency injection helper for Neo4j client."""
    return neo4j_client
