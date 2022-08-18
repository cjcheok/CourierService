const DeliveryCalculator = require('./delivery-calculator');
let fs = require('fs');

let voucherInputs = '';
try {  
    voucherInputs = fs.readFileSync('inputs/vouchers.txt', 'utf8');
} catch(e) {
    console.log('Error:', e.stack);
}

// Load vouchers
let deliverycostInputs = '';
try {  
    deliverycostInputs = fs.readFileSync('inputs/delivery-cost.txt', 'utf8');
} catch(e) {
    console.log('Error:', e.stack);
}
console.log('------------- Start -------------');
console.log('Delivery Cost Input : ');
console.log( deliverycostInputs + '\n' );
console.log('Delivery Cost Output : ');
let deliveryCalculator = new DeliveryCalculator(10,5);
deliveryCalculator.initVoucher( voucherInputs );
console.log( deliveryCalculator.outputDeliveryCost( deliverycostInputs ) + "\n------------- END -------------\n\n" );