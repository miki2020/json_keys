class ConvertService
  def initialize(json)
    @json = json
  end

  def convert_keys
    case @json
    when Array
      @json.map { |item| ConvertService.new(item).convert_keys }
    when Hash
      @json.each_with_object({}) do |(key, value), result|
        new_key = key.to_s.gsub(/([A-Z])/, '_\1').downcase.sub(/^_/, '') # camelCase to snake_case
        new_value = ConvertService.new(value).convert_keys
        result[new_key] = new_value
      end
    else
      @json
    end
  rescue StandardError => e
    { error: "Failed to convert JSON keys: #{e.message}" }
  end
end