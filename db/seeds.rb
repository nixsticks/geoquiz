# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db =>seed (or created alongside the db with db =>setup).
#
# Examples =>
#
#   cities = City.create([{ name => 'Chicago' }, { name => 'Copenhagen' }])
#   Mayor.create(name => 'Emanuel', city => cities.first)

require 'json'


# countries.each do |hash|
#   country = Country.create(id: hash["id"], name: hash["name"])

#   hash["alternatives"].each do |alternative|
#     Alternative.create(name: alternative, country_id: hash["id"])
#   end
# end

# i = 896

# states.each do |hash|
#   state = Unit.create(name: hash["properties"]["name"], id: i)
#   Alternative.create(name: hash["properties"]["abbr"], unit_id: state.id)
#   i += 1
# end

countries = JSON.parse(File.read("#{Rails.root}/public/datafiles/world.json"))

countries["objects"]["units"]["geometries"].each do |country|
  record = Unit.find(country["id"])
  record.update_attribute(:name, country["properties"]["name"])
end