from django import forms

class AlpacaInvestForm(forms.Form):
    symbol = forms.CharField(label='Stock Symbol', max_length=4, initial="VOO")
    amount = forms.DecimalField(label='Amount to Spend', max_digits=10, decimal_places=2, required=True)