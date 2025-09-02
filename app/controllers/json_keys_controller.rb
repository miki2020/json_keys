class JsonKeysController < ApplicationController
  def convert
    begin
      json = JSON.parse(request.body.read)
    rescue JSON::ParserError => e
      render json: { error: "Invalid JSON input: #{e.message}" }, status: :bad_request and return
    end

    converted_json = ConvertService.new(json).convert_keys
    
    render json: converted_json
  end
end
