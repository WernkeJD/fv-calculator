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

function trade() {
    console.log('trade function called')
    const amount = document.getElementById('amount').value;
    const symbol = "VOO";  // Can be dynamically set based on user input or other criteria

    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    fetch('/alpaca/place_trade/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken // Ensure csrfToken is defined in your JavaScript
        },
        body: JSON.stringify({
            amount: amount,
            symbol: symbol
        }),
    })
    .then(response => response.json())  // Parse the response JSON
    .then(data => {
        console.log("Trade placed successfully:", data);
        // You can add further actions after a successful trade, like redirecting or showing a success message

        if (data.message == "Trade placed successfully") {
            // window.location.href = "{% url 'core:home' %}"
            window.location.reload();
        }
    })
    .catch(error => {
        console.error("Error placing trade:", error);
        // Handle error if the request fails (e.g., network issues, server errors)
    });
}