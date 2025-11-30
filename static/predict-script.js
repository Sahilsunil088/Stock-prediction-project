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
    
    // Calculate moving averages for better analysis
    const ma20 = calculateMovingAverage(histPrices, 20);
    const ma50 = calculateMovingAverage(histPrices, 50);
    
    // Calculate confidence interval for predictions
    const upperBound = predPrices.map(price => price * 1.05);
    const lowerBound = predPrices.map(price => price * 0.95);
    
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [...histDates, ...predDates],
            datasets: [
                {
                    label: 'Historical Price',
                    data: [...histPrices, ...Array(predDates.length).fill(null)],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.05)',
                    borderWidth: 2.5,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#2563eb',
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 2,
                    tension: 0.1,
                    fill: true,
                    order: 1
                },
                {
                    label: '20-Day MA',
                    data: [...ma20, ...Array(predDates.length).fill(null)],
                    borderColor: '#10b981',
                    backgroundColor: 'transparent',
                    borderWidth: 1.5,
                    pointRadius: 0,
                    borderDash: [5, 5],
                    tension: 0.3,
                    order: 2
                },
                {
                    label: '50-Day MA',
                    data: [...ma50, ...Array(predDates.length).fill(null)],
                    borderColor: '#f59e0b',
                    backgroundColor: 'transparent',
                    borderWidth: 1.5,
                    pointRadius: 0,
                    borderDash: [5, 5],
                    tension: 0.3,
                    order: 3
                },
                {
                    label: 'AI Prediction',
                    data: [...Array(histDates.length).fill(null), histPrices[histPrices.length - 1], ...predPrices],
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    borderWidth: 3,
                    borderDash: [8, 4],
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#8b5cf6',
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 2,
                    tension: 0.2,
                    fill: true,
                    order: 0
                },
                {
                    label: 'Upper Confidence (95%)',
                    data: [...Array(histDates.length).fill(null), histPrices[histPrices.length - 1] * 1.05, ...upperBound],
                    borderColor: 'rgba(239, 68, 68, 0.3)',
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderDash: [2, 2],
                    pointRadius: 0,
                    tension: 0.2,
                    order: 4
                },
                {
                    label: 'Lower Confidence (95%)',
                    data: [...Array(histDates.length).fill(null), histPrices[histPrices.length - 1] * 0.95, ...lowerBound],
                    borderColor: 'rgba(239, 68, 68, 0.3)',
                    backgroundColor: 'rgba(239, 68, 68, 0.05)',
                    borderWidth: 1,
                    borderDash: [2, 2],
                    pointRadius: 0,
                    tension: 0.2,
                    fill: '-1',
                    order: 5
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
                    align: 'start',
                    labels: {
                        font: { 
                            size: 12,
                            family: 'Inter, sans-serif',
                            weight: '600'
                        },
                        padding: 15,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        boxWidth: 8,
                        boxHeight: 8
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    titleColor: '#fff',
                    bodyColor: '#cbd5e1',
                    borderColor: '#2563eb',
                    borderWidth: 1,
                    padding: 16,
                    titleFont: { 
                        size: 14,
                        weight: '700',
                        family: 'Inter, sans-serif'
                    },
                    bodyFont: { 
                        size: 13,
                        family: 'Inter, sans-serif'
                    },
                    displayColors: true,
                    boxWidth: 12,
                    boxHeight: 12,
                    boxPadding: 6,
                    callbacks: {
                        title: function(context) {
                            return 'Date: ' + context[0].label;
                        },
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += '₹' + context.parsed.y.toFixed(2);
                            }
                            return label;
                        },
                        afterBody: function(context) {
                            const index = context[0].dataIndex;
                            if (index > 0 && context[0].dataset.label === 'Historical Price') {
                                const currentPrice = context[0].parsed.y;
                                const previousPrice = context[0].dataset.data[index - 1];
                                if (previousPrice) {
                                    const change = ((currentPrice - previousPrice) / previousPrice * 100).toFixed(2);
                                    return '\nChange: ' + (change > 0 ? '+' : '') + change + '%';
                                }
                            }
                            return '';
                        }
                    }
                },
                annotation: {
                    annotations: {
                        line1: {
                            type: 'line',
                            xMin: histDates.length - 1,
                            xMax: histDates.length - 1,
                            borderColor: '#64748b',
                            borderWidth: 2,
                            borderDash: [6, 6],
                            label: {
                                display: true,
                                content: 'Prediction Start',
                                position: 'start',
                                backgroundColor: '#64748b',
                                color: '#fff',
                                font: {
                                    size: 11,
                                    weight: '600'
                                }
                            }
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.03)',
                        drawBorder: false
                    },
                    ticks: {
                        maxTicksLimit: 15,
                        font: { 
                            size: 11,
                            family: 'Inter, sans-serif'
                        },
                        color: '#64748b',
                        maxRotation: 45,
                        minRotation: 0
                    },
                    border: {
                        display: false
                    }
                },
                y: {
                    display: true,
                    position: 'right',
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        font: { 
                            size: 11,
                            family: 'Inter, sans-serif',
                            weight: '600'
                        },
                        color: '#64748b',
                        padding: 10,
                        callback: function(value) {
                            return '₹' + value.toLocaleString('en-IN', {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            });
                        }
                    },
                    border: {
                        display: false
                    }
                }
            }
        }
    });
}

// Calculate moving average
function calculateMovingAverage(data, period) {
    const result = [];
    for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
            result.push(null);
        } else {
            const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
            result.push(sum / period);
        }
    }
    return result;
}

function showError(message) {
    document.getElementById('loading').style.display = 'none';
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}
