
const DeliveryCost = require('../src/delivery-cost');
const Voucher = require('../src/voucher');


let fs = require('fs');
// Load vouchers
let voucherInputs = '';
try {  
    voucherInputs = fs.readFileSync('inputs/vouchers.txt', 'utf8');
} catch(e) {
    console.log('Error:', e.stack);
}



describe("Delivery Cost Tests", () => {

    // setup voucher
    test("Voucher - Create Vocuer with valid inputs", async () => {
        let voucher = new Voucher( "OFR001 10 0 200 70 200" );
        expect( voucher.code ).toBe('OFR001');
        expect( voucher.percentage ).toBe(10);
        expect( voucher.minDistance ).toBe(0);
        expect( voucher.maxDistance ).toBe(200);
        expect( voucher.minWeight ).toBe(70);
        expect( voucher.maxWeight ).toBe(200);
    });

    test("Test", async () => {
        let dc = new DeliveryCost();
    });
});