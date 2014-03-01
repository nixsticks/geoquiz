class ChangeAlternatives < ActiveRecord::Migration
  def change
    rename_column :alternatives, :country_id, :unit_id
  end
end
