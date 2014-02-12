class CreateAnswers < ActiveRecord::Migration
  def change
    create_table :answers do |t|
      t.string :content
      t.belongs_to :user
      t.belongs_to :country

      t.timestamps
    end
  end
end
