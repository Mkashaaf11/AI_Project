
from prophet import Prophet
import pandas as pd
import pickle

def train_prophet_model(data):
    data.rename(columns={'Year-Month':'ds','Total Price':'y'},inplace=True)
    data['ds']=pd.to_datetime(data['ds'])
    
    model=Prophet()
    model.fit(data)
    
    return model

def save_model(model,file_path):
    with open(file_path,'wb') as f:
        pickle.dump(model,f)

data = pd.read_csv('E:\productsales_data.csv')
prophet_model = train_prophet_model(data)

save_model(prophet_model,'prophet_model.pkl')


future_dates = prophet_model.make_future_dataframe(periods=12, freq='M')  # Predict for the next 12 months
forecast = prophet_model.predict(future_dates)

forecasted_values = forecast.set_index('ds').loc[data['ds'], 'yhat']
actual_values = data.set_index('ds')['y']
mape = (abs(actual_values - forecasted_values) / actual_values).mean() * 100

print("Mean Absolute Percentage Error (MAPE): {:.2f}%".format(mape))
