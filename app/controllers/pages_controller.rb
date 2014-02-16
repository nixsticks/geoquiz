class PagesController < ApplicationController
  def index
  end

  def practice
  end

  def world_quiz
    @answer = Answer.new
  end

  def usa
    @answer = Answer.new
  end
end
