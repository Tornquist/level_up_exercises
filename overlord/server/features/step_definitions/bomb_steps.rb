Given /^I have a new bomb$/ do
  page.driver.put("/bomb")
end

Given /^I booted the bomb$/ do
  page.driver.post("/boot")
end

Given /^I submit code "([^"]*)"$/ do |code|
  page.driver.post("/submit_code", code: code)
end

Given /^set (.*) key to "([^"]*)"$/ do |dest, key|
  path = "/set_" + dest + "_key"
  page.driver.post(path, key: key)
end

Then /^I should see an unbooted bomb$/ do
  visit "/"
  response = JSON.parse(body)
  response["message"].should have_content("off")
end

When /^I boot the bomb$/ do
  page.driver.post("/boot")
end

Then /^the bomb is (.+)$/ do |status|
  visit "/"
  response = JSON.parse(body)
  response["message"].should eq(status)
end

Then /^the time is "([^"]*)"$/ do |time|
  visit "/timer"
  body.should have_content(time)
end

Then /^submit code "([^"]*)" (.*)$/ do |code, result|
  page.driver.post("/submit_code", code: code)
  response = JSON.parse(body)
  case result
  when "succeeds"
    response["message"].should have_content(code)
  when "fails (not booted)"
    response["message"].should eq("Code Entry Requires a Booted Bomb")
  when "fails (invalid)"
    response["message"].should have_content("Incorrect Code")
  else
    raise "Invalid Step Definition Choice"
  end
end

Then /^set (.*) key to "([^"]*)" (.*)$/ do |dest, key, result|
  path = "/set_" + dest + "_key"
  page.driver.post(path, key: key)
  response = JSON.parse(body)
  case result
  when "succeeds"
    response["message"].should eq(key)
  when "fails"
    response["message"].should have_content("Cannot Change Once Bomb is Booted")
  else
    raise "Invalid Step Definition Choice"
  end
end
