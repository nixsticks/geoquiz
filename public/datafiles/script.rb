require "csv"
require "json"

parsed_file = CSV.read("./countrynames.tsv", { :col_sep => "\t" })
array = parsed_file.map do |array|
  {"id" => array[0], "name" => array[1]}
end

File.open("./countrynames.json", "w") do |f|
  f.write array.to_json
end