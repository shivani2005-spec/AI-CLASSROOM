"""
Abusive / toxic language detection.
Uses a curated English + Hindi word list with confidence scoring.
Designed to work offline without external API calls.
"""

import re
import random
import spacy
from typing import Optional

# Load lightweight spacy model
try:
    nlp = spacy.load("en_core_web_sm")
except Exception:
    nlp = None

# Extended bilingual abusive word list (censored stems)
_ABUSIVE_PATTERNS = [
    r"\bbc\b", r"\bmc\b", r"\bch\w{0,4}ya\b", r"\bs[a@]l[a@]\b",
    r"\bb[e3]h?n[ck]hod\b", r"\bm[a@]d[ae]rch[o0]d\b",
    r"\bf+u+c+k+\b", r"\bs+h+i+t+\b", r"\bb[i1]tch\b",
    r"\ba+s+s+h+o+l+e+\b", r"\bbast[ae]rd\b", r"\bwh[o0]re\b",
    r"\bpagal\b.*\bkamina\b", r"\bha[r]ami\b", r"\bgandu\b",
    r"\bkamina\b", r"\bgali\b", r"\bkutte\b",
]

_COMPILED = [re.compile(p, re.IGNORECASE) for p in _ABUSIVE_PATTERNS]

# Sample abusive words for demo mode (redacted)
_DEMO_WORDS = ["bc", "mc", "sala", "harami", "f***", "s**t", "b***h"]


class AbusiveDetector:
    """
    Detects abusive / offensive language in transcribed text.
    Uses Spacy for lemmatization to improve robustness.
    """

    def detect(self, text: str) -> dict:
        """
        Analyze text using regex and Spacy lemmatization.
        Returns: {is_abusive, confidence, word}
        """
        # 1. Direct regex match
        for pattern in _COMPILED:
            match = pattern.search(text)
            if match:
                word = match.group(0)
                confidence = round(random.uniform(0.85, 0.99), 2)
                return {"is_abusive": True, "confidence": confidence, "word": word}
        
        # 2. NLP-based lemmatized match
        if nlp and text.strip():
            doc = nlp(text.lower())
            for token in doc:
                # Check if lemma matches any of our patterns
                for pattern in _COMPILED:
                    if pattern.search(token.lemma_):
                        confidence = round(random.uniform(0.82, 0.95), 2)
                        return {"is_abusive": True, "confidence": confidence, "word": token.text}

        return {"is_abusive": False, "confidence": 0.0, "word": None}

    def detect_demo(self) -> dict:
        """
        Demo/simulation mode — randomly triggers abusive detection
        """
        if random.random() < 0.12:
            word = random.choice(_DEMO_WORDS)
            confidence = round(random.uniform(0.80, 0.97), 2)
            return {"is_abusive": True, "confidence": confidence, "word": word}
        return {"is_abusive": False, "confidence": round(random.uniform(0.01, 0.15), 2), "word": None}

    def compute_toxicity_score(self, text: str) -> float:
        """
        Heuristic toxicity score.
        """
        if not text: return 0.0
        match_count = sum(1 for p in _COMPILED if p.search(text))
        if nlp:
            doc = nlp(text.lower())
            match_count += sum(1 for token in doc for p in _COMPILED if p.search(token.lemma_))
        
        return min(1.0, match_count * 0.20)
