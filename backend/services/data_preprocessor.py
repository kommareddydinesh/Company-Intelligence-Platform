import re
import string
from typing import Dict, Any, List, Set

class DataPreprocessor:
    def __init__(self):
        # Common English stop words
        self.stop_words: Set[str] = {
            "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", 
            "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", 
            "by", "can", "did", "do", "does", "doing", "down", "during", "each", "few", "for", "from", 
            "further", "had", "has", "have", "having", "he", "her", "here", "hers", "herself", "him", 
            "himself", "his", "how", "i", "if", "in", "into", "is", "it", "its", "itself", "just", 
            "me", "more", "most", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", 
            "only", "or", "other", "our", "ours", "ourselves", "out", "over", "own", "same", "she", 
            "should", "so", "some", "such", "than", "that", "the", "their", "theirs", "them", 
            "themselves", "then", "there", "these", "they", "this", "those", "through", "to", "too", 
            "under", "until", "up", "very", "was", "we", "were", "what", "when", "where", "which", 
            "while", "who", "whom", "why", "with", "would", "you", "your", "yours", "yourself"
        }

    def clean_text(self, text: str) -> str:
        """Removes extra whitespaces, HTML tags, and normalizes unicode characters."""
        if not text:
            return ""
        # Strip HTML tags
        text = re.sub(r'<[^>]+>', ' ', text)
        # Standardize multiple spaces and line breaks
        text = re.sub(r'\s+', ' ', text)
        return text.strip()

    def extract_keywords(self, text: str, top_n: int = 8) -> List[str]:
        """Extracts key business and technical terms from text using frequency distribution."""
        cleaned = self.clean_text(text).lower()
        # Remove punctuation
        translator = str.maketrans('', '', string.punctuation)
        words = cleaned.translate(translator).split()
        
        # Filter stop words and short tokens
        tokens = [w for w in words if w not in self.stop_words and len(w) > 2]
        
        # Word frequencies
        freq: Dict[str, int] = {}
        for token in tokens:
            freq[token] = freq.get(token, 0) + 1
            
        sorted_keywords = sorted(freq.items(), key=lambda x: x[1], reverse=True)
        return [k for k, v in sorted_keywords[:top_n]]

    def extract_named_entities(self, text: str) -> Dict[str, List[str]]:
        """Rule-based and regex entity extraction for tech stacks, amounts, and dates."""
        tech_pattern = r'\b(GPU|CUDA|TensorFlow|PyTorch|Kubernetes|Spark|Delta Lake|React|Ruby|Python|Go|Rust|PostgreSQL|Vector Search|LLMs|Transformers|RLHF)\b'
        money_pattern = r'\$\d+(?:\.\d+)?\s*(?:billion|million|B|M|Trillion|T)?'
        
        technologies = list(set(re.findall(tech_pattern, text, re.IGNORECASE)))
        amounts = list(set(re.findall(money_pattern, text)))

        return {
            "technologies": technologies,
            "financial_amounts": amounts
        }

    def preprocess_company_data(self, company: Dict[str, Any]) -> Dict[str, Any]:
        """Main cleaning & enrichment pipeline for a raw company record."""
        cleaned_company = dict(company)
        
        # Clean text fields
        cleaned_company["name"] = self.clean_text(company.get("name", ""))
        cleaned_company["industry"] = self.clean_text(company.get("industry", ""))
        cleaned_company["description"] = self.clean_text(company.get("description", ""))
        
        # Normalize numeric defaults
        cleaned_company["employee_count"] = max(0, int(company.get("employee_count", 0)))
        cleaned_company["revenue_usd"] = max(0.0, float(company.get("revenue_usd", 0.0)))
        cleaned_company["total_funding_usd"] = max(0.0, float(company.get("total_funding_usd", 0.0)))
        cleaned_company["valuation_usd"] = max(0.0, float(company.get("valuation_usd", 0.0)))

        # Clean list fields
        cleaned_company["products"] = [self.clean_text(p) for p in company.get("products", []) if p]
        cleaned_company["technologies"] = [self.clean_text(t) for t in company.get("technologies", []) if t]
        cleaned_company["competitors"] = [self.clean_text(c) for c in company.get("competitors", []) if c]
        cleaned_company["investors"] = [self.clean_text(i) for i in company.get("investors", []) if i]
        cleaned_company["founders"] = [self.clean_text(f) for f in company.get("founders", []) if f]

        # Extract enriched keywords
        extracted_kw = self.extract_keywords(cleaned_company["description"])
        cleaned_company["extracted_keywords"] = extracted_kw

        return cleaned_company

preprocessor = DataPreprocessor()
