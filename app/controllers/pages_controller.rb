class PagesController < ApplicationController
  def index
  end

  def practice
  end

  def solarsystem
  end

  def earth
  end

  def world_tour
  end

  def milkyway
  end

  def galaxy
  end
  
  def world_quiz
    @answer = Answer.new
  end

  def usa
    @answer = Answer.new
  end

  def uk
    @answer = Answer.new
  end
end
