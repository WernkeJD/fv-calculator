from django.shortcuts import render, redirect
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.conf import settings
from urllib.parse import urlencode
from django.urls import reverse
import requests
import alpaca_trade_api as tradeapi
from .forms import AlpacaInvestForm



api = tradeapi.REST(settings.ALPACA_CLIENT_ID, settings.ALPACA_CLIENT_SECRET, base_url='https://paper-api.alpaca.markets')

# Create your views here.

def alpaca_login(request: HttpRequest) -> HttpResponse:
    authorization_url = 'https://app.alpaca.markets/oauth/authorize'
    params = {
        'client_id': settings.ALPACA_CLIENT_ID,
        'response_type': 'code',
        'redirect_uri': settings.ALPACA_REDIRECT_URI,
        'scope': 'trade'
    }

    print(f"{authorization_url}?{urlencode(params)}")
    return redirect(f"{authorization_url}?{urlencode(params)}")

def alpaca_callback(request: HttpRequest):
    # Extract the authorization code from the query parameters
    authorization_code = request.GET.get('code')

    if not authorization_code:
        return JsonResponse({'error': 'Authorization code missing from callback'}, status=400)

    # Prepare the token exchange data
    token_url = 'https://api.alpaca.markets/v2/oauth/token'
    data = {
        'client_id': settings.ALPACA_CLIENT_ID,
        'client_secret': settings.ALPACA_CLIENT_SECRET,
        'code': authorization_code,
        'grant_type': 'authorization_code',
        'redirect_uri': settings.ALPACA_REDIRECT_URI
    }

    # Send POST request to Alpaca to exchange code for access token
    response = requests.post(token_url, data=data)
    token_data = response.json()

    # Check if access_token exists
    print("Token exchange response:", token_data)  # Debugging the response

    # If no access token is returned, return an error response
    if 'access_token' not in token_data:
        return JsonResponse({'error': 'Failed to retrieve access token', 'details': token_data}, status=400)

    # Store the access token in the session
    access_token = token_data['access_token']
    request.session['alpaca_access_token'] = access_token

    return JsonResponse({'status': 'success', 'access_token': access_token})
    # return redirect(reverse('place_trade'))

def place_trade(request: HttpRequest) -> JsonResponse:
    try:
        if request.method == "POST":
            form = AlpacaInvestForm(request.POST)

            if form.is_valid():
                symbol = form.cleaned_data['symbol']
                amount = form.cleaned_data['amount']

                trade_url = "https://paper-api.alpaca.markets/v2/orders"

                payload = {
                    "type": "market",
                    "time_in_force": "day",
                    "symbol": symbol,
                    "side": "buy",
                    "notional": float(amount)
                }

                headers = {
                    "accept": "application/json",
                    "content-type": "application/json",
                    "APCA-API-KEY-ID": settings.ALPACA_CLIENT_ID,
                    "APCA-API-SECRET-KEY": settings.ALPACA_CLIENT_SECRET
                }

                response = requests.post(trade_url, json=payload, headers=headers)

                if response.status_code == 200:
                    return redirect(reverse('core:home'))
                else:
                    return JsonResponse({"message": f"error got status code {response.status_code}", "logs": f"{response.text}"})

    except Exception as e:
        return JsonResponse({"message": f"An unexpected error occured {e}"})






