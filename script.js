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
  return parseFloat(value.replace(/\./g, "").replace(/,/g, "")) || 0;
}

// Function to validate inputs
function validateInputs(income, expenses) {
  if (isNaN(income) || income <= 0) {
    alert("Please enter a valid income.");
    return false;
  }

  if (Object.values(expenses).some(exp => isNaN(exp) || exp < 0)) {
    alert("Please enter valid expenses.");
    return false;
  }

  return true;
}

// Main calculation logic and chart update
async function calculate() {
  const currency = document.getElementById("currency").value;
  const income = cleanCurrency(document.getElementById("income").value);
  const expenses = {
    Food: cleanCurrency(document.getElementById("expenses-makan").value),
    Transport: cleanCurrency(document.getElementById("expenses-transport").value),
    Entertainment: cleanCurrency(document.getElementById("expenses-hiburan").value),
    Others: cleanCurrency(document.getElementById("expenses-lainnya").value),
  };

  // Validate inputs
  if (!validateInputs(income, expenses)) return;

  // Fetch exchange rates
  const rates = await getExchangeRates(currency);
  if (!rates) {
    document.getElementById("result").textContent = "Failed to fetch exchange rates.";
    return;
  }

  // Convert income to IDR
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

  // Update chart
  const expensePercentages = Object.values(expenses).map(exp => (exp / incomeInIDR) * 100);
  updateFinanceChart(Object.keys(expenses), expensePercentages);
}

// Function to create or update the chart
let financeChart = null;

function updateFinanceChart(labels, data) {
  const ctx = document.getElementById("financeChart").getContext("2d");

  if (financeChart) {
    financeChart.destroy(); // Destroy the old chart if it exists
  }

  financeChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Expenses Percentage",
          data: data,
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const value = context.raw.toFixed(2);
              return `${value}% of income`;
            },
          },
        },
      },
    },
  });

  // Show the chart section
  document.getElementById("chart-section").style.display = "block";
}

// Add event listener to button
document.getElementById("calculate-btn").addEventListener("click", calculate);
