//Daryll's Multiplication Table Attempt

//"Work smarter, not harder!"
//Ma'am Lorna D. Miro




var endRes = '';
var multiplier = 1;

for(var anotherCounter = 1; anotherCounter <= 10; anotherCounter++){

    for(var counter = 1; counter <= 10; counter++){
    endRes += anotherCounter * counter + '\t';
    multiplier++;
    }
    console.log(endRes);
    endRes = '';
}


