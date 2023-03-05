const user = document.querySelector(".user");
const pin = document.querySelector(".pin");

const btn_login = document.querySelector(".btn_login");
const main_container = document.querySelector(".main_container");
const welcome = document.querySelector(".welcome");
const user_balance = document.querySelector(".user_balance");

const left_grid = document.querySelector(".left--grid");

const interest = document.querySelector(".interest");
const out = document.querySelector(".out");
const income = document.querySelector(".in");

const btn_transfer = document.querySelector(".btn_transfer");
const text_amount = document.querySelector(".text_amount");
const text_transfer = document.querySelector(".text_transfer");

const confirm_user_text = document.querySelector(".confirm_user_text");
const confirm_pin_text = document.querySelector(".confirm_pin_text");

const loan_arrow = document.querySelector(".loan_arrow");
const amount_btn = document.querySelector(".amount_btn");

const btn_loan = document.querySelector(".btn_loan");
const loan_text = document.querySelector(".loan_text");

const sort = document.querySelector(".sort");

acc1 = {
  owner: "Aye Win",
  interest: 0.7,
  movements: [2000, 2400, -3800, -1200, 4300, 1000, 2000],
  pin: 1111,
};
acc2 = {
  owner: "Mya San",
  interest: 0.2,
  movements: [1000, 2500, -1800, 7800, -2900, 3000, -2100, 3400, 2000],
  pin: 2222,
};
acc3 = {
  owner: "Tun Aung",
  interest: 0.5,
  movements: [1000, -2100, 4500, -9800, -1300, 5000 - 2600, 3400, 2500],
  pin: 333,
};

const accounts = [acc1, acc2, acc3];

//-------------- computing user name -----------------
const createUserName = (accs) => {
  accs.forEach((acc) => {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((word) => word[0])
      .join("");
    // console.log(acc.username); //  aw ms ta
  });
};
createUserName(accounts);

//-------------------- USER LOGIN --------------------
let currentAccount;
btn_login.addEventListener("click", (e) => {
  e.preventDefault();
  currentAccount = accounts.find((acc) => acc.username === user.value);
  console.log(currentAccount);
  //console.log(typeof pin.value);
  if (currentAccount?.pin === Number(pin.value)) {
    main_container.style.opacity = 1; // recall main-container
    welcome.textContent = `Welcome To ${currentAccount.owner.split(" ")[0]}`;

    //clear text data
    user.value = pin.value = "";
    //hide cursor
    pin.blur();

    //Update UI
    updateUI();
  } else {
    alert("User and PIN are not same.Please Try Again");
  }
});

//---------------------- TRANSFER MONEY ----------------------------
btn_transfer.addEventListener("click", (e) => {
  e.preventDefault();
  const amount = Number(text_amount.value);
  const receive = text_transfer.value;
  const receiveAcc = accounts.find((f) => f.username === receive); // whether if transfer to acc name is in accounts
  console.log("receive acc", receiveAcc);
  if (
    receiveAcc.username !== currentAccount.username &&
    amount > 0 &&
    amount < currentAccount.balance
  ) {
    currentAccount.movements.push(-amount);
    console.log("current acc after pushing amount", currentAccount.movements);
    receiveAcc.movements.push(amount);

    // Update UI
    updateUI();

    //clear text data
    text_amount.value = text_transfer.value = "";
    //hide cursor
    text_transfer.blur();
  } else
    alert(
      "You cannot transfer into your account or you don't have enough amount. Please, Try again"
    );
});

// ---------------------------- CLOSE ACCOUNT -----------------
btn_loan.addEventListener("click", (e) => {
  e.preventDefault();
  if (
    currentAccount.username === confirm_user_text.value &&
    currentAccount.pin === Number(confirm_pin_text.value)
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    main_container.style.opacity = 0;
  } else alert("username and password not same.Please try again");
});

// --------------------- LOAN ACCOUNT ----------------
loan_arrow.addEventListener("click", (e) => {
  e.preventDefault();
  const loanAmount = Number(loan_text.value);
  if (
    loanAmount > 0 &&
    currentAccount.movements.some((mov) => mov >= loanAmount * 0.1)
  ) {
    currentAccount.movements.push(loanAmount);

    //update UI
    updateUI();

    //clear loan input field
    loan_text.value = "";
    loan_text.blur();
  } else {
    alert("You must have under 10% of loan amount");
  }
});

//UPDATE UI
const updateUI = () => {
  addTransitions(currentAccount); // add transition
  calculateBalance(currentAccount); // calculate balance
  caluculateINterest(currentAccount); // calculate Interest
  calculateOutcome(currentAccount); // calculate outcome
  caluculateIncome(currentAccount); // calculae income
};

//to add total amount of movements having in all accounts

const totalAmount = accounts
  .map((acc) => acc.movements)
  .flat()
  .reduce((accr, mov) => accr + mov, 0);

//******* OR *****
const totalAmt = accounts
  .flatMap((acc) => acc.movements)
  .reduce((accr, mov) => accr + mov, 0);
console.log("total amount of mov", totalAmt);

//----------------- Calculate Balance ----------------
const calculateBalance = (currentAccount) => {
  currentAccount.balance = currentAccount.movements.reduce(
    (accr, mov) => accr + mov,
    0
  );
  //console.log(balance);
  console.log("balance", currentAccount.balance);

  user_balance.textContent = `${currentAccount.balance} €`;
};

// -----------------CALCULATE INTEREST --------------
const caluculateINterest = (currentAccount) => {
  const int = currentAccount.movements
    .filter((mov) => mov > 0)
    .map((m) => (m * currentAccount.interest) / 100)
    .filter((f) => f >= 1)
    .reduce((accr, r) => accr + r, 0);
  console.log("interest value is ", int);
  interest.textContent = `${int} €`;
};

// ---------------- OUTCOME -------------------
const calculateOutcome = (currentAccount) => {
  const outcome = currentAccount.movements
    .filter((mov) => mov < 0)
    .reduce((accr, r) => accr + r, 0);

  out.textContent = `${Math.abs(outcome)} €`;
};

// ------------ INCOME ---------------------
const caluculateIncome = (currentAccount) => {
  const inc = currentAccount.movements
    .filter((mov) => mov > 0)
    .reduce((accr, r) => accr + r, 0);

  income.textContent = `${inc} €`;
};

//--------------- ADD TRANSITIONS ---------------
const addTransitions = (currentAccount, sort = false) => {
  left_grid.innerHTML = ""; // delete already content

  const sortedMov = sort
    ? currentAccount.movements.slice().sort((a, b) => a - b)
    : currentAccount.movements;

  sortedMov.forEach((mov, index) => {
    const type = mov > 0 ? "deposit" : "widthdrawl";
    const html = `
    <div class="row">
     <div>
       <button class="text ${type}">${index + 1} ${type}</button>
       <span class="date">12/03/2020</span>
     </div>
     <p>${mov} €</p>
   </div>`;
    left_grid.insertAdjacentHTML("afterbegin", html);
    //left_grid.insertAdjacentHTML("beforeend", html);
  });
};

//sorting movements
let sorted = false;
sort.addEventListener("click", (e) => {
  e.preventDefault();
  addTransitions(currentAccount, !sorted);
  sorted = !sorted;
});

// total mount of mov > 0
const totalAmountOfdeposit = accounts
  .flatMap((mov) => mov.movements)
  .filter((f) => f > 0)
  .reduce((accr, r) => accr + r, 0);
console.log("total Amount Of deposit : ", totalAmountOfdeposit);

//length of  deposit value at least 1000
const depositValueAtLeast1000 = accounts
  .flatMap((mov) => mov.movements)
  //  .filter((f) => f >= 1000).length;
  .reduce((accr, r) => (r >= 1000 ? accr + 1 : accr), 0);

console.log(
  "lenght of deposit value at least 1000 : ",
  depositValueAtLeast1000
);

const sum = accounts
  .flatMap((mov) => mov.movements)
  .reduce(
    (accr, r) => {
      r > 0 ? (accr.deposit += r) : (accr.widthdraw += r);
      return accr;
    },
    {
      deposit: 0,
      widthdraw: 0,
    }
  );
console.log(sum);

//this is a nice title => This Is a Nice Title
const makeTitle = (titleText) => {
  const exception = ["a", "an", "the", "with", "but", "or", "on", "in"];
  const title = titleText
    .toLowerCase()
    .split(" ")
    .map((m) => (exception.includes(m) ? m : m[0].toUpperCase() + m.slice(1)))
    .join(" ");
  console.log("title text: ", title);
};
makeTitle("tHis iS a nice title");

//sort()
// const name = ["tun tun", "zaw zaw", "aye aye", "ma ma"];
// console.log(name.sort());
// const num = [21, 12, -13, -45, 30];
// console.log(num.sort());

// const numb = (a, b) => {
//   if (a > b) return "positive value";// same (a-b)
//   if (a < b) return "negative value";
// };

// ********************sort() cannot work in num array it only affect in string ************

// const arr = new Array(1, 2, 3, 4, 5);
// const array = [1, 2, 3, 4, 5];

// const a = arr.fill(9, 0, 4);
// console.log(a);

// const b = Array.from({ length: 3 }, () => 4);
// console.log(b);
