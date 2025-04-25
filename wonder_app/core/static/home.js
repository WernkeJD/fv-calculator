document.getElementById('futureValueForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const amount = document.getElementById('amount').value;
    const discountRate = document.getElementById('discount_rate').value;
    const time = document.getElementById('time').value;

    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    
    fetch('/calculate-future-value/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({
            amount: amount,
            discount_rate: discountRate,
            time: time
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.future_value) {
            formattedFV = formatCurrency(data.future_value)

            document.getElementById('fv-heading').textContent = 'Future Value:'
            document.getElementById('result').textContent = formattedFV;
            document.getElementById('investBtn').classList.remove('hidden');
        } else {
            document.getElementById('result').textContent = 'Error: ' + data.error;
        }
        document.getElementById('result').scrollIntoView({ behavior: 'smooth', block: 'center' });
    })
    .catch(error => {
        document.getElementById('result').textContent = 'Error: ' + error;
    });
});

// Function to format numbers as currency
function formatCurrency(value) {
    return parseFloat(value).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
    });
}