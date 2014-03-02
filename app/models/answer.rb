class Answer < ActiveRecord::Base
  belongs_to :unit
  
  validates :content, presence: true, format: {with: /[A-Z\-\',]+/i}

  def proper_name
    if %w[usa uk us uae drc droc].include?(self.content.downcase) || self.content.size == 2
      self.content.upcase
    elsif self.content.downcase == "timor-leste"
      "Timor-Leste"
    else
      self.content.split.map(&:capitalize).join(' ')
    end
  end
end