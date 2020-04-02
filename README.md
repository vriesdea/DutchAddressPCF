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

This project has been build using Visual Studio 2019.
To get started follow the instructions:
- Install NPM (this project uses 12.16.1 LTS)
- Install .NET Framework 4.6.2 Developer Pack
- Install PowerApps CLI and update to the latest version

See also:
https://powermaverick.dev/2019/05/18/create-custom-controls-using-powerapp-component-framework/
https://docs.microsoft.com/en-us/powerapps/developer/common-data-service/powerapps-cli
https://docs.microsoft.com/en-us/powerapps/developer/component-framework/implementing-controls-using-typescript
https://docs.microsoft.com/en-us/powerapps/developer/component-framework/create-custom-controls-using-pcf
