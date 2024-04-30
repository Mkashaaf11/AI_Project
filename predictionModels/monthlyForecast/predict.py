
import requests

# Define the data to be sent for prediction
data = {}  # You need to define the data to be sent here

# Send a POST request to the API endpoint
response = requests.post('http://127.0.0.1:5000/predict', json=data)

# Get the predictions
predictions = response.json()

print(predictions)
