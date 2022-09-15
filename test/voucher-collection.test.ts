import { Parcel } from "../src/libs/parcel";
import { VoucherCollection } from "../src/libs/voucher-collection";


describe("Voucher Collection Tests", () => {
    const voucherInputs:string = 'OFR001 10 0 200 70 200\nOFR002 7 50 150 100 150\nOFR003 5 50 250 10 150';

    test("Voucher Collection - Create voucher collection from file input", async () => {
        let voucherCollection:VoucherCollection = new VoucherCollection( voucherInputs );        
        expect( voucherCollection.length() ).toBe(3);
    });

    test("Voucher Collection - Create voucher collection with duplicate voucher code", async () => {
        expect( 
            () => {
                let voucherCollection:VoucherCollection = new VoucherCollection( "OFR001 10 0 200 70 200\nOFR002 7 50 150 100 150\nOFR003 5 50 250 10 150\nOFR003 5 50 250 10 150" );
            }
        ).toThrow();  
    });
    
    test("Voucher Collection - Search voucher by code", async () => {
        let voucherCollection:VoucherCollection = new VoucherCollection( voucherInputs );
        expect( voucherCollection.findByCode( 'OFR002' ) ).not.toBeNull();
        expect( voucherCollection.findByCode( 'OFR005' ) ).toBeNull();
    });

    test("Voucher Collection - Perform search by passing parcel object.", async () => {
        let parcel: Parcel, result:any;
        let voucherCollection:VoucherCollection = new VoucherCollection( voucherInputs );
        let arrTest:any[] = [
            ["PKG1 5 5 OFR001",false],
            ["PKG3 10 100 OFR003",true]
        ];
        arrTest.forEach( (element: any) => {
            parcel = new Parcel( element[0] );
            result = voucherCollection.match( parcel );
            if( element[1] ) expect( result ).not.toBeNull();
            else expect( result ).toBeNull();
        });
    });


    test("Voucher Collection - Get Discount.", async () => {

        let arrTest:any[] = [
            ["PKG1 5 5 OFR001", 0],
            ["PKG3 10 100 OFR003", 5],
        ];
        let parcel: Parcel;
        let voucherCollection:VoucherCollection = new VoucherCollection( voucherInputs );
        arrTest.forEach( (element:any) => {
            parcel = new Parcel( element[0] );
            voucherCollection.match( parcel ) ;
            expect( voucherCollection.getDiscount( parcel ) ).toBe(element[1]);
        });
    });
});