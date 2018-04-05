require 'test/unit'
include Test::Unit::Assertions

step 'A step that passes' do ||
end

step 'A Step to fail' do ||
  assert_equal(1,2)
end