# 📘 RBAC Configuration

## 📌 Project
**Financial Domain Internal Chatbot with Role-Based Access Control (RBAC)**

This document provides a comprehensive guide to configuring and managing **Role-Based Access Control (RBAC)** for secure document retrieval in the chatbot system.

---

## 1️⃣ Role Hierarchy Diagram

### 🔹 Role Hierarchy (Access Levels)

C-Level Executives (Access Level: 100)
↓
Department Heads (Access Level: 50)
↓
Employees (Access Level: 10)

### 🔹 Access Level Explanation

-------------------------------------------------------------------------------
| Role            | Access Level | Description                                |
|-----------------|--------------|--------------------------------------------|
| C-Level         | 100          | Full access across all departments         |
| Department Head | 50           | Access limited to own department + general |
| Employee        | 10           | Access only to general documents           |
-------------------------------------------------------------------------------
Higher access levels inherit permissions from lower levels.

---

## 2️⃣ Permission Matrix

This matrix defines **which roles can access which department documents**.

-----------------------------------------------------------------
| Role       | Finance | HR | Marketing | Engineering | General |
|------------|---------|----|-----------|-------------|---------|
| c-level    | ✅     | ✅ |    ✅    | ✅          | ✅      |
| finance    | ✅     | ❌ |    ❌    | ❌          | ✅      |
| hr         | ❌     | ✅ |    ❌    | ❌          | ✅      |
| marketing  | ❌     | ❌ |    ✅    | ❌          | ✅      |
| engineering| ❌     | ❌ |    ❌    | ✅          | ✅      |
| employee   | ❌     | ❌ |    ❌    | ❌          | ✅      |
-----------------------------------------------------------------


## 3️⃣ Search Flow with RBAC

### 🔹 Secure Search Pipeline

User Query
↓
Query Preprocessing
↓
Vector Search
↓
RBAC Metadata Filter
↓
Authorized Results


### 🔹 Flow Explanation
1. User submits a query
2. Query is converted into an embedding
3. Semantic search retrieves relevant chunks
4. RBAC filter removes unauthorized content
5. Only permitted results are returned

---

## 4️⃣ Configuration Files Reference

### 🔹 `role_hierarchy.json` Structure

```json
{
  "roles": {
    "c-level": 100,
    "finance": 50,
    "hr": 50,
    "marketing": 50,
    "engineering": 50,
    "employee": 10
  }
}
🔹 How to Add a New Role

Add the role name with an access level

Define department permissions

Update metadata tagging logic

Test RBAC filtering

Example:
"legal": 50

🔹 How to Modify Permissions

Update permission matrix

Adjust metadata filters

Re-index documents if role scope changes

5️⃣ Security Considerations
🔐 Why RBAC Is Important

Prevents unauthorized data exposure

Enforces least-privilege access

Supports audit and compliance requirements

Protects sensitive financial and HR data

⚠️ Common Pitfalls to Avoid

Over-privileged roles

Missing metadata in documents

Hardcoding permissions in code

Not testing role-based queries

Ignoring role inheritance logic

## ✅ Conclusion

This RBAC configuration framework provides a secure and scalable approach to controlling access within the financial domain chatbot system. By defining a clear role hierarchy, permission matrix, and RBAC-aware search flow, the system ensures that users can access only the information permitted by their role and department. The use of configuration-driven role management allows easy extension and modification of permissions without impacting core logic. Overall, this RBAC design strengthens data security, supports compliance requirements, and enables reliable, enterprise-grade access control for retrieval-augmented chatbot applications.
