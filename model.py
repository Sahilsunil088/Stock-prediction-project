import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.linear_model import LinearRegression
from datetime import timedelta

class StockPredictor:
    def __init__(self, lookback=60):
        self.lookback = lookback
        self.scaler = MinMaxScaler(feature_range=(0, 1))
        self.model = LinearRegression()
    
    def prepare_data(self, df):
        # Use Close price for prediction
        data = df['Close'].values.reshape(-1, 1)
        scaled_data = self.scaler.fit_transform(data)
        
        X, y = [], []
        for i in range(self.lookback, len(scaled_data)):
            X.append(scaled_data[i-self.lookback:i, 0])
            y.append(scaled_data[i, 0])
        
        return np.array(X), np.array(y)

    def train_and_predict(self, df, days_ahead=30):
        # Prepare training data
        X, y = self.prepare_data(df)
        
        # Train model
        self.model.fit(X, y)
        
        # Make predictions
        last_sequence = df['Close'].values[-self.lookback:]
        last_sequence_scaled = self.scaler.transform(last_sequence.reshape(-1, 1)).flatten()
        
        predictions = []
        current_sequence = last_sequence_scaled.copy()
        
        last_date = pd.to_datetime(df['Date'].iloc[-1])
        
        for i in range(days_ahead):
            # Predict next value
            X_pred = current_sequence.reshape(1, -1)
            pred_scaled = self.model.predict(X_pred)[0]
            pred_price = self.scaler.inverse_transform([[pred_scaled]])[0][0]
            
            # Update sequence
            current_sequence = np.append(current_sequence[1:], pred_scaled)
            
            # Add to predictions
            pred_date = last_date + timedelta(days=i+1)
            predictions.append({
                'Date': pred_date.strftime('%Y-%m-%d'),
                'Predicted_Close': float(pred_price)
            })
        
        return predictions
