class ChangeCountriesToUnits < ActiveRecord::Migration
  def change
    rename_table :countries, :units
  end
end
