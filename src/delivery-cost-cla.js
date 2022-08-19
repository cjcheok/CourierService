const DeliveryCalculator = require('./delivery-calculator');
let fs = require('fs');

let voucherInputs = '';
try {  
    voucherInputs = fs.readFileSync('inputs/vouchers.txt', 'utf8');
} catch(e) {
    console.log('Error:', e.stack);
}

let deliveryCostInputs = '';
try {  
    deliveryCostInputs = fs.readFileSync('inputs/delivery-cost.txt', 'utf8');
} catch(e) {
    console.log('Error:', e.stack);
}

let deliveryTimeInputs = '';
try {  
    deliveryTimeInputs = fs.readFileSync('inputs/delivery-time-estimation.txt', 'utf8');
} catch(e) {
    console.log('Error:', e.stack);
}

console.log('Probvlem 01');
console.log('------------- Start -------------');
console.log('Delivery Cost Input : \n');
console.log( deliveryCostInputs + '\n--------------------------------' );
console.log('Delivery Cost Output : \n');
let deliveryCalculator = new DeliveryCalculator(10,5);
deliveryCalculator.initVoucher( voucherInputs );
console.log( deliveryCalculator.outputDeliveryCost( deliveryCostInputs ) + "\n------------- END -------------\n\n" );
console.log('Probvlem 02');
console.log('------------- Start -------------');
console.log('Delivery Time Input : \n');
console.log( deliveryTimeInputs + '\n--------------------------------' );
console.log('Delivery Time Output : \n');
console.log( deliveryCalculator.outputDeliveryTime( deliveryTimeInputs ) + "\n------------- END -------------\n\n" );