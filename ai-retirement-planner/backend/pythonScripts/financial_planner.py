import ollama
import json
from typing import Dict, Any
import sys

def messages_to_dict(messages):
    none_fields = [field for field, value in messages.items() if value is None]
    if none_fields:
        returnMessage = "I would like to request information related to " + ", ".join(none_fields)
        # print(returnMessage)
        return returnMessage
    else:
        return False

def createPlan(current_age: int, retirement_age: int, monthly_income: float, 
               assets: float, liabilities: float, risk_factor: str) -> Dict[str, Any]:
    """Create a structured retirement plan data."""
    return {
        "current_age": current_age,
        "retirement_age": retirement_age,
        "monthly_income": monthly_income,
        "assets": assets,
        "liabilities": liabilities,
        "risk_factor": risk_factor
    }

def financial_planner(user_prompt):
    # print("user_prompt")
    # print(user_prompt)
    """Financial planner using Ollama with tools functionality."""
    if not user_prompt:
        return """Please provide information for your retirement plan. Include details such as:
                - Your current age
                - Desired retirement age
                - Monthly income
                - Total assets
                - Total liabilities
                - Risk tolerance (low/medium/high)"""
    
    try:
        # First, extract financial information using llama3.2
        system_prompt = """You are a financial data extractor. Extract values from the text. If values not provided in prompt for any field then make default value as None.
        Return ONLY a JSON object with these fields and no comments:
        {
            "current_age": number,
            "retirement_age": number,
            "monthly_income": number,
            "assets": number,
            "liabilities": number,
            "risk_factor": string (low/medium/high) }
        }"""

        # print(system_prompt)

        user_details = [{
                    "role": "system",
                    "content": system_prompt}]+ user_prompt
        # print(user_details)
        res = ollama.chat(
            model="llama3.2",
            messages=user_details,
        )

        # Parse the extracted data
        try:
            test_string  = res["message"]["content"]
            print(res)
            # Find where the actual JSON starts (after "format:")
            # print(test_string)
            start_index = test_string.find("{") + (len("{"))
            end_index = test_string.find("}", start_index-1) 
            # Extract just the part of the string that contains valid JSON
            # print(test_string)
            json_string = test_string[(start_index-1):end_index+1].strip()
            # print(json_string)  
            # Now, parse this extracted part into a Python dictionary
            financial_data = json.loads(json_string)
            print(financial_data)
        except json.JSONDecodeError:
            return {"Error": "Could not parse financial information. Please provide clear numerical values."}
        
        # Now use llama3.2 with tools to generate the plan
        completion = ollama.chat(
            model="llama3.2",
            messages=[{
                "role": "system",
                "content": "You are an expert retirement planner. Analyze the financial data and provide detailed recommendations return in INR always."
            }, {
                "role": "user",
                "content": json.dumps(financial_data)
            }],
            tools=[{
                "type": "function",
                "function": {
                    "name": "createPlan",
                    "description": "Create a retirement plan based on financial factors",
                    "strict": True,
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "current_age": {"type": "number"},
                            "retirement_age": {"type": "number"},
                            "monthly_income": {"type": "number"},
                            "assets": {"type": "number"},
                            "liabilities": {"type": "number"},
                            "risk_factor": {"type": "string"}
                        },
                        "required": [
                            "current_age",  
                            "retirement_age",
                            "monthly_income",
                            "assets",
                            "liabilities",
                            "risk_factor"
                        ],
                        "additionalProperties": False
                    }
                }
            }]
        )
        
        # print(completion.message.tool_calls[0].function.arguments)
        missingfield = messages_to_dict(completion.message.tool_calls[0].function.arguments)
        # print(missingfield)
        if(missingfield):
            return missingfield
        
        # Generate comprehensive analysis based on the plan
        analysis_prompt = f"""Based on the financial data:
        - Years until retirement: {financial_data['retirement_age'] - financial_data['current_age']}
        - Current monthly income: Rs{financial_data['monthly_income']}
        - Total assets: Rs{financial_data['assets']}
        - Total liabilities: Rs{financial_data['liabilities']}
        - Risk profile: {financial_data['risk_factor']}



        Based on the user's financial profile, provide a detailed investment plan that includes:

        1. **Investment Strategy**:
        - A high-level description of the strategy (e.g., aggressive growth, balanced portfolio, conservative income strategy).
        
        2. **Asset Allocation**:
        - Break down the portfolio by asset class and allocate a percentage to each.
        - Each asset class should include:
            - **Description**: A brief explanation of the investment approach for the asset class.
            - **Examples**: Provide some specific investments (e.g., ETFs, stocks, bonds, etc.).
            - **Risk Considerations** (if applicable): Include a risk level or specific risk details (e.g., high volatility).
            
        3. **Contribution Strategy**:
        - **Frequency** of contributions (e.g., monthly, quarterly).
        - **Amount**: Provide a guideline on how much the user should invest based on their income and expenses.
        - **Recommendation**: Suggestions for increasing contributions over time.

        4. **Investment Vehicles**:
        - List of investment vehicles or products that can be used for the investments (e.g., public provident fund, NPS, equity mutual funds, stocks, bonds, etc.).

        5. **Key Considerations**:
        - Include general advice on rebalancing, tax considerations, risk management, inflation impact, and any other important investment strategies or tips.

        Make sure the advice is relevant to someone looking to retire early, preferably in India, and the portfolio should consider risk tolerance (e.g., aggressive, moderate, or conservative).
        """
        
        final_analysis = ollama.generate(
            model="llama3.2",
            prompt=analysis_prompt,
            stream=False
        )
        
        return ({"result":final_analysis['response']})
        
    except Exception as e:
        return {'Error':f"An error occurred: {str(e)}"}


def main():
        # Get input argument from JS
        # print("Command line arguments:")
        user_prompt = json.loads(sys.argv[1])  # Get input argument from JS
        result = financial_planner(user_prompt)
        print(result)
        return result
        
        # # Try to parse as JSON if it's a string
        # try:
        #     parsed_prompt = json.loads(user_prompt)
        #     print("\nParsed JSON:", json.dumps(parsed_prompt, indent=2))
        # except json.JSONDecodeError:
        #     print("\nNot valid JSON, using as raw string")
        
        # # Call financial planner and print result
        # result = financial_planner(user_prompt)
        # print("\nFinancial planner result:", json.dumps(result, indent=2))

if __name__ == "__main__":
    main()

