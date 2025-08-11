-- Default categories seed data
-- This creates default categories for new users
-- In production, this would be triggered when a new user signs up

-- Sample user ID for development (replace with actual user ID)
-- Note: This is just for reference - actual seeding would happen via application logic

/*
Example categories structure:

Income
  - Salary
  - Freelance
  - Investments
  - Other Income

Housing
  - Rent/Mortgage
  - Utilities
  - Home Insurance
  - Maintenance

Transportation
  - Car Payment
  - Gas
  - Insurance
  - Maintenance
  - Public Transit

Food
  - Groceries
  - Restaurants
  - Coffee

Healthcare
  - Insurance
  - Doctor
  - Pharmacy
  - Dental

Entertainment
  - Movies
  - Games
  - Subscriptions
  - Hobbies

Shopping
  - Clothing
  - Electronics
  - Home Goods

Personal
  - Haircut
  - Gym
  - Education

Financial
  - Savings
  - Investments
  - Debt Payment

Other
  - Gifts
  - Donations
  - Miscellaneous
*/

-- Function to create default categories for a new user
CREATE OR REPLACE FUNCTION create_default_categories(p_user_id UUID)
RETURNS void AS $$
DECLARE
  v_income_id UUID;
  v_housing_id UUID;
  v_transport_id UUID;
  v_food_id UUID;
  v_healthcare_id UUID;
  v_entertainment_id UUID;
  v_shopping_id UUID;
  v_personal_id UUID;
  v_financial_id UUID;
  v_other_id UUID;
BEGIN
  -- Income
  INSERT INTO categories (user_id, name) VALUES (p_user_id, 'Income') RETURNING id INTO v_income_id;
  INSERT INTO categories (user_id, name, parent_id) VALUES 
    (p_user_id, 'Salary', v_income_id),
    (p_user_id, 'Freelance', v_income_id),
    (p_user_id, 'Investments', v_income_id),
    (p_user_id, 'Other Income', v_income_id);
  
  -- Housing
  INSERT INTO categories (user_id, name) VALUES (p_user_id, 'Housing') RETURNING id INTO v_housing_id;
  INSERT INTO categories (user_id, name, parent_id) VALUES 
    (p_user_id, 'Rent/Mortgage', v_housing_id),
    (p_user_id, 'Utilities', v_housing_id),
    (p_user_id, 'Home Insurance', v_housing_id),
    (p_user_id, 'Maintenance', v_housing_id);
  
  -- Transportation
  INSERT INTO categories (user_id, name) VALUES (p_user_id, 'Transportation') RETURNING id INTO v_transport_id;
  INSERT INTO categories (user_id, name, parent_id) VALUES 
    (p_user_id, 'Car Payment', v_transport_id),
    (p_user_id, 'Gas', v_transport_id),
    (p_user_id, 'Car Insurance', v_transport_id),
    (p_user_id, 'Car Maintenance', v_transport_id),
    (p_user_id, 'Public Transit', v_transport_id);
  
  -- Food
  INSERT INTO categories (user_id, name) VALUES (p_user_id, 'Food') RETURNING id INTO v_food_id;
  INSERT INTO categories (user_id, name, parent_id) VALUES 
    (p_user_id, 'Groceries', v_food_id),
    (p_user_id, 'Restaurants', v_food_id),
    (p_user_id, 'Coffee', v_food_id);
  
  -- Healthcare
  INSERT INTO categories (user_id, name) VALUES (p_user_id, 'Healthcare') RETURNING id INTO v_healthcare_id;
  INSERT INTO categories (user_id, name, parent_id) VALUES 
    (p_user_id, 'Health Insurance', v_healthcare_id),
    (p_user_id, 'Doctor', v_healthcare_id),
    (p_user_id, 'Pharmacy', v_healthcare_id),
    (p_user_id, 'Dental', v_healthcare_id);
  
  -- Entertainment
  INSERT INTO categories (user_id, name) VALUES (p_user_id, 'Entertainment') RETURNING id INTO v_entertainment_id;
  INSERT INTO categories (user_id, name, parent_id) VALUES 
    (p_user_id, 'Movies', v_entertainment_id),
    (p_user_id, 'Games', v_entertainment_id),
    (p_user_id, 'Streaming Services', v_entertainment_id),
    (p_user_id, 'Hobbies', v_entertainment_id);
  
  -- Shopping
  INSERT INTO categories (user_id, name) VALUES (p_user_id, 'Shopping') RETURNING id INTO v_shopping_id;
  INSERT INTO categories (user_id, name, parent_id) VALUES 
    (p_user_id, 'Clothing', v_shopping_id),
    (p_user_id, 'Electronics', v_shopping_id),
    (p_user_id, 'Home Goods', v_shopping_id);
  
  -- Personal
  INSERT INTO categories (user_id, name) VALUES (p_user_id, 'Personal') RETURNING id INTO v_personal_id;
  INSERT INTO categories (user_id, name, parent_id) VALUES 
    (p_user_id, 'Haircut', v_personal_id),
    (p_user_id, 'Gym', v_personal_id),
    (p_user_id, 'Education', v_personal_id);
  
  -- Financial
  INSERT INTO categories (user_id, name) VALUES (p_user_id, 'Financial') RETURNING id INTO v_financial_id;
  INSERT INTO categories (user_id, name, parent_id) VALUES 
    (p_user_id, 'Savings', v_financial_id),
    (p_user_id, 'Investments', v_financial_id),
    (p_user_id, 'Debt Payment', v_financial_id);
  
  -- Other
  INSERT INTO categories (user_id, name) VALUES (p_user_id, 'Other') RETURNING id INTO v_other_id;
  INSERT INTO categories (user_id, name, parent_id) VALUES 
    (p_user_id, 'Gifts', v_other_id),
    (p_user_id, 'Donations', v_other_id),
    (p_user_id, 'Miscellaneous', v_other_id);
END;
$$ LANGUAGE plpgsql;

-- Trigger to create default categories when a new user signs up
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS trigger AS $$
BEGIN
  PERFORM create_default_categories(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();