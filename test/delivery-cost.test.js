
const DeliveryCost = require('../src/delivery-cost');
const Voucher = require('../src/voucher');
const Parcel = require('../src/parcel');
const VoucherCollection = require('../src/voucher-collection');

let fs = require('fs');

// Load vouchers inputs
let voucherInputs = '';
try {  
    voucherInputs = fs.readFileSync('inputs/vouchers.txt', 'utf8');
} catch(e) {
    console.log('Error:', e.stack);
}

// Load vouchers
let deliverycostInputs = '';
try {  
    deliverycostInputs = fs.readFileSync('inputs/deliverycost.txt', 'utf8');
} catch(e) {
    console.log('Error:', e.stack);
}

let deliverycostInputsInvalid = '';
try {  
    deliverycostInputsInvalid = fs.readFileSync('inputs/deliverycostInvalid.txt', 'utf8');
} catch(e) {
    console.log('Error:', e.stack);
}

describe("Delivery Cost Tests", () => {


    const BASE_COST = 100;
    const WEIGHT_MULTIPLYER = 10;
    const DISTANCE_MULTIPLYER = 5;

    // setup voucher
    test("Voucher - Create voucher with valid inputs", async () => {
        let voucher = new Voucher( "OFR001 10 0 200 70 200" );
        expect( voucher.code ).toBe('OFR001');
        expect( voucher.percentage ).toBe(10);
        expect( voucher.minDistance ).toBe(0);
        expect( voucher.maxDistance ).toBe(200);
        expect( voucher.minWeight ).toBe(70);
        expect( voucher.maxWeight ).toBe(200);
    });

    test("Voucher - Create voucher with invalid inputs", async () => {
        try{
            let voucher = new Voucher( "OFR001 10 A 200 70 200" );
        }catch( er ){
            expect( er ).toBe('Invalid parameter formats.');
        }
    });

    test("Voucher - Create voucher with negative numeric inputs", async () => {
        try{
            let voucher = new Voucher( "OFR001 -10 0 -200 -70 -200" );
        }catch( er ){
            expect( er ).toBe('Invalid parameter formats.');
        }
    });


    test("Parcel - Create parcel with valid inputs", async () => {
        let parcel = new Parcel( "PKG1 5 5 OFR001" );
        expect( parcel.id ).toBe('PKG1');
        expect( parcel.weight ).toBe(5);
        expect( parcel.distance ).toBe(5);
        expect( parcel.voucherCode ).toBe('OFR001');
    });

    test("Parcel - Create parcel with invalid inputs", async () => {
        try{
            let parcel = new Parcel( "PKG1 A A OFR001" );
        }
        catch(er){
            throw(er).toBe('Invalid parameter formats.');
        }
    });

    test("Parcel - Create parcel with negative numberic inputs", async () => {
        try{
            let parcel = new Parcel( "PKG1 -5 -100 OFR001" );
        }
        catch(er){
            throw(er).toBe('Invalid parameter formats.');
        }
    });


    test("Parcel - Calculate Cost", async () => {
        let parcel = new Parcel( "PKG1 5 5 OFR001" );
        expect( parcel.getCost(BASE_COST, WEIGHT_MULTIPLYER, DISTANCE_MULTIPLYER) ).toBe(175);

        parcel = new Parcel( "PKG1 15 5 OFR001" );
        expect( parcel.getCost(BASE_COST, WEIGHT_MULTIPLYER, DISTANCE_MULTIPLYER) ).toBe(275);
    });

    test("Voucher Collection - Create voucher collection from file input", async () => {
        let voucherCollection = new VoucherCollection( voucherInputs );
        expect( voucherCollection.length() ).toBe(3);
    });

    test("Voucher Collection - Search voucher by code", async () => {
        let voucherCollection = new VoucherCollection( voucherInputs );
        expect( voucherCollection.find( 'OFR002' ) ).not.toBeNull();
        expect( voucherCollection.find( 'OFR005' ) ).toBeNull();
    });

    test("Voucher Collection - Perform search by passing parcel object.", async () => {
        let parcel = new Parcel( "PKG1 5 5 OFR001" );
        let voucherCollection = new VoucherCollection( voucherInputs );
        expect( voucherCollection.match( parcel ) ).toBeNull();

        parcel = new Parcel( "PKG3 10 100 OFR003" );
        voucherCollection.match( parcel ) ;
        expect( voucherCollection.match( parcel ) ).not.toBeNull();
    });


    test("Voucher Collection - Get Discount.", async () => {
        let parcel = new Parcel( "PKG1 5 5 OFR001" );
        let voucherCollection = new VoucherCollection( voucherInputs );
        expect( voucherCollection.getDiscount( parcel ) ).toBe(0);

        parcel = new Parcel( "PKG3 10 100 OFR003" );
        voucherCollection.match( parcel ) ;
        expect( voucherCollection.getDiscount( parcel ) ).toBe(5);
    });

    test("Parcel - Calculate Discount & Total Cost", async () => {
        let voucherCollection = new VoucherCollection( voucherInputs );

        let parcel = new Parcel( "PKG1 5 5 OFR001" );
        expect( parcel.getTotal( BASE_COST, WEIGHT_MULTIPLYER, DISTANCE_MULTIPLYER, voucherCollection.getDiscount(parcel) ) ).toBe(175);

        parcel = new Parcel( "PKG3 10 100 OFR003" );
        expect( parcel.getTotal( BASE_COST, WEIGHT_MULTIPLYER, DISTANCE_MULTIPLYER, voucherCollection.getDiscount(parcel) ) ).toBe(665);
    });
    


    test("DeliveryCost - with valid inputs", async () => {
        let deliveryCost = new DeliveryCost(10,5);
        deliveryCost.initVoucher( voucherInputs );
        //console.log( deliveryCost.output( deliverycostInputs ) );
        expect( deliveryCost.output( deliverycostInputs ) ).toBe("PKG1 0 175\nPKG2 0 275\nPKG3 35 665");
    });
    
    test("DeliveryCost - with invalid inputs", async () => {

        try{
            let deliveryCost = new DeliveryCost(10,5);
            deliveryCost.initVoucher( voucherInputs );
            expect( deliveryCost.output( deliverycostInputsInvalid ) ).toBe("PKG1 0 175\nPKG2 0 275\nPKG3 35 665");
        }catch(er){
            expect(er).toBe('Number of parcels mismatch.');
        }
    });
});