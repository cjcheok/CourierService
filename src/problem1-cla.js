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
    Load Delivery Code list from text file.
*/
let deliveryCostInputs = '';
try {  
    deliveryCostInputs = fs.readFileSync('inputs/delivery-cost.txt', 'utf8');
} catch(e) {
    console.log('Error:', e.stack);
}

/*
    Problem 01 Output
*/
console.log('Problem 01');
console.log('------------- Start -------------');
console.log('Delivery Cost Input : \n');
console.log( deliveryCostInputs + '\n--------------------------------' );
console.log('Delivery Cost Output : \n');
let deliveryCalculator = new DeliveryCalculator(10,5);
deliveryCalculator.initVoucher( voucherInputs );
console.log( deliveryCalculator.outputDeliveryCost( deliveryCostInputs ) + "\n------------- END -------------\n\n" );
