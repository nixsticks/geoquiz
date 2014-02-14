class Answer < ActiveRecord::Base
  belongs_to :country
  
  validates :content, presence: true

  def proper_name
    if %w[usa uk us].include?(self.content)
      self.content.upcase
    else
      self.content.split.map(&:capitalize).join(' ')
    end
  end
end
