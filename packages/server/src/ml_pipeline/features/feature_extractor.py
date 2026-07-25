import os
import json
import re
import math
import numpy as np

# Standard phrase vocabulary list to guarantee vector dimensions
CORE_PHRASES = [
    "step by step", "think carefully", "chain of thought", "debug", "refactor",
    "optimize", "summarize", "translate", "research", "analyze", "reason",
    "mathematical proof", "write code", "system design", "architecture",
    "generate sql", "generate python", "react", "nextjs", "tensorflow",
    "qiskit", "quantum", "legal", "medical", "finance", "creative",
    "story", "email", "blog", "presentation", "powerpoint", "latex",
    "csv", "json", "api", "docker", "linux", "kubernetes",
    "machine learning", "deep learning", "computer vision", "nlp"
]

class TokenSlashFeatureExtractor:
    def __init__(self):
        self.phrases = CORE_PHRASES

    def extract_prompt_features(self, text):
        """Extracts structural, statistical, and density features from prompt text."""
        text = text or ""
        char_count = len(text)
        words = text.split()
        word_count = len(words)
        sentences = [s for s in re.split(r'[.!?]+', text) if s.strip()]
        sentence_count = max(1, len(sentences))
        est_tokens = int(word_count * 1.35) + 10

        # Densities (0.0 to 1.0)
        code_matches = len(re.findall(r'```|function|def\s|class\s|import\s|const\s|let\s|return|val\s|var\s|public\s|void', text))
        code_density = min(1.0, (code_matches * 5) / (word_count + 1))

        reasoning_matches = len(re.findall(r'why|because|proof|theorem|derive|explain|analyze|compare|evaluate|logic|deduce', text, re.I))
        reasoning_density = min(1.0, (reasoning_matches * 4) / (word_count + 1))

        math_matches = len(re.findall(r'[\+\-\*\/\=\^\∑\∫\√]|\b(math|equation|matrix|integral|derivative|algebra)\b', text, re.I))
        math_density = min(1.0, (math_matches * 4) / (word_count + 1))

        research_matches = len(re.findall(r'citation|study|paper|benchmark|literature|source|journal|evidence', text, re.I))
        research_density = min(1.0, (research_matches * 5) / (word_count + 1))

        summarization_matches = len(re.findall(r'summarize|tldr|bullet points|condense|digest|shorten', text, re.I))
        summarization_density = min(1.0, (summarization_matches * 5) / (word_count + 1))

        translation_matches = len(re.findall(r'translate|english|spanish|french|german|chinese|japanese', text, re.I))
        translation_density = min(1.0, (translation_matches * 5) / (word_count + 1))

        creative_matches = len(re.findall(r'story|poem|essay|character|narrative|fantasy|fiction', text, re.I))
        creative_density = min(1.0, (creative_matches * 5) / (word_count + 1))

        # Output requirements
        is_json_request = 1.0 if re.search(r'\bjson\b|```json|\{.*\}', text, re.I) else 0.0
        is_table_request = 1.0 if re.search(r'\btable\b|\bcsv\b|markdown table|\|.*\|', text, re.I) else 0.0
        is_cot_required = 1.0 if re.search(r'step by step|chain of thought|think carefully|explain your reasoning', text, re.I) else 0.0
        is_tool_usage = 1.0 if re.search(r'api|tool|function call|execute|web search|terminal', text, re.I) else 0.0
        is_multimodal = 1.0 if re.search(r'image|photo|video|audio|pdf|chart|diagram', text, re.I) else 0.0

        # Heuristic Complexity Score (1 - 10)
        complexity = 2
        if word_count > 60: complexity += 1
        if word_count > 200: complexity += 2
        if word_count > 450: complexity += 2
        if code_density > 0.15: complexity += 2
        if reasoning_density > 0.1: complexity += 1
        if math_density > 0.1: complexity += 2
        complexity = min(10, max(1, complexity))

        return {
            "charCount": char_count,
            "wordCount": word_count,
            "sentenceCount": sentence_count,
            "estTokens": est_tokens,
            "complexityScore": complexity,
            "codeDensity": code_density,
            "reasoningDensity": reasoning_density,
            "mathDensity": math_density,
            "researchDensity": research_density,
            "summarizationDensity": summarization_density,
            "translationDensity": translation_density,
            "creativeDensity": creative_density,
            "isJsonRequest": is_json_request,
            "isTableRequest": is_table_request,
            "isCotRequired": is_cot_required,
            "isToolUsage": is_tool_usage,
            "isMultimodal": is_multimodal
        }

    def extract_phrase_features(self, text):
        """Extracts n-gram NLP phrase indicators for technical intent learning."""
        text_lower = (text or "").lower()
        phrase_vec = {}
        for idx, phrase in enumerate(self.phrases):
            key = f"phrase_{phrase.replace(' ', '_')}"
            phrase_vec[key] = 1.0 if phrase in text_lower else 0.0
        return phrase_vec

    def extract_user_history_features(self, user_entries):
        """Extracts rolling behavioral history and preferences for a user."""
        if not user_entries:
            return {
                "avgPromptLength": 250,
                "avgComplexity": 4.5,
                "avgRetries": 0.2,
                "acceptanceRate": 0.92,
                "userCodeRatio": 0.25,
                "userVerbosity": 0.4,
                "monthlyVolume": 25,
                "userSatIndex": 88.0
            }
        
        n = len(user_entries)
        avg_len = sum(e.get("inputTokens", 200) for e in user_entries) / n
        avg_comp = sum(e.get("complexityScore", 5) for e in user_entries) / n
        avg_retries = sum(e.get("retriesCount", 0) for e in user_entries) / n
        acc_rate = sum(1.0 if e.get("satisfactionScore", 80) >= 70 else 0.0 for e in user_entries) / n
        code_count = sum(1.0 if e.get("taskType") == "code_generation" else 0.0 for e in user_entries)
        
        return {
            "avgPromptLength": avg_len,
            "avgComplexity": avg_comp,
            "avgRetries": avg_retries,
            "acceptanceRate": acc_rate,
            "userCodeRatio": code_count / n,
            "userVerbosity": min(1.0, avg_len / 600.0),
            "monthlyVolume": n,
            "userSatIndex": sum(e.get("satisfactionScore", 85) for e in user_entries) / n
        }

    def extract_model_features(self, model_meta, benchmark_meta):
        """Extracts pricing, performance, and benchmark scores for a model."""
        meta = model_meta or {}
        bench = benchmark_meta or {}
        return {
            "inputCostPerM": meta.get("inputCostPerM", 2.5),
            "outputCostPerM": meta.get("outputCostPerM", 10.0),
            "contextWindow": meta.get("contextWindow", 128000),
            "baseLatency": meta.get("avgLatencySec", 2.0),
            "codingScore": bench.get("codingScore", 85.0),
            "writingScore": bench.get("writingScore", 88.0),
            "reasoningScore": bench.get("reasoningScore", 85.0),
            "mathScore": bench.get("mathScore", 82.0),
            "visionScore": bench.get("visionScore", 80.0),
            "lmsysElo": bench.get("lmsysArenaElo", 1250),
            "sweBench": bench.get("sweBenchScore", 40.0),
            "reliabilityScore": bench.get("reliabilityScore", 93.0),
            "hallucinationRate": bench.get("hallucinationRate", 0.03)
        }

def build_feature_matrix(clean_dataset_path, output_matrix_path):
    """
    Constructs the complete tabular feature matrix for machine learning training.
    """
    print(f"Loading cleaned dataset from {clean_dataset_path}...")
    if not os.path.exists(clean_dataset_path):
        raise FileNotFoundError(f"Clean dataset file missing: {clean_dataset_path}")

    with open(clean_dataset_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    entries = data.get("entries", [])
    extractor = TokenSlashFeatureExtractor()

    # Load metadata benchmarks & pricing
    try:
        from ..dataset.fetch_public_datasets import get_official_pricing_data, get_ai_benchmark_scores
    except (ImportError, ValueError):
        import sys
        sys.path.append(os.path.abspath(os.path.join(base_dir, "..")))
        from dataset.fetch_public_datasets import get_official_pricing_data, get_ai_benchmark_scores
    pricing = get_official_pricing_data()
    benchmarks = get_ai_benchmark_scores()

    feature_rows = []

    for entry in entries:
        prompt_text = entry.get("promptText", "")
        assigned_model = entry.get("assignedModel", "gpt-4o")
        
        pf = extractor.extract_prompt_features(prompt_text)
        phf = extractor.extract_phrase_features(prompt_text)
        uhf = extractor.extract_user_history_features([entry])
        mf = extractor.extract_model_features(pricing.get(assigned_model, {}), benchmarks.get(assigned_model, {}))

        row = {}
        row.update(pf)
        row.update(phf)
        row.update(uhf)
        row.update(mf)

        # Targets
        row["target_satisfaction"] = float(entry.get("satisfactionScore", 85))
        row["target_retries"] = float(entry.get("retriesCount", 0))
        row["target_latency"] = float(entry.get("actualLatencySec", 2.0))

        feature_rows.append(row)

    output_pkg = {
        "featureCount": len(feature_rows[0]) - 3 if feature_rows else 0,
        "sampleCount": len(feature_rows),
        "rows": feature_rows
    }

    os.makedirs(os.path.dirname(output_matrix_path), exist_ok=True)
    with open(output_matrix_path, "w", encoding="utf-8") as f:
        json.dump(output_pkg, f, indent=2)

    print(f"Feature matrix successfully constructed and saved to {output_matrix_path} ({len(feature_rows)} samples)")
    return output_matrix_path

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.abspath(__file__))
    clean_path = os.path.join(base_dir, "..", "processed", "unified_tokenslash_dataset.json")
    out_matrix = os.path.join(base_dir, "feature_matrix.json")
    build_feature_matrix(clean_path, out_matrix)
