class Unit < ActiveRecord::Base
  has_many :answers
  has_many :alternatives

  def get_percentages
    percentages = []
    answers = self.answers
    answer_hash = answers.each_with_object({}) do |answer, hash|
      hash[answer.proper_name] ? hash[answer.proper_name] += 1 : hash[answer.proper_name] = 1
    end

    answer_hash.each do |answer, count|
      percentages << {answer: answer, percentage: (count.to_f / answers.size.to_f * 100.0).round(0)}
    end

    percentages
  end
end
