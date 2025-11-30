from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os
import json
from model import StockPredictor
from indian_stocks import INDIAN_STOCKS
import yfinance as yf

app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)

predictor = StockPredictor()

@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/api/stocks', methods=['GET'])
def get_stocks():
    return jsonify({'stocks': INDIAN_STOCKS})

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        stock_symbol = data.get('symbol')
        days_ahead = int(data.get('days_ahead', 30))
        
        if not stock_symbol:
            return jsonify({'error': 'Stock symbol is required'}), 400
        
        # Download 10 years of historical data
        end_date = datetime.now()
        start_date = end_date - timedelta(days=3650)  # 10 years
        
        print(f"Fetching data for {stock_symbol}...")
        stock_data = yf.download(stock_symbol, start=start_date, end=end_date, progress=False)
        
        if stock_data.empty:
            return jsonify({'error': f'No data found for {stock_symbol}'}), 404
        
        # Prepare dataframe
        df = stock_data.reset_index()
        
        # Handle multi-level columns from yfinance
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.get_level_values(0)
        
        # Rename columns to standard format
        column_mapping = {
            'Date': 'Date',
            'Open': 'Open',
            'High': 'High',
            'Low': 'Low',
            'Close': 'Close',
            'Adj Close': 'Adj Close',
            'Volume': 'Volume'
        }
        
        # Keep only required columns
        df = df[['Date', 'Open', 'High', 'Low', 'Close', 'Volume']]
        df['Date'] = pd.to_datetime(df['Date'])
        df = df.sort_values('Date')
        df = df.dropna()  # Remove any rows with missing data
        
        # Train model and predict
        predictions = predictor.train_and_predict(df, days_ahead)
        
        # Prepare response - last 365 days of historical data
        historical_data = df.tail(365).to_dict('records')
        
        # Convert dates to strings for JSON
        for item in historical_data:
            item['Date'] = item['Date'].strftime('%Y-%m-%d')
        
        return jsonify({
            'historical': historical_data,
            'predictions': predictions,
            'stock_info': {
                'symbol': stock_symbol,
                'data_points': len(df),
                'start_date': df['Date'].min().strftime('%Y-%m-%d'),
                'end_date': df['Date'].max().strftime('%Y-%m-%d')
            },
            'success': True
        })
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e), 'success': False}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
