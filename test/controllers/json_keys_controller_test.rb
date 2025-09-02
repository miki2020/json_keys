require "test_helper"

class JsonKeysControllerTest < ActionDispatch::IntegrationTest
  test "should post convert" do
    post "/json_keys/convert", params: { "UserName" => "john_doe" }.to_json, headers: { "Content-Type" => "application/json" }
    assert_response :success
  end
end
