import logging
import chromadb
from chromadb.config import Settings as ChromaSettings
from backend.config import settings

logger = logging.getLogger(__name__)

class ChromaVectorStore:
    def __init__(self):
        self.client = None
        self.collection = None

    def initialize(self):
        """Initializes ChromaDB HTTP client and gets/creates target collection."""
        try:
            # Connect to containerized or local HTTP server
            self.client = chromadb.HttpClient(
                host=settings.CHROMADB_HOST,
                port=settings.CHROMADB_PORT,
                settings=ChromaSettings(allow_reset=True, anonymized_telemetry=False)
            )
            self.collection = self.client.get_or_create_collection(
                name=settings.CHROMADB_COLLECTION_NAME,
                metadata={"hnsw:space": "cosine"}
            )
            logger.info(f"Initialized ChromaDB collection '{settings.CHROMADB_COLLECTION_NAME}' successfully.")
        except Exception as e:
            logger.warning(f"ChromaDB HTTP connection failed ({e}). Falling back to local PersistentClient.")
            self.client = chromadb.PersistentClient(path="./chroma_db_data")
            self.collection = self.client.get_or_create_collection(
                name=settings.CHROMADB_COLLECTION_NAME,
                metadata={"hnsw:space": "cosine"}
            )

    def get_collection(self):
        if not self.collection:
            self.initialize()
        return self.collection

chroma_store = ChromaVectorStore()
