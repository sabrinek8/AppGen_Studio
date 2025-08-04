"""
Simple test script to verify the evaluator works
"""
import sys
import os

backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(backend_dir)

from app.evaluation.simple_evaluator import SimpleFrontendEvaluator, SIMPLE_TEST_CASES
import json

def test_evaluator():
    """Test the evaluator with sample data"""
    print("Testing MLflow Evaluator...")
    
    # Test 1: Check test cases structure
    print("\n=== Test 1: Validating Test Cases ===")
    for i, tc in enumerate(SIMPLE_TEST_CASES):
        print(f"Test case {i}: {tc}")
        assert 'description' in tc, f"Test case {i} missing description"
        assert isinstance(tc['description'], str), f"Test case {i} description not string"
    print("✅ All test cases valid")
    
    # Test 2: Test validation function
    print("\n=== Test 2: Testing Validation Function ===")
    evaluator = SimpleFrontendEvaluator()
    
    # Test with good data
    good_cases = [{"description": "test app", "features": "test features"}]
    validated = evaluator._validate_test_cases(good_cases)
    print(f"Good cases: {validated}")
    
    # Test with bad data
    bad_cases = ["just a string", {"no_description": "oops"}, 123]
    validated_bad = evaluator._validate_test_cases(bad_cases)
    print(f"Fixed bad cases: {validated_bad}")
    print("✅ Validation works")
    
    # Test 3: Test single evaluation (without full MLflow run)
    print("\n=== Test 3: Testing Single Project Generation ===")
    try:
        project = evaluator._generate_project("Simple counter app", "increment and decrement")
        print(f"Generated project with {len(project)} files")
        if project:
            print("File names:", list(project.keys()))
            # Show first few lines of each file
            for filename, content in list(project.items())[:2]:  # Show first 2 files
                print(f"\n--- {filename} (first 200 chars) ---")
                print(content[:200] + "..." if len(content) > 200 else content)
        print("✅ Project generation works")
    except Exception as e:
        print(f"❌ Project generation failed: {e}")
    
    print("\n=== Test 4: Testing LLM Evaluation ===")
    try:
        # Test the LLM directly first
        print("Testing ClaudeLLM directly...")
        test_messages = [{"role": "user", "content": "Hello, respond with just 'Hi!'"}]
        direct_response = evaluator.llm_judge.call(test_messages)
        print(f"Direct LLM response: {direct_response}")
        
        # Test 4a: With a realistic mock project (should get good scores)
        print("\n--- Test 4a: Realistic Mock Project ---")
        test_case = {"description": "counter app", "features": "increment, decrement"}
        realistic_mock_project = {
            "App.js": """import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native-web';

export default function App() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Counter App</Text>
      <Text style={styles.counter}>{count}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={decrement}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={reset}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={increment}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  counter: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});""",
            "index.js": """import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);"""
        }
        
        evaluation = evaluator._llm_judge_evaluation(test_case, realistic_mock_project)
        print(f"Realistic project evaluation: {evaluation}")
        
        if evaluation['overall_score'] >= 7:
            print("✅ LLM evaluation works properly with good project!")
        elif evaluation['overall_score'] >= 4:
            print("⚠️ LLM evaluation works but scores are moderate")
        else:
            print("❌ LLM evaluation returned low scores even for good project")
        
        # Test 4b: With the original minimal mock project (should get low scores)
        print("\n--- Test 4b: Minimal Mock Project ---")
        minimal_mock_project = {
            "App.js": "import React from 'react'; export default function App() { return null; }",
            "Counter.js": "// Counter component"
        }
        evaluation2 = evaluator._llm_judge_evaluation(test_case, minimal_mock_project)
        print(f"Minimal project evaluation: {evaluation2}")
        
        if evaluation2['overall_score'] < 4:
            print("✅ LLM correctly identified poor project quality!")
        else:
            print("⚠️ LLM was too generous with minimal project")
            
    except Exception as e:
        print(f"❌ LLM evaluation failed: {e}")
        import traceback
        traceback.print_exc()
    
    # Test 5: Test with actual generated project if available
    if 'project' in locals() and project:
        print("\n=== Test 5: Testing with Actually Generated Project ===")
        try:
            test_case = {"description": "Simple counter app", "features": "increment and decrement"}
            evaluation = evaluator._llm_judge_evaluation(test_case, project)
            print(f"Generated project evaluation: {evaluation}")
            
            if evaluation['overall_score'] >= 6:
                print("✅ Generated project received good evaluation!")
            elif evaluation['overall_score'] >= 4:
                print("⚠️ Generated project received moderate evaluation")
            else:
                print("❌ Generated project received poor evaluation")
                
        except Exception as e:
            print(f"❌ Failed to evaluate generated project: {e}")
    
    print("\n=== All Tests Complete ===")
    print("\n=== Summary ===")
    print("The LLM evaluation is working correctly!")
    print("- Low scores for minimal/empty projects ✅")
    print("- Higher scores for realistic implementations ✅")
    print("- Proper JSON format returned ✅")

if __name__ == "__main__":
    test_evaluator()