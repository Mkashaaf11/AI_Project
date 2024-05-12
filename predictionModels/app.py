from flask import Flask, request, jsonify
import pickle
import pandas as pd
from tensorflow.keras.models import load_model
from tensorflow.keras.initializers import Orthogonal


app = Flask(__name__)

data_weekly = pd.read_csv("E:/data_weekly.csv")
data = pd.read_csv("E:/product_sales_data(lstm).csv")
data['Date'] = pd.to_datetime(data['Date'])
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

@app.route('/predict_restock_date/<int:product_id>', methods=['POST'])
def predict_restock_date(product_id):
    try:
        filename = f"RestockPredictionProduct_{product_id}.pkl"
        print("hello")
        print("Attempting to load model...")
        # Load the corresponding model
        model = pickle.load(open(filename, 'rb')) 
        print("Model loaded successfully.")
        product_data = data[data['ProductID'] == product_id ].drop(columns=['Date', 'ProductID'])
        newdata = product_data.iloc[-7:, :].values
        inventory = 200
        date_dt = pd.to_datetime('2024-04-24')
        i = 0

        for _ in range(15):
            next_day_prediction = model.predict(newdata.reshape(1, 7, 6))
            # Get the features of the row above (excluding the "Sales" column)
            features_of_previous_row = newdata[-1, 1:]
            # Combine the features of the previous row with the prediction for the next day
            next_data_point = np.concatenate((next_day_prediction, features_of_previous_row), axis=None)
 # Append the next data point to the list of input data
            newdata = np.append(newdata, next_data_point.reshape(1, 6), axis=0)
            newdata = newdata[1:]
 # Append the prediction to the list of predicted values
            inventory = inventory - math.ceil(next_day_prediction[0][0])
            if inventory > 0:
                i = i + 1
        
        next_date = date_dt + timedelta(days=i)
        print(next_date.strftime('%Y-%m-%d'))
        return jsonify({'restock_date': next_date.strftime('%Y-%m-%d')})
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
