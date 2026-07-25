import os
import json
import numpy as np

def calculate_promptiq_score(
    predicted_satisfaction,
    predicted_retries,
    predicted_latency,
    estimated_cost,
    hidden_retry_cost,
    model_capability_fit,
    weights=None,
    business_constraints=None
):
    """
    Mathematically sound multi-objective PromptIQ Score formula.
    
    Formula:
      TotalCost = Cost + HiddenRetryCost
      NormSat   = Satisfaction / 100
      NormCost  = min(1.0, TotalCost / BaselineCostRef)
      NormLat   = min(1.0, Latency / 10.0)
      NormRetry = min(1.0, Retries / 3.0)
      NormFit   = CapabilityFit / 100
      
      Score = 100 * (w_s * NormSat + w_f * NormFit - w_c * NormCost - w_l * NormLat - w_r * NormRetry)
    """
    if weights is None:
        weights = {
            "w_satisfaction": 0.35,
            "w_capability_fit": 0.25,
            "w_cost": 0.20,
            "w_latency": 0.10,
            "w_retry": 0.10
        }

    bc = business_constraints or {}

    total_cost = estimated_cost + hidden_retry_cost
    norm_sat = max(0.0, min(1.0, predicted_satisfaction / 100.0))
    norm_fit = max(0.0, min(1.0, model_capability_fit / 100.0))

    # Reference normalizers
    baseline_ref_cost = bc.get("maxCostPerRequest", 0.05) or 0.02
    norm_cost = min(1.0, total_cost / max(0.0001, baseline_ref_cost))
    norm_lat = min(1.0, predicted_latency / 10.0)
    norm_retry = min(1.0, predicted_retries / 3.0)

    # Weighted sum
    w_sum = (
        weights["w_satisfaction"] * norm_sat +
        weights["w_capability_fit"] * norm_fit -
        weights["w_cost"] * norm_cost -
        weights["w_latency"] * norm_lat -
        weights["w_retry"] * norm_retry
    )

    # Rescale to 0 - 100
    total_w = sum(weights.values())
    raw_score = (w_sum / max(0.01, total_w)) * 100.0

    # Business Constraint Penalties
    penalty = 0.0
    if bc.get("maxBudgetMonthly") and total_cost * 30 * 25 > bc["maxBudgetMonthly"]:
        penalty += 15.0
    if bc.get("maxLatencySec") and predicted_latency > bc["maxLatencySec"]:
        penalty += 20.0
    if bc.get("minQualityThreshold") and model_capability_fit < bc["minQualityThreshold"]:
        penalty += 25.0

    final_score = max(0.0, min(100.0, raw_score - penalty))
    return round(final_score, 2)
