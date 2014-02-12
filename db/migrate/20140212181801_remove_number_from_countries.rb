class RemoveNumberFromCountries < ActiveRecord::Migration
  def change
    remove_column :countries, :number
  end
end
