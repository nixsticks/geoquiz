class AnswersController < ApplicationController
  def new
    @answer = Answer.new
  end

  def create
    @answer = Answer.create(answer_params)
    render nothing: true
  end

  private
    def answer_params
      params.require(:answer).permit(:content, :user_id, :unit_id)
    end
end