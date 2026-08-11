# 💰 Waiter Calculator

A simple and modern **Waiter Earnings & Expense Tracker** built with HTML, CSS, JavaScript, jQuery, and packaged as an Android application using Android Studio.

The app allows waiters to record daily cash/card earnings, track expenses, view monthly reports, and monitor total spending.

---

## 📱 Features

### 💵 Daily Earnings
- Record cash payments
- Record card payments
- Automatically calculate daily earnings
- Record expenses
- Automatically subtract expenses from daily earnings
- Save data using browser/app `localStorage`

### 📊 Monthly Reports
- Select one or multiple months
- View transactions for selected months
- Display:
  - Cash earnings
  - Card earnings
  - Expenses
  - Total earnings
- Automatically calculate monthly totals
- Display **"No data available"** when no transactions exist

### 💸 Spending Report
- Automatically detect recorded expenses
- Display expense type
- Display expense amount
- Calculate total spending

### 🔄 Reset System
- Reset all saved payment data
- Password-protected reset
- Confirmation before deleting data

### 📱 Android App
- Packaged as an Android application using Android Studio
- Uses Android WebView
- Works with the existing HTML/CSS/JavaScript interface
- Supports local storage
- Can operate offline when dependencies are stored locally

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Application structure |
| CSS3 | Styling and responsive design |
| JavaScript | Application logic |
| jQuery | DOM manipulation and events |
| LocalStorage | Saving application data |
| Kotlin | Android application wrapper |
| Android Studio | Android development |
| WebView | Running the web application |
| Git/GitHub | Version control |

---

## 📂 Project Structure

```text
WaiterApp/
│
├── app/
│   └── src/
│       └── main/
│           │
│           ├── assets/
│           │   └── waiter-calculator/
│           │       │
│           │       ├── Js_script/
│           │       │   ├── jquery-3.7.1.min.js
│           │       │   └── waiter_calc.js
│           │       │
│           │       ├── pages/
│           │       │   ├── waiter_board.html
│           │       │   ├── monthly_report.html
│           │       │   └── spending_report.html
│           │       │
│           │       └── styling/
│           │           └── style.css
│           │
│           ├── java/
│           │   └── com/
│           │       └── example/
│           │           └── waiter_app/
│           │               └── MainActivity.kt
│           │
│           └── res/
│
├── gradle/
├── build.gradle.kts
└── README.md
