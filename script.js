// Function to fetch exchange rates
async function getExchangeRates(baseCurrency) {
    const apiKey = "7422384c65f2ec53c5f72ce4"; 
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      return data.conversion_rates;
    } catch (error) {
      console.error("Failed to fetch exchange rates", error);
      return null;
    }
  }
  
  // Function to clean and format currency input
  function cleanCurrency(value) {
    return parseFloat(value.replace(/\./g, "").replace(/,/g, ""));
  }
  
  // Main calculation logic
  async function calculate() {
    const currency = document.getElementById("currency").value;
    const income = cleanCurrency(document.getElementById("income").value);
    const expenses = {
      Makan: cleanCurrency(document.getElementById("expenses-makan").value) || 0,
      Transport: cleanCurrency(document.getElementById("expenses-transport").value) || 0,
      Hiburan: cleanCurrency(document.getElementById("expenses-hiburan").value) || 0,
      Lainnya: cleanCurrency(document.getElementById("expenses-lainnya").value) || 0,
    };
  
    // Fetch exchange rates
    const rates = await getExchangeRates(currency);
    if (!rates) {
      document.getElementById("result").textContent = "Failed to fetch exchange rates.";
      return;
    }
  
    // Convert income and expenses to IDR
    const incomeInIDR = income * rates["IDR"];
    const totalExpenses = Object.values(expenses).reduce((a, b) => a + b, 0);
    const remaining = incomeInIDR - totalExpenses;
  
    // Display the result
    const result = document.getElementById("result");
    result.innerHTML = `
      <p>Income in IDR: <span>Rp ${incomeInIDR.toLocaleString()}</span></p>
      <p>Total Expenses: <span>Rp ${totalExpenses.toLocaleString()}</span></p>
      <p>Remaining Money: <span>Rp ${remaining.toLocaleString()}</span></p>
    `;
  }
  
  // Add event listener to button
  document.getElementById("calculate-btn").addEventListener("click", calculate);


  // Impor Chart.js
// <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

let financeData = null; // Awalnya null (belum ada data)
let financeChart = null; // Grafik akan dibuat setelah data tersedia

// Fungsi untuk Membuat Grafik
function renderChart(data) {
  const ctx = document.getElementById('financeChart').getContext('2d');
  
  if (financeChart) {
    financeChart.destroy(); // Hapus grafik lama jika ada
  }
  
  financeChart = new Chart(ctx, {
    type: 'bar', // Bisa diubah jadi 'line', 'pie', dll.
    data: data,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Fungsi untuk Update Data Grafik
function updateFinanceData(userInput) {
  if (!financeData) {
    // Inisialisasi dataset jika belum ada
    financeData = {
      labels: ['Makanan', 'Transportasi', 'Hiburan', 'Tagihan', 'Tabungan'],
      datasets: [{
        label: 'Pengeluaran (IDR)',
        data: userInput,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }]
    };
  } else {
    // Update data jika grafik sudah ada
    financeData.datasets[0].data = userInput;
  }

  renderChart(financeData);
}

// Animasi Grafik saat Scroll
const chartSection = document.getElementById('chart-section');
let chartVisible = false;

window.addEventListener('scroll', () => {
  const rect = chartSection.getBoundingClientRect();
  const isInViewport = rect.top < window.innerHeight && rect.bottom >= 0;

  if (isInViewport && !chartVisible) {
    chartVisible = true; // Cegah animasi diulang
    chartSection.classList.add('visible');

    setTimeout(() => {
      if (!financeData) {
        console.warn('Belum ada data. Input data untuk melihat grafik!');
        return;
      }

      // Animasi data dari 0 ke nilai akhir
      const userInput = financeData.datasets[0].data; // Ambil data user
      let currentData = Array(userInput.length).fill(0); // Mulai dari 0
      let step = 0;

      const interval = setInterval(() => {
        step++;
        for (let i = 0; i < currentData.length; i++) {
          currentData[i] = Math.min(userInput[i] * step / 100, userInput[i]);
        }

        renderChart({
          ...financeData,
          datasets: [{ ...financeData.datasets[0], data: currentData }]
        });

        if (step >= 100) {
          clearInterval(interval); // Hentikan animasi
        }
      }, 20);
    }, 500); // Delay animasi setelah muncul
  }
});

// Simulasi Input Data (Contoh)
document.getElementById('calculate-btn').addEventListener('click', () => {
  // Masukkan data baru dari pengguna
  const userInput = [500000, 200000, 150000, 300000, 100000]; // Contoh data
  updateFinanceData(userInput);
});