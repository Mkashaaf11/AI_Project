from flask import Flask, request, jsonify
import pickle
import pandas as pd

app = Flask(__name__)

data_weekly = pd.read_csv("E:/data_weekly.csv")
# Load the Prophet model
with open('prophet_model.pkl', 'rb') as f:
    prophet_model = pickle.load(f)

# Load the XGBoost model
with open('ProductForecast.pkl', 'rb') as f:
    xgboost_model = pickle.load(f)
@app.route('/predict_prophet', methods=['POST'])
def predict_prophet():
    data = request.get_json(force=True)
    future_dates = prophet_model.make_future_dataframe(periods=12, freq='M')
    forecast = prophet_model.predict(future_dates)
    return jsonify(forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(12).to_dict(orient='records'))

@app.route('/predict_xgboost', methods=['POST'])
def predict_xgboost():
    try:
        requestData = request.get_json()
       
        productID = requestData['features']['ProductID']
        print(productID)
        numWeeksInMonth = list(range(1, 5))
    
    # Filter data for the specified productId
        productData = data_weekly[data_weekly['ProductID'] == productID]
    
    # Extract features for the specified product
        productFeatures = productData.drop(['Date', 'Sales'], axis=1)
    
    # Predict sales for the new month
        predicted_sales = xgboost_model.predict(productFeatures)
        
        predicted_sales = [float(sale) for sale in predicted_sales]
       
        # Format predictions
        predictions = [{'week': week, 'sales': sales} for week, sales in zip(numWeeksInMonth, predicted_sales)]

        return jsonify(predictions)
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
