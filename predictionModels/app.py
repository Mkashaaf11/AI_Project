from flask import Flask, request, jsonify
import pickle
import pandas as pd

app = Flask(__name__)

# Load the Prophet model
with open('prophet_model.pkl', 'rb') as f:
    prophet_model = pickle.load(f)

# Load the XGBoost model
with open('xgboost_model.pkl', 'rb') as f:
    xgboost_model = pickle.load(f)

@app.route('/predict_prophet', methods=['POST'])
def predict_prophet():
    data = request.get_json(force=True)
    future_dates = prophet_model.make_future_dataframe(periods=12, freq='M')
    forecast = prophet_model.predict(future_dates)
    return jsonify(forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(12).to_dict(orient='records'))

@app.route('/predict_xgboost', methods=['POST'])
def predict_xgboost():
    data = request.get_json(force=True)
    # Example: Extract product ID and week numbers from request data
    product_id = data.get('product_id')
    num_weeks_in_month = 4
    week_numbers = list(range(1, num_weeks_in_month + 1))
    # Create DataFrame with product features
    product_features = pd.DataFrame({
        'ProductID': [product_id] * num_weeks_in_month,
        'WeekNumber': week_numbers
    })
    # Predict sales for the new month
    predicted_sales = xgboost_model.predict(product_features)
    # Format predictions
    predictions = [{'week': week, 'sales': sales} for week, sales in zip(week_numbers, predicted_sales)]
    return jsonify(predictions)

if __name__ == '__main__':
    app.run(debug=True)
