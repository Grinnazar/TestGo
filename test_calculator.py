import unittest
from calculator import add, subtract, multiply, divide

class TestCalculator(unittest.TestCase):

    def test_add(self):
        self.assertEqual(add(1, 2), 3)
        self.assertEqual(add(-1, 1), 0)
        self.assertEqual(add(-1, -1), -2)
        self.assertEqual(add(0, 0), 0)
        self.assertAlmostEqual(add(0.1, 0.2), 0.3) # For floating point comparisons

    def test_subtract(self):
        self.assertEqual(subtract(10, 5), 5)
        self.assertEqual(subtract(-1, 1), -2)
        self.assertEqual(subtract(-1, -1), 0)
        self.assertEqual(subtract(5, 10), -5)
        self.assertAlmostEqual(subtract(0.3, 0.1), 0.2)

    def test_multiply(self):
        self.assertEqual(multiply(3, 7), 21)
        self.assertEqual(multiply(-1, 1), -1)
        self.assertEqual(multiply(-1, -1), 1)
        self.assertEqual(multiply(0, 100), 0)
        self.assertAlmostEqual(multiply(0.5, 0.5), 0.25)

    def test_divide(self):
        self.assertEqual(divide(10, 2), 5)
        self.assertEqual(divide(-10, 2), -5)
        self.assertEqual(divide(-10, -2), 5)
        self.assertEqual(divide(5, 2), 2.5)
        self.assertAlmostEqual(divide(0.1, 0.2), 0.5)

    def test_divide_by_zero(self):
        self.assertEqual(divide(10, 0), "Error: Cannot divide by zero.")
        self.assertEqual(divide(0, 0), "Error: Cannot divide by zero.")
        self.assertEqual(divide(-5, 0), "Error: Cannot divide by zero.")

if __name__ == '__main__':
    unittest.main()
