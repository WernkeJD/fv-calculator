function sendToChatGPT(htmlContent, sendResponse) {
    console.log("Inside sendToChatGPT function");
  
    // Extract the body content to reduce the size of the request
    const bodyContent = extractBodyContent(htmlContent);
    const prompt = `Please parse the following HTML text and extract the price of the item being purchased. Please note I only grabbed page text after the term total. Return only the numeric price value. Here's the body text:\n\n${bodyContent}`;
  
    const apiKey = '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';  // Ensure your API key is correct
  
    // Create the correct messages format for the chat-based API
    const messages = [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: prompt }
    ];
  
    fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',  // Ensure this is the correct model
        messages: messages,  // Send the messages array
        max_tokens: 1000,
        temperature: 0,
      })
    })
    .then(response => response.json())
  .then(data => {
    console.log("ChatGPT response:", data);  // This will log the response from ChatGPT

    const choice = data.choices[0];
    const responseText = choice.message.content;
    console.log("Response Text:", responseText);  // Log the entire response text

    // Use regex to extract the price from the response (even if it's surrounded by Markdown)
    const priceMatch = responseText.match(/[\d,]+/g);  // Matches digits, possibly with commas

    // Parse the price if matched
    const extractedPrice = priceMatch ? parseFloat(priceMatch[0].replace(/,/g, '')) : NaN;
    console.log("Extracted Price:", extractedPrice);
    
    if (extractedPrice) {
        const futureValue = calculateFutureValue(extractedPrice);
        console.log("Calculated Future Value:", futureValue);
  
        // Send the future value to the background script
        chrome.runtime.sendMessage({ action: "updatePopup", futureValue: futureValue });
      } else {
        console.log("Failed to extract a valid price.");
        chrome.runtime.sendMessage({ action: "updatePopup", futureValue: null });
      }
    })
    .catch(error => {
      console.error('Error calling ChatGPT API:', error);
      chrome.runtime.sendMessage({ action: "updatePopup", futureValue: null });
    });
  }