$(document).ready(function () {
  // =========================
  // INITIAL PAGE LOAD
  // =========================

  loadTable();
  calculateTotal();
  loadSpendingReport();

  // =========================
  // SAVE DAILY EARNINGS
  // =========================

  $("#earningsForm").on("submit", function (e) {
    e.preventDefault();

    const cash = Number($("#cash_payment").val()) || 0;
    const card = Number($("#credit_payments").val()) || 0;

    const expenseType = $("#expense-type").val();
    const expenseAmount = Number($("#expense-amount").val()) || 0;

    const otherExpense = $("#other-expense").val().trim();

    let transaction = "Income";
    let expense = 0;

    // =========================
    // EXPENSE
    // =========================

    if (expenseType !== "none") {
      expense = expenseAmount;

      if (expenseType === "other") {
        transaction = otherExpense || "Other";
      } else {
        transaction =
          expenseType.charAt(0).toUpperCase() + expenseType.slice(1);
      }
    }

    // =========================
    // PAYMENT
    // =========================

    const payment = {
      date: formatDate(new Date()),
      dateISO: new Date().toISOString(),

      cash: cash,
      card: card,

      expenseType: expenseType,
      expense: expense,

      transaction: transaction,

      total: cash + card - expense,
    };
    // Get existing payments
    const payments = JSON.parse(localStorage.getItem("payments")) || [];

    payments.push(payment);

    // Save
    localStorage.setItem("payments", JSON.stringify(payments));

    // Refresh data
    loadTable();
    calculateTotal();
    loadSpendingReport();

    // Clear form
    this.reset();
  });

  // =========================
  // SHOW/HIDE OTHER EXPENSE INPUT
  // =========================
  $("#expense-type").on("change", function () {
    if ($(this).val() === "other") {
      $("#other-expense").show();
      $("#other-expense").prop("required", true);
    } else {
      $("#other-expense").hide();
      $("#other-expense").prop("required", false);
      $("#other-expense").val("");
    }
  });

  // =========================
  // FORMAT DATE
  // =========================

  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const year = String(date.getFullYear()).slice(-2);

    return `${day}/${month}/${year}`;
  }

  // =========================
  // CONVERT STORED DATE
  // =========================

  function parsePaymentDate(payment) {
    // New records
    if (payment.dateISO) {
      const date = new Date(payment.dateISO);

      if (!isNaN(date.getTime())) {
        return date;
      }
    }

    // Old records
    if (payment.date) {
      const parts = payment.date.split("/");

      if (parts.length === 3) {
        let day = Number(parts[0]);
        let month = Number(parts[1]) - 1;
        let year = Number(parts[2]);

        // Handle old MM/DD/YYYY dates
        if (year > 1000) {
          return new Date(year, day - 1, month);
        }

        // Handle DD/MM/YY
        if (year < 100) {
          year += 2000;
        }

        return new Date(year, month, day);
      }
    }

    return null;
  }

  // =========================
  // DAILY PAYMENT HISTORY
  // =========================

  function loadTable() {
    const payments = JSON.parse(localStorage.getItem("payments")) || [];

    $("#tableBody").empty();

    payments.forEach(function (payment) {
      const cash = Number(payment.cash) || 0;

      const card = Number(payment.card) || 0;

      const expense = Number(payment.expense) || 0;

      const total = Number(payment.total) || 0;

      $("#tableBody").append(`

        <tr>

          <td>${payment.date}</td>

          <td>R${cash.toFixed(2)}</td>

          <td>R${card.toFixed(2)}</td>

          <td class="money-negative">
            R${expense.toFixed(2)}
          </td>

          <td class="${total >= 0 ? "money-positive" : "money-negative"}">
            R${total.toFixed(2)}
          </td>

        </tr>

      `);
    });
  }

  // =========================
  // TOTAL EARNINGS
  // =========================

  function calculateTotal() {
    const payments = JSON.parse(localStorage.getItem("payments")) || [];

    const total = payments.reduce(function (sum, payment) {
      return sum + (Number(payment.total) || 0);
    }, 0);

    $("#totalEarnings").text(`R${total.toFixed(2)}`);
  }

  // =========================
  // MONTHLY REPORT
  // =========================

  function loadMonthlyReport() {
    const payments = JSON.parse(localStorage.getItem("payments")) || [];

    const selectedMonth = $("#month").val();

    // No month selected
    if (!selectedMonth || selectedMonth === "placeholder") {
      $("#tableBody").html(`
        <tr>
          <td colspan="5">
            Select a month and click View Report
          </td>
        </tr>
      `);

      $("#total-cash").text("R0.00");
      $("#total-card").text("R0.00");
      $("#total-expenses").text("R0.00");
      $("#total-earnings").text("R0.00");

      return;
    }

    const monthNumber = {
      january: 0,
      february: 1,
      march: 2,
      april: 3,
      may: 4,
      june: 5,
      july: 6,
      august: 7,
      september: 8,
      october: 9,
      november: 10,
      december: 11,
    };

    const selectedMonthNumber = monthNumber[selectedMonth];

    // Current year
    const currentYear = new Date().getFullYear();

    // Filter month + year
    const filteredPayments = payments.filter(function (payment) {
      const paymentDate = parsePaymentDate(payment);

      if (!paymentDate) {
        return false;
      }

      return (
        paymentDate.getMonth() === selectedMonthNumber &&
        paymentDate.getFullYear() === currentYear
      );
    });

    // Clear table
    $("#tableBody").empty();

    // =========================
    // NO DATA
    // =========================

    if (filteredPayments.length === 0) {
      $("#tableBody").html(`
        <tr>
          <td colspan="5">
            No data available
          </td>
        </tr>
      `);

      $("#total-cash").text("R0.00");
      $("#total-card").text("R0.00");
      $("#total-expenses").text("R0.00");
      $("#total-earnings").text("R0.00");

      return;
    }

    // =========================
    // CALCULATE TOTALS
    // =========================

    let totalCash = 0;
    let totalCard = 0;
    let totalExpenses = 0;
    let totalEarnings = 0;

    filteredPayments.forEach(function (payment) {
      const cash = Number(payment.cash) || 0;

      const card = Number(payment.card) || 0;

      const expense = Number(payment.expense) || 0;

      const total = Number(payment.total) || 0;

      totalCash += cash;
      totalCard += card;
      totalExpenses += expense;
      totalEarnings += total;

      $("#tableBody").append(`

        <tr>

          <td>${payment.date}</td>

          <td>R${cash.toFixed(2)}</td>

          <td>R${card.toFixed(2)}</td>

          <td class="money-negative">
            R${expense.toFixed(2)}
          </td>

          <td class="${total >= 0 ? "money-positive" : "money-negative"}">
            R${total.toFixed(2)}
          </td>

        </tr>

      `);
    });

    // =========================
    // DISPLAY TOTALS
    // =========================

    $("#total-cash").text(`R${totalCash.toFixed(2)}`);

    $("#total-card").text(`R${totalCard.toFixed(2)}`);

    $("#total-expenses").text(`R${totalExpenses.toFixed(2)}`);

    $("#total-earnings").text(`R${totalEarnings.toFixed(2)}`);

    // Update heading
    const monthName =
      selectedMonth.charAt(0).toUpperCase() + selectedMonth.slice(1);

    $("#month-title").text(`${monthName} ${currentYear} Transactions`);
  }

  // =========================
  // VIEW REPORT BUTTON
  // =========================

  $("#viewReport").on("click", function () {
    loadMonthlyReport();
  });

  // =========================
  // SPENDING REPORT
  // =========================

  function loadSpendingReport() {
    const payments = JSON.parse(localStorage.getItem("payments")) || [];

    $("#spending-report-body").empty();

    if (payments.length === 0) {
      $("#spending-report-body").html(`
      <tr>
        <td colspan="3">No data available</td>
      </tr>
    `);

      $("#total-spending").text("R0.00");

      return;
    }

    let totalSpending = 0;

    payments.forEach(function (payment) {
      const cash = Number(payment.cash) || 0;

      const card = Number(payment.card) || 0;

      const expense = Number(payment.expense) || 0;

      // =========================
      // INCOME
      // =========================

      if (cash > 0 || card > 0) {
        const income = cash + card;

        $("#spending-report-body").append(`
        <tr>
          <td>${payment.date}</td>
          <td class="money-positive">Income</td>
          <td class="money-positive">
            R${income.toFixed(2)}
          </td>
        </tr>
      `);
      }

      // =========================
      // EXPENSE
      // =========================

      if (expense > 0) {
        const transaction =
          payment.transaction || payment.expenseType || "Other";

        $("#spending-report-body").append(`
        <tr>
          <td>${payment.date}</td>
          <td class="money-negative">
            ${transaction}
          </td>
          <td class="money-negative">
            -R${expense.toFixed(2)}
          </td>
        </tr>
      `);

        totalSpending += expense;
      }
    });

    $("#total-spending").text(`R${totalSpending.toFixed(2)}`);
  }
  // =========================
  // RESET REPORT
  // =========================

  // =========================
  // RESET REPORT
  // =========================

  $("#reset-btn").on("click", function () {
    const confirmReset = confirm(
      "WARNING!\n\n" +
        "This will permanently delete all saved payment data.\n\n" +
        "Do you want to continue?",
    );

    if (!confirmReset) {
      return;
    }

    // Ask for password

    const password = prompt("Enter the reset password:");

    if (password === null) {
      return;
    }

    // Check password

    if (password !== "@King4one") {
      alert("Incorrect password.\n\n" + "Your data has NOT been deleted.");

      return;
    }

    // =========================
    // DELETE DATA
    // =========================

    localStorage.removeItem("payments");

    // =========================
    // REFRESH DAILY REPORT
    // =========================

    if (typeof loadTable === "function") {
      loadTable();
    }

    if (typeof calculateTotal === "function") {
      calculateTotal();
    }

    if (typeof loadSpendingReport === "function") {
      loadSpendingReport();
    }

    // =========================
    // CLEAR MONTHLY REPORT
    // =========================

    $("#tableBody").html(`
    <tr>
      <td colspan="5">
        Select a month and click View Report
      </td>
    </tr>
  `);

    $("#total-cash").text("R0.00");
    $("#total-card").text("R0.00");
    $("#total-expenses").text("R0.00");
    $("#total-earnings").text("R0.00");

    // =========================
    // RESET SPENDING REPORT
    // =========================

    $("#spending-report-body").html(`
    <tr>
      <td colspan="3">
        No data available
      </td>
    </tr>
  `);

    $("#total-spending").text("R0.00");

    // =========================
    // RESET MONTH SELECTION
    // =========================

    $(".month-options input[type='checkbox']").prop("checked", false);

    $("#monthDropdownButton").text("Select months ▼");

    // =========================
    // SUCCESS MESSAGE
    // =========================

    alert("Reset successful!\n\n" + "All payment data has been deleted.");
  });
});
