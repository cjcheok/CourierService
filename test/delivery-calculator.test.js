
const DeliveryCalculator = require('../src/delivery-calculator');
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
let deliveryCostInputs = '';
try {  
    deliveryCostInputs = fs.readFileSync('inputs/delivery-cost.txt', 'utf8');
} catch(e) {
    console.log('Error:', e.stack);
}

let deliveryCostInputsInvalid = '';
try {  
    deliveryCostInputsInvalid = fs.readFileSync('inputs/delivery-cost-invalid.txt', 'utf8');
} catch(e) {
    console.log('Error:', e.stack);
}

let deliveryTimeInputs = '';
try {  
    deliveryTimeInputs = fs.readFileSync('inputs/delivery-time-estimation.txt', 'utf8');
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

        expect(
            () => {
                let voucher = new Voucher( "OFR001 10 A 200 70 200" );
            }
        ).toThrow();
    });

    test("Voucher - Create voucher with negative numeric inputs", async () => {
        expect(
            () => {
                let voucher = new Voucher( "OFR001 -10 0 -200 -70 -200" );
            }
        ).toThrow();
    });


    test("Parcel - Create parcel with valid inputs", async () => {
        let parcel = new Parcel( "PKG1 5 5 OFR001" );
        expect( parcel.id ).toBe('PKG1');
        expect( parcel.weight ).toBe(5);
        expect( parcel.distance ).toBe(5);
        expect( parcel.voucherCode ).toBe('OFR001');
    });

    test("Parcel - Create parcel with invalid inputs", async () => {
        expect(
            () => {
                let parcel = new Parcel( "PKG1 A A OFR001" );
            }
        ).toThrow();
    });

    test("Parcel - Create parcel with negative numberic inputs", async () => {
        expect(
            () => {
                let parcel = new Parcel( "PKG1 -5 -100 OFR001" );
            }   
        ).toThrow();
    });

    test("Parcel - Calculate Cost", async () => {
        let parcel = new Parcel( "PKG1 5 5 OFR001" );
        expect( parcel.calculateCost(BASE_COST, WEIGHT_MULTIPLYER, DISTANCE_MULTIPLYER) ).toBe(175);

        parcel = new Parcel( "PKG1 15 5 OFR001" );
        expect( parcel.calculateCost(BASE_COST, WEIGHT_MULTIPLYER, DISTANCE_MULTIPLYER) ).toBe(275);

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
        expect( parcel.calculateTotal( BASE_COST, WEIGHT_MULTIPLYER, DISTANCE_MULTIPLYER, voucherCollection.getDiscount(parcel) ) ).toBe(175);

        parcel = new Parcel( "PKG3 10 100 OFR003" );
        expect( parcel.calculateTotal( BASE_COST, WEIGHT_MULTIPLYER, DISTANCE_MULTIPLYER, voucherCollection.getDiscount(parcel) ) ).toBe(665);

        parcel = new Parcel( "PKG4 110 60 OFR002" );
        expect( parcel.calculateTotal( BASE_COST, WEIGHT_MULTIPLYER, DISTANCE_MULTIPLYER, voucherCollection.getDiscount(parcel) ) ).toBe(1395);
    });


    test("DeliveryCalculator - generate delivery cost with valid inputs", async () => {
        let deliveryCalculator = new DeliveryCalculator(10,5);
        deliveryCalculator.initVoucher( voucherInputs );

        let result = deliveryCalculator.outputDeliveryCost( deliveryCostInputs );
        expect( result ).toBe("PKG1 0 175\nPKG2 0 275\nPKG3 35 665");

        
    });
    
    test("DeliveryCalculator - generate delivery cost with invalid inputs", async () => {

            let deliveryCalculator = new DeliveryCalculator(10,5);
            deliveryCalculator.initVoucher( voucherInputs );
            expect(
                () => {
                    let result = deliveryCalculator.outputDeliveryCost( deliveryCostInputsInvalid );
                    expect( result ).toBe("PKG1 0 175\nPKG2 0 275\nPKG3 35 665");
                }
            ).toThrow();
    });

    test("DeliveryCalculator - generate delivery time with valid inputs", async () => {

            let deliveryCalculator = new DeliveryCalculator(10,5);
            deliveryCalculator.initVoucher( voucherInputs );

                let result = deliveryCalculator.outputDeliveryTime( deliveryTimeInputs );
                expect( result ).toBe('PKG1 0 750 3.98\nPKG2 0 1475 1.78\nPKG3 0 2350 1.42\nPKG4 105 1395 0.85\nPKG5 0 2125 4.19');

            expect( deliveryCalculator.numberOfVehicles ).toBe(2);
            expect( deliveryCalculator.maxSpeed ).toBe(70);
            expect( deliveryCalculator.maxLoad ).toBe(200);

    });
});