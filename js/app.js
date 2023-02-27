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

acc1 = {
  owner: "Aye Win",
  interest: 0.7,
  movements: [2000, 2400, -3800, -1200, 4300, 1000, -2000, 1200, 2300],
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

//----------------- Calculate Balance ----------------
const calculateBalance = (movements) => {
  const balance = movements.reduce((accr, mov) => accr + mov, 0);
  //console.log(balance);

  user_balance.textContent = `${balance} €`;
};

// -----------------CALCULATE INTEREST --------------
const caluculateINterest = (movements) => {
  const int = movements
    .filter((mov) => mov > 0)
    .map((m) => (m * 0.7) / 100)
    .filter((f) => f >= 1)
    .reduce((accr, r) => accr + r, 0);
  //console.log(interest);
  interest.textContent = `${int} €`;
};

// ---------------- OUTCOME -------------------
const calculateOutcome = (movements) => {
  const outcome = movements
    .filter((mov) => mov < 0)
    .reduce((accr, r) => accr + r, 0);

  out.textContent = `${Math.abs(outcome)} €`;
};

// ------------ INCOME ---------------------
const caluculateIncome = (movements) => {
  const inc = movements
    .filter((mov) => mov > 0)
    .reduce((accr, r) => accr + r, 0);

  income.textContent = `${inc} €`;
};

//--------------- ADD TRANSITIONS ---------------
const addTransitions = (movements) => {
  left_grid.innerHTML = ""; // delete already content
  movements.forEach((mov, index) => {
    const type = mov > 0 ? "deposit" : "widthdrawl";
    const html = `
    <div class="row">
     <div>
       <button class="text ${type}">${index + 1} ${type}</button>
       <span class="date">12/03/2020</span>
     </div>
     <p>${mov}</p>
   </div>`;
    left_grid.insertAdjacentHTML("beforeend", html);
  });
};

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

    addTransitions(currentAccount.movements); // add transitions
    calculateBalance(currentAccount.movements); // calculate balance
    caluculateINterest(currentAccount.movements); // calculate Interest
    calculateOutcome(currentAccount.movements); // calculate outcome
    caluculateIncome(currentAccount.movements); // calculae income
  } else {
    alert("User and PIN are not same.Please Try Again");
  }
});
