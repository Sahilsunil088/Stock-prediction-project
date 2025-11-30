let chart = null;

// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const stockSymbol = urlParams.get('symbol');
const daysAhead = urlParams.get('days') || 30;

// Load prediction on page load
if (stockSymbol) {
    loadPrediction();
} else {
    showError('No stock selected. Please go back and select a stock.');
}

async function loadPrediction() {
    try {
        const response = await fetch('/api/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ symbol: stockSymbol, days_ahead: parseInt(daysAhead) })
        });
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error);
        }
        
        displayResults(data);
    } catch (error) {
        showError('Error: ' + error.message);
    }
}

function displayResults(data) {
    const { historical, predictions, stock_info } = data;
    
    // Hide loading
    document.getElementById('loading').style.display = 'none';
    document.getElementById('results').style.display = 'block';
    
    // Get stock details from URL or data
    const stockName = urlParams.get('name') || stock_info.symbol;
    const stockTicker = urlParams.get('ticker') || stock_info.symbol.replace('.NS', '');
    
    // Display stock info
    document.getElementById('stockName').textContent = stockName;
    document.getElementById('stockTicker').textContent = stockTicker;
    document.getElementById('dataRange').textContent = 
        `Historical Data: ${stock_info.start_date} to ${stock_info.end_date} (${stock_info.data_points} trading days)`;
    
    // Calculate statistics
    const currentPrice = historical[historical.length - 1].Close;
    const predictedPrice = predictions[predictions.length - 1].Predicted_Close;
    const change = ((predictedPrice - currentPrice) / currentPrice * 100).toFixed(2);
    
    document.getElementById('currentPrice').textContent = `₹${currentPrice.toFixed(2)}`;
    document.getElementById('predictedPrice').textContent = `₹${predictedPrice.toFixed(2)}`;
    document.getElementById('priceChange').textContent = `${change > 0 ? '+' : ''}${change}%`;
    document.getElementById('priceChange').style.color = change > 0 ? '#10b981' : '#ef4444';
    document.getElementById('predictionDays').textContent = `${daysAhead} Days`;
    
    // Prepare chart data
    const historicalDates = historical.map(d => d.Date);
    const historicalPrices = historical.map(d => d.Close);
    const predictionDates = predictions.map(d => d.Date);
    const predictionPrices = predictions.map(d => d.Predicted_Close);
    
    // Create chart
    createChart(historicalDates, historicalPrices, predictionDates, predictionPrices);
}

function createChart(histDates, histPrices, predDates, predPrices) {
    const ctx = document.getElementById('stockChart').getContext('2d');
    
    if (chart) {
        chart.destroy();
    }
    
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [...histDates, ...predDates],
            datasets: [
                {
                    label: 'Historical Prices',
                    data: [...histPrices, ...Array(predDates.length).fill(null)],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    pointRadius: 0,
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Predicted Prices',
                    data: [...Array(histDates.length).fill(null), histPrices[histPrices.length - 1], ...predPrices],
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    borderWidth: 3,
                    borderDash: [10, 5],
                    pointRadius: 0,
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: { size: 14 },
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { size: 14 },
                    bodyFont: { size: 13 },
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ₹' + context.parsed.y.toFixed(2);
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxTicksLimit: 12,
                        font: { size: 12 }
                    }
                },
                y: {
                    display: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: { size: 12 },
                        callback: function(value) {
                            return '₹' + value.toFixed(0);
                        }
                    }
                }
            }
        }
    });
}

function showError(message) {
    document.getElementById('loading').style.display = 'none';
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}
