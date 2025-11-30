let chart = null;
let stocks = [];
let selectedStock = null;

// Load available Indian stocks
async function loadStocks() {
    try {
        const response = await fetch('/api/stocks');
        const data = await response.json();
        stocks = data.stocks;
        displayStocksList(stocks);
    } catch (error) {
        console.error('Error loading stocks:', error);
        showError('Failed to load stock list');
    }
}

// Display stocks list
function displayStocksList(stocksToDisplay) {
    const stocksList = document.getElementById('stocksList');
    const stockCount = document.getElementById('stockCount');
    
    if (stocksToDisplay.length === 0) {
        stocksList.innerHTML = '<p class="no-results">No stocks found matching your search</p>';
        stockCount.textContent = '0 Stocks';
        return;
    }
    
    stockCount.textContent = `${stocksToDisplay.length} Stocks`;
    
    stocksList.innerHTML = stocksToDisplay.map((stock, index) => `
        <div class="stock-card" data-symbol="${stock.symbol}" onclick="selectStock('${stock.symbol}', '${stock.name}', '${stock.ticker}')">
            <span class="stock-number">${index + 1}</span>
            <div class="stock-logo">
                <img src="https://logo.clearbit.com/${getCompanyDomain(stock.name)}" 
                     alt="${stock.name}" 
                     onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(stock.name)}&background=2563eb&color=fff&size=56'">
            </div>
            <div class="stock-details">
                <div class="stock-name">${stock.name}</div>
                <div class="stock-ticker">${stock.ticker || stock.symbol}</div>
            </div>
            <svg class="stock-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
        </div>
    `).join('');
}

// Get company domain for logo
function getCompanyDomain(companyName) {
    const domainMap = {
        'Reliance Industries': 'ril.com',
        'Tata Consultancy Services': 'tcs.com',
        'HDFC Bank': 'hdfcbank.com',
        'Infosys': 'infosys.com',
        'ICICI Bank': 'icicibank.com',
        'Hindustan Unilever': 'hul.co.in',
        'State Bank of India': 'sbi.co.in',
        'Bharti Airtel': 'airtel.in',
        'ITC Limited': 'itcportal.com',
        'Kotak Mahindra Bank': 'kotak.com',
        'Larsen & Toubro': 'larsentoubro.com',
        'Axis Bank': 'axisbank.com',
        'HCL Technologies': 'hcltech.com',
        'Asian Paints': 'asianpaints.com',
        'Maruti Suzuki': 'marutisuzuki.com',
        'Bajaj Finance': 'bajajfinserv.in',
        'Wipro': 'wipro.com',
        'Ultratech Cement': 'ultratechcement.com',
        'Titan Company': 'titan.co.in',
        'Nestle India': 'nestle.in',
        'Sun Pharmaceutical': 'sunpharma.com',
        'Power Grid Corporation': 'powergrid.in',
        'Mahindra & Mahindra': 'mahindra.com',
        'Tata Steel': 'tatasteel.com',
        'Bajaj Finserv': 'bajajfinserv.in',
        'Tech Mahindra': 'techmahindra.com',
        'Adani Ports': 'adaniports.com',
        'NTPC Limited': 'ntpc.co.in',
        'JSW Steel': 'jsw.in',
        'Tata Motors': 'tatamotors.com',
        'IndusInd Bank': 'indusind.com',
        'Coal India': 'coalindia.in',
        'Cipla': 'cipla.com',
        'Grasim Industries': 'grasim.com',
        'Eicher Motors': 'eichermotors.com',
        'Hero MotoCorp': 'heromotocorp.com',
        'UPL Limited': 'upl-ltd.com',
        'Shree Cement': 'shreecement.com',
        'Britannia Industries': 'britannia.co.in',
        'Divis Laboratories': 'divislabs.com',
        'Adani Enterprises': 'adani.com',
        'Hindalco Industries': 'hindalco.com',
        'Bajaj Auto': 'bajajauto.com',
        'Dr Reddys Laboratories': 'drreddys.com',
        'ONGC': 'ongcindia.com',
        'Tata Consumer Products': 'tataconsumer.com',
        'SBI Life Insurance': 'sbilife.co.in',
        'HDFC Life Insurance': 'hdfclife.com',
        'Bharat Petroleum': 'bharatpetroleum.in',
        'Indian Oil Corporation': 'iocl.com',
        'Suzlon Energy': 'suzlon.com',
        'Adani Green Energy': 'adanigreenenergy.com',
        'Adani Power': 'adanipower.com',
        'Adani Transmission': 'adanitransmission.com',
        'Tata Power': 'tatapower.com',
        'JSW Energy': 'jsw.in',
        'Torrent Power': 'torrentpower.com',
        'Vedanta Limited': 'vedantalimited.com',
        'Jindal Steel & Power': 'jindalsteelpower.com',
        'Tata Chemicals': 'tatachemicals.com',
        'ACC Limited': 'acclimited.com',
        'Ambuja Cements': 'ambujacement.com',
        'Godrej Consumer Products': 'godrejcp.com',
        'Dabur India': 'dabur.com',
        'Marico Limited': 'marico.com',
        'Colgate-Palmolive India': 'colgate.co.in',
        'Pidilite Industries': 'pidilite.com',
        'Berger Paints': 'bergerpaints.com',
        'Havells India': 'havells.com',
        'Voltas Limited': 'voltas.com',
        'Blue Star': 'bluestarindia.com',
        'Dixon Technologies': 'dixoninfo.com',
        'Siemens India': 'siemens.com',
        'ABB India': 'abb.com',
        'Bosch Limited': 'bosch.in',
        'Cummins India': 'cummins.com',
        'Bharat Forge': 'bharatforge.com',
        'Motherson Sumi': 'motherson.com',
        'Apollo Tyres': 'apollotyres.com',
        'MRF Limited': 'mrftyres.com',
        'Ashok Leyland': 'ashokleyland.com',
        'TVS Motor Company': 'tvsmotor.com',
        'Escorts Limited': 'escortsgroup.com',
        'Lupin Limited': 'lupin.com',
        'Aurobindo Pharma': 'aurobindo.com',
        'Biocon Limited': 'biocon.com',
        'Torrent Pharmaceuticals': 'torrentpharma.com',
        'Alkem Laboratories': 'alkemlabs.com',
        'Glenmark Pharmaceuticals': 'glenmarkpharma.com',
        'Mankind Pharma': 'mankindpharma.com',
        'Apollo Hospitals': 'apollohospitals.com',
        'Max Healthcare': 'maxhealthcare.in',
        'Fortis Healthcare': 'fortishealthcare.com',
        'ICICI Prudential Life': 'iciciprulife.com',
        'Bandhan Bank': 'bandhanbank.com',
        'Federal Bank': 'federalbank.co.in',
        'IDFC First Bank': 'idfcfirstbank.com',
        'Yes Bank': 'yesbank.in',
        'Bank of Baroda': 'bankofbaroda.in',
        'Punjab National Bank': 'pnbindia.in',
        'Canara Bank': 'canarabank.com',
        'Union Bank of India': 'unionbankofindia.co.in',
        'Indian Bank': 'indianbank.in',
        'Bank of India': 'bankofindia.co.in'
    };
    
    return domainMap[companyName] || companyName.toLowerCase().replace(/\s+/g, '') + '.com';
}

// Search stocks
function searchStocks(query) {
    const filtered = stocks.filter(stock => 
        stock.name.toLowerCase().includes(query.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(query.toLowerCase())
    );
    displayStocksList(filtered);
}

// Select stock
function selectStock(symbol, name, ticker) {
    const daysAhead = document.getElementById('daysAhead').value;
    
    // Open prediction page in new window
    const url = `/predict.html?symbol=${encodeURIComponent(symbol)}&name=${encodeURIComponent(name)}&ticker=${encodeURIComponent(ticker)}&days=${daysAhead}`;
    window.open(url, '_blank');
}

// Predict stock prices
async function predictStockPrices() {
    const daysAhead = document.getElementById('daysAhead').value;
    
    if (!selectedStock) {
        showError('Please select a stock from the list');
        return;
    }
    
    showLoading(true);
    hideError();
    document.getElementById('results').style.display = 'none';
    document.getElementById('stockInfo').style.display = 'none';
    
    try {
        const response = await fetch('/api/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ symbol: selectedStock, days_ahead: daysAhead })
        });
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error);
        }
        
        displayResults(data);
    } catch (error) {
        showError('Error: ' + error.message);
    } finally {
        showLoading(false);
    }
}

function displayResults(data) {
    const { historical, predictions, stock_info } = data;
    
    // Display stock info
    const selectedStock = stocks.find(s => s.symbol === stock_info.symbol);
    document.getElementById('stockName').textContent = selectedStock ? selectedStock.name : stock_info.symbol;
    document.getElementById('stockSymbol').textContent = stock_info.symbol;
    document.getElementById('dataRange').textContent = `${stock_info.start_date} to ${stock_info.end_date} (${stock_info.data_points} days)`;
    document.getElementById('stockInfo').style.display = 'block';
    
    // Calculate statistics
    const currentPrice = historical[historical.length - 1].Close;
    const predictedPrice = predictions[predictions.length - 1].Predicted_Close;
    const change = ((predictedPrice - currentPrice) / currentPrice * 100).toFixed(2);
    
    document.getElementById('currentPrice').textContent = `₹${currentPrice.toFixed(2)}`;
    document.getElementById('predictedPrice').textContent = `₹${predictedPrice.toFixed(2)}`;
    document.getElementById('priceChange').textContent = `${change > 0 ? '+' : ''}${change}%`;
    document.getElementById('priceChange').style.color = change > 0 ? '#4caf50' : '#f44336';
    
    // Prepare chart data
    const historicalDates = historical.map(d => d.Date);
    const historicalPrices = historical.map(d => d.Close);
    const predictionDates = predictions.map(d => d.Date);
    const predictionPrices = predictions.map(d => d.Predicted_Close);
    
    // Create chart
    createChart(historicalDates, historicalPrices, predictionDates, predictionPrices);
    
    document.getElementById('results').style.display = 'block';
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
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.4
                },
                {
                    label: 'Predicted Prices',
                    data: [...Array(histDates.length).fill(null), histPrices[histPrices.length - 1], ...predPrices],
                    borderColor: '#f44336',
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'Stock Price History & Predictions',
                    font: { size: 16 }
                }
            },
            scales: {
                x: {
                    display: true,
                    ticks: {
                        maxTicksLimit: 10
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Price ($)'
                    }
                }
            }
        }
    });
}

function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function hideError() {
    document.getElementById('error').style.display = 'none';
}

// Event listeners
document.getElementById('searchInput').addEventListener('input', (e) => {
    searchStocks(e.target.value);
});

// Initialize
loadStocks();
