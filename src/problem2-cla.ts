import {DeliveryCalculator} from './libs/delivery-calculator';
{

    let fs = require('fs');

    /*
        Load Configs
    */
    let configInputs:string = '';
    try {  
        configInputs = fs.readFileSync('storage/delivery-time-calculation/configs.txt', 'utf8');
    } catch(e:any) {
        console.log('Error:', e.stack);
    }
    /*
        Load Vouchers list from text file.
    */
    let voucherInputs:string = '';
    try {  
        voucherInputs = fs.readFileSync('storage/delivery-time-calculation/vouchers.txt', 'utf8');
    } catch(e:any) {
        console.log('Error:', e.stack);
    }

    /*
        Load Delivery Time Estimation list from text file.
    */
    let deliveryTimeInputs:string = '';
    try {  
        deliveryTimeInputs = fs.readFileSync('storage/delivery-time-calculation/packages.txt', 'utf8');
    } catch(e:any) {
        console.log('Error:', e.stack);
    }
    /*
        Problem 02 Output
    */
    try{
        console.log('Problem 02');
        console.log('------------- Start -------------');
        console.log('Delivery Time Input : \n');
        console.log( deliveryTimeInputs + '\n--------------------------------' );
        console.log('Delivery Time Output : \n');
        let deliveryCalculator:DeliveryCalculator = new DeliveryCalculator(configInputs);
        deliveryCalculator.initVoucher( voucherInputs );
        console.log( deliveryCalculator.outputDeliveryTime( deliveryTimeInputs ) + "\n------------- END -------------\n\n" );

    }catch(er:any){
        console.log(`---> Error ${er.message}\n`);
    }
}