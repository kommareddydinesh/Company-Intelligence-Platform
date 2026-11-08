import logging
from typing import List, Union
import numpy as np
from sentence_transformers import SentenceTransformer
from backend.config import settings

logger = logging.getLogger(__name__)

class EmbeddingService:
    def __init__(self):
        self.model_name = settings.EMBEDDING_MODEL_NAME
        self.dimension = settings.EMBEDDING_DIMENSION
        self._model = None
        self._cache: dict = {}

    def _load_model(self):
        if self._model is None:
            logger.info(f"Loading Sentence Transformer embedding model '{self.model_name}'...")
            try:
                self._model = SentenceTransformer(self.model_name)
                logger.info(f"Embedding model '{self.model_name}' loaded successfully.")
            except Exception as e:
                logger.warning(f"Failed to load '{self.model_name}' from HuggingFace ({e}). Falling back to 'all-MiniLM-L6-v2'.")
                self._model = SentenceTransformer("all-MiniLM-L6-v2")

    def generate_embedding(self, text: str) -> List[float]:
        """Generates a single dense vector embedding with instant in-memory cache lookup."""
        clean_key = text.strip().lower()
        if clean_key in self._cache:
            return self._cache[clean_key]

        self._load_model()
        if not text.strip():
            return [0.0] * self.dimension

        embedding = self._model.encode(text, convert_to_numpy=True, normalize_embeddings=True).tolist()
        # Cache up to 1000 items
        if len(self._cache) < 1000:
            self._cache[clean_key] = embedding
        return embedding

    def generate_batch_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Batch generates vector embeddings for a list of text strings."""
        self._load_model()
        if not texts:
            return []
        embeddings = self._model.encode(texts, batch_size=32, convert_to_numpy=True, normalize_embeddings=True)
        return embeddings.tolist()

embedding_service = EmbeddingService()
