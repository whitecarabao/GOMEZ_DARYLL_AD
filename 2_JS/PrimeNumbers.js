//Daryll's Prime Numbers Program

//If using Node packages were "ok", I would've imported
//an isPrime package for ease, but I'm assuming you'll 
//be mad huhu, so I made my own

var readline = require('readline');

var readline = readline.createInterface(
		process.stdin, process.stdout);

console.log("Daryll's Prime-ness Number Checker\n");


readline.question('Number to Check?: ', numToCheck => {
    console.log("Is the number "+ numToCheck +" a prime number?: " + isNumPrime(Number(numToCheck)));
    readline.close();
  });




//copied straight from my old prime number
//C Program from Prog 2 with Ma'am Miro




function isNumPrime(numToCheck){     
    flag = numToCheck-1;
    while (flag > 1){
      if ((numToCheck % flag) == 0) return false;
      flag--;
    }
    return true;
  }

//console.log("is 0 prime?: " + isNumPrime(0));
//console.log("is 100 prime?: " + isNumPrime(100));
//console.log("is 6 prime?: " + isNumPrime(6));
//console.log("is 5 prime?: " + isNumPrime(5));



