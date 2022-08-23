const DeliveryCalculator = require('./libs/delivery-calculator');
let fs = require('fs');

/*
    Load Configs
*/
let configInputs = '';
try {  
    configInputs = fs.readFileSync('storage/delivery-cost-calculation/configs.txt', 'utf8');
} catch(e) {
    console.log('Error:', e.stack);
}


/*
    Load Vouchers list from text file.
*/
let voucherInputs = '';
try {  
    voucherInputs = fs.readFileSync('storage/delivery-cost-calculation/vouchers.txt', 'utf8');
} catch(e) {
    console.log('Error:', e.stack);
}


/*
    Load Delivery Code list from text file.
*/
let deliveryCostInputs = '';
try {  
    deliveryCostInputs = fs.readFileSync('storage/delivery-cost-calculation/packages.txt', 'utf8');
} catch(e) {
    console.log('Error:', e.stack);
}

/*
    Problem 01 Output
*/
try{
    console.log('Problem 01');
    console.log('------------- Start -------------');
    console.log('Delivery Cost Input : \n');
    console.log( deliveryCostInputs + '\n--------------------------------' );
    console.log('Delivery Cost Output : \n');
    let deliveryCalculator = new DeliveryCalculator(configInputs);
    deliveryCalculator.initVoucher( voucherInputs );
    console.log( deliveryCalculator.outputDeliveryCost( deliveryCostInputs ) + "\n------------- END -------------\n\n" );
}catch(er){
    console.log(`---> Error ${er.message}\n`);
}