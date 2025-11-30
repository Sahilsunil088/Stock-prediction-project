# 📈 Indian Stock Price Predictor

An AI-powered web application that predicts future stock prices of 100+ Indian companies using machine learning and 10 years of historical data.

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-3.0.0-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## 🌟 Features

- **100+ Indian Stocks**: Includes major companies like Reliance, TCS, Infosys, HDFC Bank, Suzlon Energy, and more
- **AI-Powered Predictions**: Uses Linear Regression model trained on historical data
- **10 Years of Data**: Fetches real-time historical data from Yahoo Finance
- **Interactive Charts**: Beautiful visualizations using Chart.js
- **Professional UI**: Clean, modern interface with company logos
- **Search Functionality**: Quickly find stocks by name or ticker symbol
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Demo

### Main Page
- Browse 100+ Indian stocks with company logos
- Search stocks by name or ticker
- Select prediction period (1-365 days)

### Prediction Page
- Real-time data fetching and model training
- Interactive price prediction charts
- Key metrics: Current Price, Predicted Price, Expected Change
- Historical data visualization

## 🛠️ Technologies Used

- **Backend**: Flask (Python)
- **Machine Learning**: scikit-learn (Linear Regression)
- **Data Source**: yfinance (Yahoo Finance API)
- **Frontend**: HTML5, CSS3, JavaScript
- **Charts**: Chart.js
- **Data Processing**: Pandas, NumPy

## 📦 Installation

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/indian-stock-predictor.git
cd indian-stock-predictor
```

2. **Install dependencies**
```bash
pip install -r requirements.txt
```

3. **Run the application**
```bash
python app.py
```

4. **Open your browser**
```
http://localhost:5000
```

## 📁 Project Structure

```
indian-stock-predictor/
├── app.py                      # Flask application
├── model.py                    # Machine learning model
├── indian_stocks.py            # List of 100+ Indian stocks
├── requirements.txt            # Python dependencies
├── static/
│   ├── index.html             # Main page
│   ├── style.css              # Main page styles
│   ├── script.js              # Main page logic
│   ├── predict.html           # Prediction page
│   ├── predict-style.css      # Prediction page styles
│   └── predict-script.js      # Prediction page logic
└── README.md                  # Documentation
```

## 🎯 How It Works

1. **Data Collection**: Fetches 10 years of historical stock data from Yahoo Finance
2. **Data Processing**: Normalizes and prepares data using MinMaxScaler
3. **Model Training**: Trains Linear Regression model with 60-day lookback window
4. **Prediction**: Generates future price predictions for specified days
5. **Visualization**: Displays results in interactive charts

## 📊 Supported Stocks

The application includes 100+ major Indian stocks across various sectors:

- **Banking & Finance**: HDFC Bank, ICICI Bank, SBI, Axis Bank, Kotak Mahindra
- **IT Services**: TCS, Infosys, Wipro, HCL Tech, Tech Mahindra
- **Energy**: Reliance Industries, ONGC, NTPC, Tata Power, Suzlon Energy
- **Automotive**: Maruti Suzuki, Tata Motors, Mahindra & Mahindra, Hero MotoCorp
- **Pharmaceuticals**: Sun Pharma, Dr Reddy's, Cipla, Lupin, Biocon
- **And many more...**

## ⚠️ Disclaimer

**This application is for educational purposes only and should not be considered as financial advice.**

- Stock market investments are subject to market risks
- Past performance does not guarantee future results
- Always consult with a qualified financial advisor before making investment decisions
- The predictions are based on historical data and may not reflect actual future prices

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Your Name - [Your GitHub Profile](https://github.com/YOUR_USERNAME)

## 🙏 Acknowledgments

- Yahoo Finance for providing historical stock data
- Chart.js for beautiful visualizations
- Clearbit for company logos
- Flask and scikit-learn communities

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Made with ❤️ for Indian Stock Market Enthusiasts**
