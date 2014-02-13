class Answer < ActiveRecord::Base
  belongs_to :country
  validates :content, presence: true

  def proper_name
    self.content.split.map(&:capitalize).join(' ')
  end
end
