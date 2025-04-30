from financial_planner import financial_planner

def get_dynamic_input():
    # Collect user input dynamically
    print("Please provide the following information for your retirement plan:")
    
    
    user_prompt = input("Enter your description: ")
    
    return user_prompt

if __name__ == "__main__":
    # Get dynamic input from the user
    user_prompt = get_dynamic_input()
    
    # Pass the dynamic input to financial_planner function
    result = financial_planner(user_prompt)
    
    # Print the generated retirement plan
    print("\nGenerated Plan:")
    print(result)
