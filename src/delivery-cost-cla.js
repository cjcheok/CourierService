const DeliveryCost = require('../src/delivery-cost');
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
let deliveryCost = new DeliveryCost(10,5);
deliveryCost.initVoucher( voucherInputs );
console.log( deliveryCost.output( deliverycostInputs ) + "\n------------- END -------------\n\n" );