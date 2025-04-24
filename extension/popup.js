document.getElementById('captureButton').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'captureVisibleTab' }, (response) => {
    if (response.screenshot) {
      const img = document.createElement('img');
      img.src = response.screenshot;
      // document.getElementById('output').appendChild(img); // Display the image

      // Send the image data to OCR.space
      sendToOCR(response.screenshot);
    } else if (response.error) {
      console.error('Error capturing tab:', response.error);
      document.getElementById('output').textContent = 'Error: ' + response.error;
    }
  });
});

function sendToOCR(imageData) {
  const apiKey = "K81372540288957"; // Replace with your API key from OCR.space
  const formData = new FormData();
  formData.append("base64Image", imageData);
  formData.append("apikey", apiKey);

  fetch("https://api.ocr.space/parse/image", {
    method: "POST",
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.IsErroredOnProcessing) {
      console.error('OCR Error:', data.ErrorMessage);
    } else {
      const text = data.ParsedResults[0].ParsedText;
      console.log('Extracted Text:', text);
      // document.getElementById('output').textContent = text; // Display the extracted text

      // Now, find the total price
      const totalPrice = findTotalPrice(text);
      console.log("Total Price Found: ", totalPrice);
      // document.getElementById('output').textContent += "\nTotal Price: " + totalPrice; // Display the total price

      // Calculate the future value of the price in 20 years at 10% annual rate
      const futureValue = calculateFutureValue(totalPrice, 0.10, 30);
      console.log("Future Value: ", futureValue);
      document.getElementById('output').textContent += "\n You could make: " + futureValue; // Display the future value
    }
  })
  .catch(err => {
    console.error('API Request Error:', err);
  });
}

// Function to find the total price from the OCR text
function findTotalPrice(text) {
  const regex = /\$\d+(\.\d{2})?/g; // Regular expression to match dollar amounts
  let matches = [...text.replaceAll(',', '').matchAll(regex)];
  for (let i = 0; i < matches.length; i++){
    console.log(matches[i])
  }

  if (matches.length === 0) return "No price found";

  // Extract all numbers found and return the highest value
  let prices = matches.map(match => parseFloat(match[0].replace('$', '')));
  let maxPrice = Math.max(...prices);

  // Format the maximum price to match the original format (e.g., $750.00)
  return "$" + maxPrice.toFixed(2);
}

// Function to calculate the future value
function calculateFutureValue(presentValue, rate, years) {
  let pv = parseFloat(presentValue.replace('$', '').replace(',', '')); // Remove $ and commas for calculation
  let fv = pv * Math.pow((1 + rate), years);
  
  // Format the future value to 2 decimal places

  return new Intl.NumberFormat('en-US', {
    style: "currency",
    currency: "USD" 
  }).format(fv);
}









  