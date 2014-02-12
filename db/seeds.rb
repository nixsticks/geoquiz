# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db =>seed (or created alongside the db with db =>setup).
#
# Examples =>
#
#   cities = City.create([{ name => 'Chicago' }, { name => 'Copenhagen' }])
#   Mayor.create(name => 'Emanuel', city => cities.first)

countries = {
  4 => "Afghanistan",
  8 => "Albania",
  12 => "Algeria",
  24 => "Angola",
  10 => "Antarctica",
  32 => "Argentina",
  51 => "Armenia",
  36 => "Australia",
  40 => "Austria",
  31 => "Azerbaijan",
  44 => "Bahamas",
  50 => "Bangladesh",
  112 => "Belarus",
  56 => "Belgium",
  84 => "Belize",
  204 => "Benin",
  64 => "Bhutan",
  68 => "Bolivia, Plurinational State of",
  70 => "Bosnia and Herzegovina",
  72 => "Botswana",
  76 => "Brazil",
  96 => "Brunei Darussalam",
  99 => "Somaliland",
  100 => "Bulgaria",
  854 => "Burkina Faso",
  108 => "Burundi",
  116 => "Cambodia",
  120 => "Cameroon",
  124 => "Canada",
  140 => "Central African Republic",
  148 => "Chad",
  152 => "Chile",
  156 => "China",
  170 => "Colombia",
  178 => "Congo",
  180 => "Congo, the Democratic Republic of the",
  188 => "Costa Rica",
  384 => "Cote d'Ivoire",
  191 => "Croatia",
  192 => "Cuba",
  196 => "Cyprus",
  203 => "Czech Republic",
  208 => "Denmark",
  262 => "Djibouti",
  214 => "Dominican Republic",
  218 => "Ecuador",
  818 => "Egypt",
  222 => "El Salvador",
  226 => "Equatorial Guinea",
  232 => "Eritrea",
  233 => "Estonia",
  231 => "Ethiopia",
  238 => "Falkland Islands (Malvinas)",
  242 => "Fiji",
  246 => "Finland",
  250 => "France",
  260 => "French Southern Territories",
  266 => "Gabon",
  270 => "Gambia",
  268 => "Georgia",
  276 => "Germany",
  288 => "Ghana",
  300 => "Greece",
  304 => "Greenland",
  320 => "Guatemala",
  324 => "Guinea",
  624 => "Guinea-Bissau",
  328 => "Guyana",
  332 => "Haiti",
  340 => "Honduras",
  348 => "Hungary",
  352 => "Iceland",
  356 => "India",
  360 => "Indonesia",
  364 => "Iran, Islamic Republic of",
  368 => "Iraq",
  372 => "Ireland",
  376 => "Israel",
  380 => "Italy",
  388 => "Jamaica",
  392 => "Japan",
  400 => "Jordan",
  398 => "Kazakhstan",
  404 => "Kenya",
  408 => "Korea, Democratic People's Republic of",
  410 => "Korea, Republic of",
  414 => "Kuwait",
  417 => "Kyrgyzstan",
  418 => "Lao People's Democratic Republic",
  428 => "Latvia",
  422 => "Lebanon",
  426 => "Lesotho",
  430 => "Liberia",
  434 => "Libya",
  440 => "Lithuania",
  442 => "Luxembourg",
  807 => "Macedonia, the former Yugoslav Republic of",
  450 => "Madagascar",
  454 => "Malawi",
  458 => "Malaysia",
  466 => "Mali",
  478 => "Mauritania",
  484 => "Mexico",
  498 => "Moldova, Republic of",
  496 => "Mongolia",
  499 => "Montenegro",
  504 => "Morocco",
  508 => "Mozambique",
  104 => "Myanmar",
  516 => "Namibia",
  524 => "Nepal",
  528 => "Netherlands",
  540 => "New Caledonia",
  554 => "New Zealand",
  558 => "Nicaragua",
  562 => "Niger",
  566 => "Nigeria",
  578 => "Norway",
  512 => "Oman",
  586 => "Pakistan",
  275 => "Palestinian Territory, Occupied",
  591 => "Panama",
  598 => "Papua New Guinea",
  600 => "Paraguay",
  604 => "Peru",
  608 => "Philippines",
  616 => "Poland",
  620 => "Portugal",
  630 => "Puerto Rico",
  634 => "Qatar",
  642 => "Romania",
  643 => "Russian Federation",
  646 => "Rwanda",
  682 => "Saudi Arabia",
  686 => "Senegal",
  688 => "Serbia",
  694 => "Sierra Leone",
  703 => "Slovakia",
  705 => "Slovenia",
  90 => "Solomon Islands",
  706 => "Somalia",
  710 => "South Africa",
  728 => "South Sudan",
  724 => "Spain",
  144 => "Sri Lanka",
  729 => "Sudan",
  740 => "Suriname",
  748 => "Swaziland",
  752 => "Sweden",
  756 => "Switzerland",
  760 => "Syrian Arab Republic",
  158 => "Taiwan, Province of China",
  762 => "Tajikistan",
  834 => "Tanzania, United Republic of",
  764 => "Thailand",
  626 => "Timor-Leste",
  768 => "Togo",
  780 => "Trinidad and Tobago",
  788 => "Tunisia",
  792 => "Turkey",
  795 => "Turkmenistan",
  800 => "Uganda",
  804 => "Ukraine",
  784 => "United Arab Emirates",
  826 => "United Kingdom",
  840 => "United States",
  858 => "Uruguay",
  860 => "Uzbekistan",
  548 => "Vanuatu",
  862 => "Venezuela, Bolivarian Republic of",
  704 => "Vietnam",
  732 => "Western Sahara",
  887 => "Yemen",
  894 => "Zambia",
  716 => "Zimbabwe"
}

countries.each do |key, value|
  Country.create(id: key, name: value)
end