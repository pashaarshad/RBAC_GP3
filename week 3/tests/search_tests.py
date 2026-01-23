import json
import time

def semantic_search(query):
    # Mock implementation of semantic search
    # Replace this with the actual search logic
    department_mapping = {
        "quarterly revenue report": "Finance",
        "employee benefits policy": "HR",
        "marketing campaign ROI": "marketing",
        "API documentation": "engineering",
        "company handbook": "general"
    }
    return department_mapping.get(query, "unknown"), 0.95  # Mock relevance score

def run_tests():
    with open("test_queries.json", "r") as file:
        test_queries = json.load(file)

    results = []
    total_latency = 0
    total_score = 0
    passed_tests = 0

    for test in test_queries:
        query = test["query"]
        expected_dept = test["expected_dept"]

        start_time = time.time()
        actual_dept, score = semantic_search(query)
        latency_ms = (time.time() - start_time) * 1000

        passed = actual_dept == expected_dept and latency_ms < 500
        if passed:
            passed_tests += 1

        total_latency += latency_ms
        total_score += score

        results.append({
            "query": query,
            "expected_dept": expected_dept,
            "actual_dept": actual_dept,
            "latency_ms": latency_ms,
            "passed": passed,
            "score": score
        })

    pass_rate = (passed_tests / len(test_queries)) * 100
    avg_latency = total_latency / len(test_queries)
    avg_score = total_score / len(test_queries)

    with open("../output/test_results.json", "w") as file:
        json.dump(results, file, indent=4)

    print("Test Summary:")
    print(f"Pass Rate: {pass_rate:.2f}%")
    print(f"Average Latency: {avg_latency:.2f} ms")
    print(f"Average Score: {avg_score:.2f}")

    assert avg_latency < 500, "Average latency exceeds 500ms"
    assert pass_rate == 100, "Not all tests passed"

if __name__ == "__main__":
    run_tests()