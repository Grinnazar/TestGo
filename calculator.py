# This will be the main file for our calculator application.
# We will add functions for arithmetic operations and the main application loop here.

def add(a, b):
    """Returns the sum of a and b."""
    return a + b

def subtract(a, b):
    """Returns the difference of a and b."""
    return a - b

def multiply(a, b):
    """Returns the product of a and b."""
    return a * b

def divide(a, b):
    """Returns the quotient of a and b.
    Handles division by zero by returning an error message.
    """
    if b == 0:
        return "Error: Cannot divide by zero."
    return a / b

if __name__ == "__main__":
    print("Simple Command-Line Calculator")
    print("Enter 'quit' or 'exit' to stop.")

    while True:
        try:
            user_input = input("Enter calculation (e.g., 10 + 5): ").strip().lower()

            if user_input in ["quit", "exit"]:
                print("Exiting calculator. Goodbye!")
                break

            parts = user_input.split()
            if len(parts) != 3:
                print("Invalid input format. Please use 'number operator number' (e.g., 10 + 5).")
                continue

            num1_str, operator, num2_str = parts

            try:
                num1 = float(num1_str)
                num2 = float(num2_str)
            except ValueError:
                print("Invalid numbers. Please enter valid numeric values.")
                continue

            result = None
            if operator == '+':
                result = add(num1, num2)
            elif operator == '-':
                result = subtract(num1, num2)
            elif operator == '*':
                result = multiply(num1, num2)
            elif operator == '/':
                result = divide(num1, num2)
            else:
                print(f"Unknown operator: {operator}. Supported operators are +, -, *, /")
                continue

            if isinstance(result, str) and "Error" in result: # Check if divide returned an error string
                print(result)
            else:
                print(f"Result: {result}")

        except Exception as e:
            print(f"An unexpected error occurred: {e}")
            # It might be good to log this or provide more specific error handling
            # For now, we'll just inform the user and continue.
            continue
