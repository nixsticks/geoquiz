class UnitsController < ApplicationController
  def show
    @unit = Unit.find(params[:id])
    @answers = @unit.get_percentages
    gon.data = @answers.sort_by {|answer| answer[:percentage] }.reverse
    render layout: false
  end
end
