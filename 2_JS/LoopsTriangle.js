//Daryll's LoopsTriangle Pyramid Exercise

var endResult = '';
var totRows = 6;

for(var counter = 0; counter < totRows; counter++){
    for(var counterTwo = 0; counterTwo <=  counter; counterTwo++){
        endResult += "*";
        
   
    }
    console.log(endResult);
    endResult = '';
}

