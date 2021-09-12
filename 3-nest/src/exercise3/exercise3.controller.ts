import { Controller, Get, Param } from '@nestjs/common';
import { Exercise3Service } from './exercise3.service';

@Controller('exercise3')
export class Exercise3Controller {
    constructor(private readonly e3:Exercise3Service){}

    @Get('/loopsTriangle/:totRows')
    loopsTriangle(@Param('totRows') totRows: string){
        var parsedHeight:number = parseInt(totRows);
            return this.e3.loopsTriangle(parsedHeight);
        }

    @Get('/hello/:pangalan')
    helloWorld(@Param('pangalan') pangalan: string){
        return this.e3.helloWorld(pangalan);
        
    }

    @Get('/prime/:numero')
    primeNumber(@Param('numero') numero: string){
        var parsedNum: number = parseInt(numero);
            return this.e3.primeNumber(parsedNum);
    }

    }
