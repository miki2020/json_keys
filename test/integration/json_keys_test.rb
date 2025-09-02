require "test_helper"

class JsonKeysTest < ActionDispatch::IntegrationTest
  test "should convert JSON keys from camelCase TO snake_case" do
    post "/json_keys/convert", params: {
      "UserName" => "john_doe",
      "userDetails" => {
        "firstName" => "John",
        "lastName" => "Doe",
        "addressList" => [
          { "StreetName" => "Main St", "zipCode" => "12345" },
          { "streetName" => "Second St", "zipCode" => "67890" }
        ]
      }
    }.to_json, headers: { "Content-Type" => "application/json" }

    expected_response = {
      "user_name" => "john_doe",
      "user_details" => {
        "first_name" => "John",
        "last_name" => "Doe",
        "address_list" => [
          { "street_name" => "Main St", "zip_code" => "12345" },
          { "street_name" => "Second St", "zip_code" => "67890" }
        ]
      }
    }
    
    assert_equal expected_response, JSON.parse(response.body)
  end
end
