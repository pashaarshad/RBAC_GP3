# 🏷️ Citation Badges

## 📌 Project
**Financial Domain Internal Chatbot with Role-Based Access Control (RBAC)**

This document describes the **Citation Badges** component used to visually represent the document sources referenced in chatbot responses.

---

## 🎯 Purpose

Citation Badges are designed to:
- Display document sources used by the RAG pipeline
- Improve transparency and user trust
- Make responses easier to verify and understand

---

## 🧩 What Information is Displayed

Each citation badge shows:
- **Document Name** – Source file used in response generation
- **Department** – Finance, HR, Engineering, etc.
- **Confidence Score** – Shown via tooltip (optional)

---

## 🎨 Design & UI Behavior

- Badges are displayed **below chatbot responses**
- Color-coded by department:
  - Finance → Blue
  - HR → Green
  - Engineering → Purple
  - General → Gray
- Compact, rounded UI for readability
- Hover tooltip displays confidence score

---

## 🔧 Implementation Details

- Built as a **reusable UI component**
- Uses **mock citation data** (no backend dependency)
- Easily extendable for real API integration
- Lightweight and responsive

---

## 🧠 Usage Flow

1. User submits a query
2. RAG pipeline retrieves relevant documents
3. Chatbot generates response
4. Citation Badges display referenced document sources

---

## ✅ Benefits

- Improves response credibility
- Enhances explainability
- Supports audit and compliance requirements
- Strengthens user confidence in chatbot answers

---

## 🚀 Future Enhancements

- Click badge to preview document
- Display full source path
- Add confidence threshold indicators
- Enable dark-mode specific styling

---

**File:** `CITATION_BADGES.md`  
**Week:** 7  
**Team:** Gamma – Data Visualization & Knowledge Base  
**Contributor:** Saranya
