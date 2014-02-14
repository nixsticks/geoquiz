class CreateAlternatives < ActiveRecord::Migration
  def change
    create_table :alternatives do |t|
      t.string :name
      t.belongs_to :country

      t.timestamps
    end
  end
end
