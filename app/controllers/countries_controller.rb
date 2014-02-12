class CountriesController < ApplicationController
  def show
    @country = Country.find(params[:id])
    render layout: false
  end
end
