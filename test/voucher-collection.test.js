const VoucherCollection = require('../src/libs/voucher-collection');
const Parcel = require('../src/libs/parcel');
const voucherInputs = 'OFR001 10 0 200 70 200\nOFR002 7 50 150 100 150\nOFR003 5 50 250 10 150';

describe("Voucher Collection Tests", () => {
    test("Voucher Collection - Create voucher collection from file input", async () => {
        let voucherCollection = new VoucherCollection( voucherInputs );
        expect( voucherCollection.length() ).toBe(3);
    });

    test("Voucher Collection - Create voucher collection with duplicate voucher code", async () => {
        expect( 
            () => {
                let voucherCollection = new VoucherCollection( "OFR001 10 0 200 70 200\nOFR002 7 50 150 100 150\nOFR003 5 50 250 10 150\nOFR003 5 50 250 10 150" );
            }
        ).toThrow();  
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
});