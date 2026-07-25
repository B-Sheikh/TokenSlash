import os

os.environ["XGBOOST_LOG_LEVEL"] = "1"
os.environ["XGBOOST_VERBOSITY"] = "0"

import json
import numpy as np
import pickle
import warnings

warnings.filterwarnings('ignore')

from sklearn.model_selection import train_test_split, KFold
from sklearn.ensemble import RandomForestRegressor, HistGradientBoostingRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# Optional XGBoost & LightGBM imports with robust scikit-learn fallbacks
try:
    from xgboost import XGBRegressor
    HAS_XGBOOST = True
except ImportError:
    HAS_XGBOOST = False

try:
    from lightgbm import LGBMRegressor
    HAS_LIGHTGBM = True
except ImportError:
    HAS_LIGHTGBM = False


def evaluate_model_performance(y_true, y_pred):
    """Calculates regression metrics: MAE, RMSE, R2 Score."""
    mae = mean_absolute_error(y_true, y_pred)
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    r2 = r2_score(y_true, y_pred)
    return {
        "mae": round(float(mae), 4),
        "rmse": round(float(rmse), 4),
        "r2": round(float(r2), 4)
    }


def train_and_select_best(X_train, y_train, X_val, y_val, X_test, y_test, target_name):
    """
    Trains Random Forest, XGBoost, and LightGBM for a specific target variable.
    Compares validation R2/MAE and returns the champion model.
    """
    print(f"\n========================================================")
    print(f" Training Candidate Models for Target: [{target_name}]")
    print(f"========================================================")

    candidates = {}

    # 1. Random Forest Regressor
    rf = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
    rf.fit(X_train, y_train)
    val_pred_rf = rf.predict(X_val)
    rf_metrics = evaluate_model_performance(y_val, val_pred_rf)
    candidates["RandomForest"] = {"model": rf, "val_metrics": rf_metrics}
    print(f"   [Random Forest] Val R²: {rf_metrics['r2']:.4f} | MAE: {rf_metrics['mae']:.4f} | RMSE: {rf_metrics['rmse']:.4f}")

    # 2. XGBoost Regressor (or GradientBoostingRegressor fallback)
    if HAS_XGBOOST:
        xgb = XGBRegressor(n_estimators=120, max_depth=6, learning_rate=0.05, random_state=42)
        xgb.fit(X_train, y_train, eval_set=[(X_val, y_val)], verbose=False)
        val_pred_xgb = xgb.predict(X_val)
        xgb_metrics = evaluate_model_performance(y_val, val_pred_xgb)
        candidates["XGBoost"] = {"model": xgb, "val_metrics": xgb_metrics}
        print(f"   [XGBoost]       Val R²: {xgb_metrics['r2']:.4f} | MAE: {xgb_metrics['mae']:.4f} | RMSE: {xgb_metrics['rmse']:.4f}")
    else:
        gb = GradientBoostingRegressor(n_estimators=120, max_depth=6, learning_rate=0.05, random_state=42)
        gb.fit(X_train, y_train)
        val_pred_gb = gb.predict(X_val)
        gb_metrics = evaluate_model_performance(y_val, val_pred_gb)
        candidates["GradientBoosting"] = {"model": gb, "val_metrics": gb_metrics}
        print(f"   [GradientBoost] Val R²: {gb_metrics['r2']:.4f} | MAE: {gb_metrics['mae']:.4f} | RMSE: {gb_metrics['rmse']:.4f}")

    # 3. LightGBM Regressor (or HistGradientBoostingRegressor fallback)
    if HAS_LIGHTGBM:
        lgb = LGBMRegressor(n_estimators=120, max_depth=6, learning_rate=0.05, random_state=42, verbose=-1)
        lgb.fit(X_train, y_train, eval_set=[(X_val, y_val)], callbacks=[])
        val_pred_lgb = lgb.predict(X_val)
        lgb_metrics = evaluate_model_performance(y_val, val_pred_lgb)
        candidates["LightGBM"] = {"model": lgb, "val_metrics": lgb_metrics}
        print(f"   [LightGBM]      Val R²: {lgb_metrics['r2']:.4f} | MAE: {lgb_metrics['mae']:.4f} | RMSE: {lgb_metrics['rmse']:.4f}")
    else:
        hgb = HistGradientBoostingRegressor(max_iter=120, max_depth=6, learning_rate=0.05, random_state=42)
        hgb.fit(X_train, y_train)
        val_pred_hgb = hgb.predict(X_val)
        hgb_metrics = evaluate_model_performance(y_val, val_pred_hgb)
        candidates["HistGradientBoosting"] = {"model": hgb, "val_metrics": hgb_metrics}
        print(f"   [HistGradBoost] Val R²: {hgb_metrics['r2']:.4f} | MAE: {hgb_metrics['mae']:.4f} | RMSE: {hgb_metrics['rmse']:.4f}")

    # Select champion based on highest validation R2
    best_algo = max(candidates.keys(), key=lambda k: candidates[k]["val_metrics"]["r2"])
    champion = candidates[best_algo]["model"]

    # Final Evaluation on Held-Out Test Set (15%)
    test_pred = champion.predict(X_test)
    test_metrics = evaluate_model_performance(y_test, test_pred)

    print(f"   [CHAMPION] for {target_name}: {best_algo} (Test R2: {test_metrics['r2']:.4f}, MAE: {test_metrics['mae']:.4f})")

    return {
        "algo": best_algo,
        "model": champion,
        "test_metrics": test_metrics,
        "val_metrics": candidates[best_algo]["val_metrics"]
    }


def execute_full_training(matrix_file_path, models_dir_path):
    """
    Main training execution script for the 3 target models.
    """
    print(f"Loading feature matrix from {matrix_file_path}...")
    with open(matrix_file_path, "r", encoding="utf-8") as f:
        matrix_data = json.load(f)

    rows = matrix_data.get("rows", [])
    if not rows:
        raise ValueError("Feature matrix is empty. Please run feature_extractor.py first.")

    target_keys = ["target_satisfaction", "target_retries", "target_latency"]
    feature_names = [k for k in rows[0].keys() if k not in target_keys]

    X = np.array([[r[f] for f in feature_names] for r in rows], dtype=np.float32)
    y_sat = np.array([r["target_satisfaction"] for r in rows], dtype=np.float32)
    y_ret = np.array([r["target_retries"] for r in rows], dtype=np.float32)
    y_lat = np.array([r["target_latency"] for r in rows], dtype=np.float32)

    # 70% Train / 15% Validation / 15% Test Split
    X_train_val, X_test, y_sat_tv, y_sat_test = train_test_split(X, y_sat, test_size=0.15, random_state=42)
    X_train, X_val, y_sat_train, y_sat_val = train_test_split(X_train_val, y_sat_tv, test_size=0.1765, random_state=42)

    _, _, y_ret_tv, y_ret_test = train_test_split(X, y_ret, test_size=0.15, random_state=42)
    _, _, y_ret_train, y_ret_val = train_test_split(X_train_val, y_ret_tv, test_size=0.1765, random_state=42)

    _, _, y_lat_tv, y_lat_test = train_test_split(X, y_lat, test_size=0.15, random_state=42)
    _, _, y_lat_train, y_lat_val = train_test_split(X_train_val, y_lat_tv, test_size=0.1765, random_state=42)

    os.makedirs(models_dir_path, exist_ok=True)

    # Train MODEL 1: Expected Satisfaction
    res_m1 = train_and_select_best(X_train, y_sat_train, X_val, y_sat_val, X_test, y_sat_test, "Model 1: Expected Satisfaction (0-100)")
    with open(os.path.join(models_dir_path, "model1_satisfaction.pkl"), "wb") as f:
        pickle.dump(res_m1["model"], f)

    # Train MODEL 2: Expected Retry Count
    res_m2 = train_and_select_best(X_train, y_ret_train, X_val, y_ret_val, X_test, y_ret_test, "Model 2: Expected Retry Count")
    with open(os.path.join(models_dir_path, "model2_retries.pkl"), "wb") as f:
        pickle.dump(res_m2["model"], f)

    # Train MODEL 3: Expected Latency
    res_m3 = train_and_select_best(X_train, y_lat_train, X_val, y_lat_val, X_test, y_lat_test, "Model 3: Expected Latency (sec)")
    with open(os.path.join(models_dir_path, "model3_latency.pkl"), "wb") as f:
        pickle.dump(res_m3["model"], f)

    # Save summary metadata
    summary = {
        "sampleSize": len(rows),
        "split": "70% Train / 15% Validation / 15% Test",
        "featureCount": len(feature_names),
        "featureNames": feature_names,
        "models": {
            "model1_satisfaction": {
                "algorithm": res_m1["algo"],
                "valMetrics": res_m1["val_metrics"],
                "testMetrics": res_m1["test_metrics"]
            },
            "model2_retries": {
                "algorithm": res_m2["algo"],
                "valMetrics": res_m2["val_metrics"],
                "testMetrics": res_m2["test_metrics"]
            },
            "model3_latency": {
                "algorithm": res_m3["algo"],
                "valMetrics": res_m3["val_metrics"],
                "testMetrics": res_m3["test_metrics"]
            }
        }
    }

    meta_file = os.path.join(models_dir_path, "model_metadata.json")
    with open(meta_file, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)

    print(f"\nAll 3 Machine Learning models successfully trained and saved to {models_dir_path}")
    return summary

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.abspath(__file__))
    matrix_path = os.path.join(base_dir, "..", "features", "feature_matrix.json")
    models_path = os.path.join(base_dir, "..", "models")
    execute_full_training(matrix_path, models_path)
