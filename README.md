# DutchAddressPCF
Dutch Address Control for PowerApps Component Framework.

This control uses the Pro6PP APIv2:
- for suggesting cityname, streetname and number and/or premise
- for autocomplete cityname and streetname from a postcalcode/number

## Options (input properties)

- PremiseOption: seperate output for number and premise or combined into one field
- RangeOption: use a range of numbers (for example an apartment building or project)

## Fields (bound properties)

- CityProperty
- StreetProperty
- NumberProperty
- PremiseProperty: used only if PremiseOption = Seperated
- PostcodeProperty
- NumberToProperty: used only if RangeOption = Range
- PremiseToProperty: used only if RangeOption = Range and PremiseOption = Seperated 

## Install

This project has been build using Visual Studio 2019.
To get started download and install:
- .NET Framework 4.6.2 Developer Pack
- Visual Studio 2019
- NPM (12.16.1 LTS)
- PowerApps CLI

## See also:
https://powermaverick.dev/2019/05/18/create-custom-controls-using-powerapp-component-framework/<br>
https://docs.microsoft.com/en-us/powerapps/developer/common-data-service/powerapps-cli<br>
https://docs.microsoft.com/en-us/powerapps/developer/component-framework/implementing-controls-using-typescript<br>
https://docs.microsoft.com/en-us/powerapps/developer/component-framework/create-custom-controls-using-pcf<br>
