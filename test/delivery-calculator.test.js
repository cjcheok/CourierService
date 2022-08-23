

const DeliveryCalculator = require('../src/libs/delivery-calculator');
const Voucher = require('../src/libs/voucher');
const Parcel = require('../src/libs/parcel');
const VoucherCollection = require('../src/libs/voucher-collection');


const voucherInputs = 'OFR001 10 0 200 70 200\nOFR002 7 50 150 100 150\nOFR003 5 50 250 10 150';
const deliveryCostInputs = '100 3\nPKG1 5 5 OFR001\nPKG2 15 5 OFR002\nPKG3 10 100 OFR003';
const deliveryTimeInputs = '100 5\nPKG1 50 30 OFR001\nPKG2 75 125 OFR008\nPKG3 175 100 OFR003\nPKG4 110 60 OFR002\nPKG5 155 95 NA\n2 70 200';
const configInputs = '10 5';
const BASE_COST = 100;
const WEIGHT_MULTIPLYER = 10;
const DISTANCE_MULTIPLYER = 5;

describe("Delivery Calculator Tests", () => {

    test("DeliveryCalculator - constructor with valid inputs", async () => {
        let deliveryCalculator = new DeliveryCalculator(configInputs);
        expect( deliveryCalculator.weightMultiplyer ).toBe(10);
        expect( deliveryCalculator.distanceMultiplyer ).toBe(5);
    });

    test("DeliveryCalculator - constructor with invalid inputs", async () => {

        let arrTest = [
            "a 5",
            "10 b",
            "",
            "10",
        ];
        arrTest.forEach( element => {
            
            expect(
                () => {
                    let deliveryCalculator = new DeliveryCalculator(element);
                }
            ).toThrow();
            
        });
    });

    test("DeliveryCalculator - generate delivery cost with valid inputs", async () => {
        let deliveryCalculator = new DeliveryCalculator(configInputs);
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
            let deliveryCalculator = new DeliveryCalculator(configInputs);
            deliveryCalculator.initVoucher( voucherInputs );
        
            arrTest.forEach( (element,index) => {
                expect(
                    () => {
                        let result = deliveryCalculator.outputDeliveryCost( element );
                    }
                ).toThrow();
            });
    });

    test("DeliveryCalculator - generate delivery cost with duplicate parcel ID", async () => {

        let arrTest = [
            "100 3\nPKG1 5 5 OFR001\nPKG2 15 5 OFR002\nPKG1 10 100 OFR003",
            "100 3\nPKG1 5 5 OFR001\nPKG2 15 5 OFR002\nPKG2 10 100 OFR003",
        ]
            let deliveryCalculator = new DeliveryCalculator(configInputs);
            deliveryCalculator.initVoucher( voucherInputs );
        
            arrTest.forEach( (element,index) => {
                expect(
                    () => {
                        let result = deliveryCalculator.outputDeliveryCost( element );
                    }
                ).toThrow();
            });
    });

    test("DeliveryCalculator - generate delivery time with valid inputs", async () => {

            let deliveryCalculator = new DeliveryCalculator(configInputs);
            deliveryCalculator.initVoucher( voucherInputs );

            let result = deliveryCalculator.outputDeliveryTime( deliveryTimeInputs );
            expect( result ).toBe('PKG1 0 750 3.98\nPKG2 0 1475 1.78\nPKG3 0 2350 1.42\nPKG4 105 1395 0.85\nPKG5 0 2125 4.19');
            expect( deliveryCalculator.numberOfVehicles ).toBe(2);
            expect( deliveryCalculator.maxSpeed ).toBe(70);
            expect( deliveryCalculator.maxLoad ).toBe(200);
    });

    test("DeliveryCalculator - generate delivery time with invalid inputs", async () => {

        let arrTest = [
            "100 3\nPKG1 5 5 OFR001\nPKG2 15 5 OFR002\nPKG3 10 100 OFR003\n1 2 A",
            "100 3\nPKG1 5 5 OFR001\n\nPKG3 10 100 OFR003",
            "100 3\nPKG1 5 5 OFR001\nPKG2 15 5 OFR002\nPKG3 10 100 OFR003\nA B C",
        ]
            let deliveryCalculator = new DeliveryCalculator(configInputs);
            deliveryCalculator.initVoucher( voucherInputs );
        
            arrTest.forEach( (element,index) => {
                expect(
                    () => {
                        let result = deliveryCalculator.outputDeliveryTime( element );
                    }
                ).toThrow();
            });
    });

    test("DeliveryCalculator - Calculate Delivery Time with Max load lesser than parcel weight", async () => {

        let arrTest = [
            //"100 3\nPKG1 5 5 OFR001\nPKG2 15 5 OFR002\nPKG3 10 100 OFR003\n2 70 10",
            "100 3\nPKG1 5 5 OFR001\nPKG2 15 5 OFR002\nPKG3 10 100 OFR003\n2 70 9",
        ]
            let deliveryCalculator = new DeliveryCalculator(configInputs);
            deliveryCalculator.initVoucher( voucherInputs );
        
            arrTest.forEach( (element,index) => {
                expect(
                    () => {
                        let result = deliveryCalculator.outputDeliveryTime( element );
                    }
                ).toThrow();
            });
    });


    test("DeliveryCalculator - Calculate Delivery Time with huge max load, can fit all parcels in one vehicles", async () => {

        let arrTest = [
            "100 3\nPKG1 5 5 OFR001\nPKG2 15 5 OFR002\nPKG3 10 100 OFR003\n2 70 1000",
            //"100 3\nPKG1 5 5 OFR001\nPKG2 15 5 OFR002\nPKG3 10 100 OFR003\n2 70 100",
        ]
            let deliveryCalculator = new DeliveryCalculator(configInputs);
            deliveryCalculator.initVoucher( voucherInputs );
        
            arrTest.forEach( (element,index) => {
                let result = deliveryCalculator.outputDeliveryTime( element );
            });
    });

    test("DeliveryCalculator - Calculate Delivery Time with max speed is zero or less", async () => {

        let arrTest = [
            "100 3\nPKG1 5 5 OFR001\nPKG2 15 5 OFR002\nPKG3 10 100 OFR003\n2 0 1000",
            "100 3\nPKG1 5 5 OFR001\nPKG2 15 5 OFR002\nPKG3 10 100 OFR003\n2 -70 100",
        ]
            let deliveryCalculator = new DeliveryCalculator(configInputs);
            deliveryCalculator.initVoucher( voucherInputs );
        
            arrTest.forEach( (element,index) => {
                expect(
                    () => {
                        let result = deliveryCalculator.outputDeliveryTime( element );
                    }
                ).toThrow();
            });
    });
});