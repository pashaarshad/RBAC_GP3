# HR Data Exploration Summary

## Documents Reviewed
- employee_handbook.md: HR policies, benefits, privacy rules
- hr_data.csv: employee records with role, salary, performance, and attendance

## Privacy Assessment
- PII: full_name, email, date_of_birth
- Confidential: salary, performance_rating, attendance_pct

## Role-Based Access

| Role            | Allowed Fields                             |
|-----------------|---------------------------------------------|
| HR Manager      | All fields                                  |
| Recruiter       | employee_id, full_name, role, department    |
| Payroll Analyst | employee_id, salary, performance, attendance|

## Actions Taken
- Flagged privacy fields
- Defined access rules in YAML
- Cleaned dataset saved to data/processed/
