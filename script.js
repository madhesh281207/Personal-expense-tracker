let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let chart = null;

function updateUI() {
    const list = document.getElementById("list");
    const balance = document.getElementById("balance");
    const income = document.getElementById("income");
    const expense = document.getElementById("expense");
    const search = document.getElementById("search").value.toLowerCase();

    list.innerHTML = "";

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction, index) => {

        if (
            !transaction.text.toLowerCase().includes(search) &&
            !transaction.category.toLowerCase().includes(search)
        ) {
            return;
        }

        const li = document.createElement("li");

        li.innerHTML = `
            <div>
                <strong>${transaction.text}</strong><br>
                Category: ${transaction.category}<br>
                Amount:
                <span style="color:${transaction.amount >= 0 ? "green" : "red"}">
                    ₹${transaction.amount}
                </span><br>
                <small>${transaction.date}</small>
            </div>

            <button class="delete" onclick="deleteTransaction(${index})">
                Delete
            </button>
        `;

        list.appendChild(li);

        if (transaction.amount >= 0)
            totalIncome += transaction.amount;
        else
            totalExpense += Math.abs(transaction.amount);
    });

    balance.innerText = "₹" + (totalIncome - totalExpense);
    income.innerText = "₹" + totalIncome;
    expense.innerText = "₹" + totalExpense;

    drawChart();

    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function addTransaction() {

    const text = document.getElementById("text").value.trim();
    const category = document.getElementById("category").value;
    const amount = Number(document.getElementById("amount").value);
    const date = document.getElementById("date").value;

    if (text === "" || date === "" || amount === 0) {
        alert("Please fill all fields.");
        return;
    }

    transactions.push({
        text,
        category,
        amount,
        date
    });

    document.getElementById("text").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("date").value = "";

    updateUI();
}

function deleteTransaction(index) {
    transactions.splice(index, 1);
    updateUI();
}

function drawChart() {

    const categories = {};

    transactions.forEach(transaction => {

        if (transaction.amount < 0) {

            if (!categories[transaction.category]) {
                categories[transaction.category] = 0;
            }

            categories[transaction.category] += Math.abs(transaction.amount);
        }
    });

    const ctx = document.getElementById("expenseChart");

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "bottom"
                }
            }
        }
    });
}

function toggleDarkMode() {
    document.body.classList.toggle("dark");
}

updateUI();