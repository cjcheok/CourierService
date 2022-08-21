

const DeliveryCalculator = require('../src/delivery-calculator');
const Voucher = require('../src/voucher');
const Parcel = require('../src/parcel');
const VoucherCollection = require('../src/voucher-collection');

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
    Load Delivery Time Estimation list from text file.
*/
let deliveryTimeInputs = '';
try {  
    deliveryTimeInputs = fs.readFileSync('inputs/delivery-time-estimation.txt', 'utf8');
} catch(e) {
    console.log('Error:', e.stack);
}




describe("Delivery Calculator Tests", () => {


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

    test("Voucher - Create voucher with mismatch parameters", async () => {
        let arrTest = [
            "OFR001 0",
            "OFR001 10 70 200"
        ];
        arrTest.forEach( element => {
            expect(
                () => {
                    let voucher = new Voucher( element );
                }
            ).toThrow();
        });
    });

    test("Voucher - Create voucher with invalid inputs", async () => {
        let arrTest = [
            "OFR001 A 0 200 70 200",
            "OFR001 10 B 200 70 200",
            "OFR001 10 0 C 70 200",
            "OFR001 10 0 200 D 200",
            "OFR001 10 0 200 70 E"
        ];
        arrTest.forEach( element => {
            expect(
                () => {
                    let voucher = new Voucher( element );
                }
            ).toThrow();
        });
    });

    test("Voucher - Create voucher with negative numeric inputs", async () => {
        let arrTest = [
            "OFR001 -10 0 200 70 200",
            "OFR001 10 -1 200 70 200",
            "OFR001 10 0 -200 70 200",
            "OFR001 10 0 200 -70 200",
            "OFR001 10 0 200 70 -200"
        ];
        arrTest.forEach( element => {
            expect(
                () => {
                    let voucher = new Voucher( element );
                }
            ).toThrow();
        });
    });


    test("Parcel - Create parcel with valid inputs", async () => {

        let arrTest = [
            ['PKG1 5 5 OFR001', 'PKG1', 5,5,'OFR001'],
            ['PKG2 15 5', 'PKG2',15,5, ''],
        ];
        arrTest.forEach( element => {
            parcel = new Parcel( element[0] );
            expect( parcel.id ).toBe(element[1]);
            expect( parcel.weight ).toBe(element[2]);
            expect( parcel.distance ).toBe(element[3]);
            expect( parcel.voucherCode ).toBe(element[4]);
        });
    });

    test("Parcel - Create parcel with mismatch parameters", async () => {
        let arrTest = [
            'PKG1',
            'PKG1 5',
        ];
        arrTest.forEach( element => {
            expect(
                () => {
                    let parcel = new Parcel( element );
                }   
            ).toThrow();
        });

      
    });

    test("Parcel - Create parcel with invalid inputs", async () => {
        let arrTest = [
            'PKG1 A 100 OFR001',
            'PKG1 5 B OFR001',
            'PKG1 5 B OFR001',
        ];
        arrTest.forEach( element => {
            expect(
                () => {
                    let parcel = new Parcel( element );
                }   
            ).toThrow();
        });

      
    });

    test("Parcel - Create parcel with negative numberic inputs", async () => {

        let arrTest = [
            'PKG1 -5 100 OFR001',
            'PKG1 5 -100 OFR001',
        ];
        arrTest.forEach( element => {
            expect(
                () => {
                    let parcel = new Parcel( element );
                }   
            ).toThrow();
        });
    });

    test("Parcel - Calculate Cost", async () => {

        let arrTest = [
            ["PKG1 5 5 OFR001", 175],
            ["PKG1 15 5 OFR001", 275],
        ];
        arrTest.forEach( element => {
            let parcel = new Parcel( element[0] );
            expect( parcel.calculateCost(BASE_COST, WEIGHT_MULTIPLYER, DISTANCE_MULTIPLYER) ).toBe(element[1]);
        });
    });

    test("Voucher Collection - Create voucher collection from file input", async () => {
        let voucherCollection = new VoucherCollection( voucherInputs );
        expect( voucherCollection.length() ).toBe(3);
    });
    
    test("Voucher Collection - Search voucher by code", async () => {
        let voucherCollection = new VoucherCollection( voucherInputs );
        expect( voucherCollection.findByCode( 'OFR002' ) ).not.toBeNull();
        expect( voucherCollection.findByCode( 'OFR005' ) ).toBeNull();
    });

    test("Voucher Collection - Perform search by passing parcel object.", async () => {
        let parcel, result;
        let voucherCollection = new VoucherCollection( voucherInputs );
        let arrTest = [
            ["PKG1 5 5 OFR001",false],
            ["PKG3 10 100 OFR003",true]
        ];
        arrTest.forEach( element => {
            parcel = new Parcel( element[0] );
            result = voucherCollection.match( parcel );
            if( element[1] ) expect( result ).not.toBeNull();
            else expect( result ).toBeNull();
        });
    });


    test("Voucher Collection - Get Discount.", async () => {

        let arrTest = [
            ["PKG1 5 5 OFR001", 0],
            ["PKG3 10 100 OFR003", 5],
        ];
        let parcel;
        let voucherCollection = new VoucherCollection( voucherInputs );
        arrTest.forEach( element => {
            parcel = new Parcel( element[0] );
            voucherCollection.match( parcel ) ;
            expect( voucherCollection.getDiscount( parcel ) ).toBe(element[1]);
        });
    });

    test("Parcel - Calculate Discount & Total Cost", async () => {
        let voucherCollection = new VoucherCollection( voucherInputs );
        let arrTest = [
            ["PKG1 5 5 OFR001", 175],
            ["PKG3 10 100 OFR003", 665],
            ["PKG4 110 60 OFR002", 1395],
        ];
        let parcel;
        arrTest.forEach( element => {
            parcel = new Parcel( element[0] );
            expect( parcel.calculateTotal( BASE_COST, WEIGHT_MULTIPLYER, DISTANCE_MULTIPLYER, voucherCollection.getDiscount(parcel) ) ).toBe(element[1]);
        });
    });


    test("DeliveryCalculator - generate delivery cost with valid inputs", async () => {
        let deliveryCalculator = new DeliveryCalculator(10,5);
        deliveryCalculator.initVoucher( voucherInputs );

        let result = deliveryCalculator.outputDeliveryCost( deliveryCostInputs );
        expect( result ).toBe("PKG1 0 175\nPKG2 0 275\nPKG3 35 665");
    });
    
    test("DeliveryCalculator - generate delivery cost with invalid inputs", async () => {

        let arrTest = [
            "100 3\nPKG1 5 5 OFR001\nPKG2 15 5 OFR002",
            "100 3\nPKG1 5 5 OFR001\nPKG2 15 5 OFR002\nPKG3 10 100 OFR003\nPKG1 5 5 OFR001\nPKG2 15 5 OFR002\nPKG3 10 100 OFR003",
            "\nPKG1 5 5 OFR001\nPKG2 15 5 OFR002\nPKG3 10 100 OFR003\nPKG1 5 5 OFR001\nPKG2 15 5 OFR002\nPKG3 10 100 OFR003",
            "100 C\nPKG1 5 5 OFR001\nPKG2 15 5 OFR002\nPKG3 10 100 OFR003\nPKG1 5 5 OFR001\nPKG2 15 5 OFR002\nPKG3 10 100 OFR003",
            "100 3\nPKG1 5 5 OFR001\nPKG2 15 5 OFR002\nPKG3 10 100 OFR003\nPKG1 5 5 OFR001\nPKG2 15 5 OFR002\nPKG3 10 100 OFR003",
        ]
            let deliveryCalculator = new DeliveryCalculator(10,5);
            deliveryCalculator.initVoucher( voucherInputs );
        
            arrTest.forEach( (element,index) => {
                expect(
                    () => {
                        let result = deliveryCalculator.outputDeliveryCost( element );
                    }
                ).toThrow();
            });
    });

    test("DeliveryCalculator - generate delivery time with invalid inputs", async () => {

        let arrTest = [
            "100 3\nPKG1 5 5 OFR001\nPKG2 15 5 OFR002\nPKG3 10 100 OFR003\n1 2 A",
            "100 3\nPKG1 5 5 OFR001\n\nPKG3 10 100 OFR003",
            "100 3\nPKG1 5 5 OFR001\nPKG2 15 5 OFR002\nPKG3 10 100 OFR003\nA B C",
        ]
            let deliveryCalculator = new DeliveryCalculator(10,5);
            deliveryCalculator.initVoucher( voucherInputs );
        
            arrTest.forEach( (element,index) => {
                expect(
                    () => {
                        let result = deliveryCalculator.outputDeliveryTime( element );
                    }
                ).toThrow();
            });
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