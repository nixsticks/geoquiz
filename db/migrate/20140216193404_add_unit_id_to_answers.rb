class AddUnitIdToAnswers < ActiveRecord::Migration
  def change
    rename_column :answers, :country_id, :unit_id
  end
end
