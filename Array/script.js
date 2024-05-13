// const arr = ["Hardik", "Harshil", "Dhruv", "Tirth"];
// console.log(arr);

// var res = prompt("What is your name");

// arr.includes(res)
//   ? alert("Welcome")
//   : alert("Sorry, maybe next time.");
const arr = [];
for (var i = 1; i <= 100; i++) {
  if (i % 3 === 0 && i % 5 === 0) {
    arr.push("FizzBuzz");
  } else if (i % 3 === 0) {
    arr.push("Fizz");
  } else if (i % 5 === 0) {
    arr.push("Buzz");
  } else {
    console.log(i);
    arr.push(i);
  }
  console.log(arr);
}
