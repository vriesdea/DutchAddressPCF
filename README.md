# DutchAddressPCF
Dutch Address Control for PowerApps Component Framework.

This control uses the [Pro6PP APIv2](https://www.pro6pp.nl/docs/v2/redoc):
- for suggesting cityname, streetname and number and/or premise
- for autocomplete cityname and streetname from a postcalcode/number

## Fields (bound properties)

- CityProperty
- StreetProperty
- NumberProperty
- PremiseProperty: used only if PremiseOption = Seperated
- PostcodeProperty
- NumberToProperty: used only if RangeOption = Range
- PremiseToProperty: used only if RangeOption = Range and PremiseOption = Seperated 

## Options (input properties)

- PremiseOption: seperate output for number and premise or combined into one field
- RangeOption: use a range of numbers (for example an apartment building or project)

## Install (on Windows)

- .NET Framework 4.6.2 Developer Pack
- Visual Studio (2022 or later)
- NPM (16.14 LTS or later LTS)
- PowerApps CLI (1.12 or later)

## Usage
1. Open project in Visual Studio using Open > Folder
2. Open Node.js Command Prompt
3. Goto folder *\<yourpath\>*/DutchAddress/AddressLookup/
```
$ npm install
$ npm start watch
```

## See also
https://powermaverick.dev/2019/05/18/create-custom-controls-using-powerapp-component-framework/<br>
https://docs.microsoft.com/en-us/powerapps/developer/common-data-service/powerapps-cli<br>
https://docs.microsoft.com/en-us/powerapps/developer/component-framework/implementing-controls-using-typescript<br>
https://docs.microsoft.com/en-us/powerapps/developer/component-framework/create-custom-controls-using-pcf<br>

## License

license: unlicense<br>
*A. de Vries, The Netherlands, 2020*
