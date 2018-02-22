# README #

## links
http://v3.torontomls.net/Live/Pages/Public/Link.aspx?Key=da120e4cb97648dc985eed3a1259e965&App=TREB
http://v3.torontomls.net/Live/Pages/Public/Link.aspx?Key=4ef972167b6345faaa441efd70fdc331&App=TREB
http://v3.torontomls.net/Live/Pages/Public/Link.aspx?Key=d84f5136cd3a49648466a35c5b7a58c8&App=TREB

## For the scraping from padmapper.
https://imgur.com/a/RfMwN
1. On the right side there is a section called "Length: Long term, short term" select "Long term" for every scrape before getting any info.
Only want data with the "Long term" selected. No short term data.
2. Not scraping 1-4 bedrooms for every property anymore.
   First have to determine how many units and bedrooms each property has

   Ex. If a property has 2 units, and each unit has 2br for each unit then
      Need to scrape the average rental prices for only 2br from that address on padmapper
      So it might look like

      123 fake street
      1br: null,
      2br: $1200 x 2 (3 units avg)
      3br: null,
      4br: null

  Ex. If a property has 3 units, and unit 1 has 2br, unit 2 has 3br, unit 3 has 1br
      1234 fake street
      1br: $1000 (4 units avg)
      2br: $1200 (5 units avg)
      3br: $1500 (8 units avg)
      4br: null

      If a property has 1 unit, with 1br
      1235 fake street
      1br: $1000 (3 units avg)
      2br: null

Once that logic is done, the padmapper scraping should be done for v1

## To get the # of units and bedroom for the units
https://imgur.com/a/ltUgG

Check this img album it has example listings with info highlighted and description below the image.

For now I think using the # + # method for determining the bedrooms is good for now.

There's a few edge cases I'll email Michael about.

## Expenses

Coming
