
const Parcel = require('../src/libs/parcel');
const VoucherCollection = require('../src/libs/voucher-collection');
const voucherInputs = 'OFR001 10 0 200 70 200\nOFR002 7 50 150 100 150\nOFR003 5 50 250 10 150';
const BASE_COST = 100;
const WEIGHT_MULTIPLYER = 10;
const DISTANCE_MULTIPLYER = 5;

describe("Parcel Tests", () => {
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
});