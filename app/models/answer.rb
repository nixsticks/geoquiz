class Answer < ActiveRecord::Base
  belongs_to :country
  validates :content, presence: true
end
