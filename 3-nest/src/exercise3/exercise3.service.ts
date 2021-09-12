import { Injectable } from '@nestjs/common';

@Injectable()
export class Exercise3Service {
    loopsTriangle(totRows: number){
        var endResult = '';
        var storCase ='';
        for(var counter = 0; counter < totRows; counter++){
            for(var counterTwo = 0; counterTwo <=  counter; counterTwo++){
                endResult += "*";
            
           
            }
            console.log(endResult);
            storCase += endResult+"<br>";
            endResult = '';
        }
        return "Hello! Here is the triangle as you requested! <br><br> ---- <br>" + storCase;
    }

    helloWorld(pangalan: string){
        var today = new Date()
        var curHr = today.getHours()
        var greeting ='';
        if (curHr < 12) {
        greeting = 'Kompyuter: Magandang Umaga! <br><br><br>Kompyuter: Sana masarap ang kape mo, lods! <br>'
         } else if (curHr < 18) {
        greeting = 'Kompyuter: Magandang Hapon, lodicakes! <br><br><br> ----- <br>Kompyuter: Nagbreak ka na ba? <br>'
     } else {
         greeting = 'Kompyuter: Magandang Gabi! <br><br><br> ---- <br>Kompyuter: Hoy! Wag kalimotan matulog ng wasto, ha?'
        }

        return greeting + "<br>Kompyuter: Kumusta, Bn./Gg.: " + pangalan +"?     " + "<br>";

    }

    primeNumber(numToCheck: number){

        var flag = numToCheck-1;
        while (flag > 1){
          if ((numToCheck % flag) == 0) return "Number ["+ numToCheck +"] is NOT a prime!";
          flag--;
        }
        return "Number [" + numToCheck + "] is a prime!";
    }
}
