class Country < ActiveRecord::Base
  has_many :answers

  def get_percentages
    answers = self.answers
    answer_hash = answers.each_with_object({}) do |answer, hash|
      hash[answer.content.capitalize] ? hash[answer.content.capitalize] += 1 : hash[answer.content.capitalize] = 1
    end

    array = []

    answer_hash.each do |answer, count|
      array << {answer: answer, percentage: (count.to_f / answers.size.to_f * 100.0).round(2)}
    end

    array
  end
end
