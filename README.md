# DutchAddressPCF
Dutch Address Control for PowerApps Component Framework

This control uses the Pro6PP APIv2:
- for suggesting cityname, streetname and number and/or premise
- for autocomplete cityname and streetname from a postcalcode/number

A few options can be configured:
- seperate output for number and premise or combined into one field
- use a range of numbers (for example an apartment building or project)

Current fields:
- CityProperty      (bound field)
- StreetProperty    (bound field)
- NumberProperty    (bound field)
- PremiseProperty   (bound field)
- NumberToProperty  (bound field)
- PremiseToProperty (bound field)
- PostcodeProperty  (bound field)
- PremiseOption     (input)
- RangeOption       (input)
