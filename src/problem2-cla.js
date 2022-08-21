const DeliveryCalculator = require('./delivery-calculator');
let fs = require('fs');


/*
    Load Vouchers list from text file.
*/
let voucherInputs = '';
try {  
    voucherInputs = fs.readFileSync('inputs/vouchers.txt', 'utf8');
} catch(e) {
    console.log('Error:', e.stack);
}

/*
    Load Delivery Time Estimation list from text file.
*/
let deliveryTimeInputs = '';
try {  
    deliveryTimeInputs = fs.readFileSync('inputs/delivery-time-estimation.txt', 'utf8');
} catch(e) {
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
    let deliveryCalculator = new DeliveryCalculator(10,5);
    deliveryCalculator.initVoucher( voucherInputs );
    console.log( deliveryCalculator.outputDeliveryTime( deliveryTimeInputs ) + "\n------------- END -------------\n\n" );

}catch(er){
    console.log(`---> Error ${er.message}\n`);
}