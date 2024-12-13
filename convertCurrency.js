async function convertCurrency() {
  const rawAmount = document.getElementById('amount').value;
  const fromCurrency = document.getElementById('fromCurrency').value;
  const toCurrency = document.getElementById('toCurrency').value;
  const resultDiv = document.querySelector('.converter #result');

  // Bersihkan input angka (titik ribuan dan koma desimal)
  const normalizedAmount = rawAmount
    .replace(/[^0-9.,]/g, '') // Hanya izinkan angka, titik, dan koma
    .replace(/,/g, '')        // Hilangkan semua koma
    .replace(/\./g, '');      // Hilangkan titik ribuan

  const amount = parseFloat(normalizedAmount);
  if (isNaN(amount) || amount <= 0) {
    resultDiv.textContent = 'Please enter a valid amount.';
    return;
  }

  try {
    // API Key dan Endpoint
    const apiKey = '7422384c65f2ec53c5f72ce4';
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`);
    const data = await response.json();

    if (data.conversion_rates[toCurrency]) {
      const rate = data.conversion_rates[toCurrency];
      const convertedAmount = (amount * rate).toFixed(2);

      // Format hasil dengan separator ribuan
      const formattedAmount = parseFloat(convertedAmount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

      resultDiv.textContent = `${rawAmount} ${fromCurrency} = ${formattedAmount} ${toCurrency}`;
    } else {
      resultDiv.textContent = 'Conversion rate not available.';
    }
  } catch (error) {
    console.error('Error fetching conversion rates:', error);
    resultDiv.textContent = 'Error fetching conversion rates. Please try again later.';
  }
}
  