import { Parcel } from "../src/libs/parcel";
import { VoucherCollection } from "../src/libs/voucher-collection";

describe("Parcel Tests", () => {

    const voucherInputs: string = 'OFR001 10 0 200 70 200\nOFR002 7 50 150 100 150\nOFR003 5 50 250 10 150';
    const BASE_COST: number = 100;
    const WEIGHT_MULTIPLYER: number = 10;
    const DISTANCE_MULTIPLYER: number = 5;


    test("Parcel - Create parcel with valid inputs", async () => {

        let arrTest: any = [
            ['PKG1 5 5 OFR001', 'PKG1', 5,5,'OFR001'],
            ['PKG2 15 5', 'PKG2',15,5, ''],
        ];
        arrTest.forEach( (element:any) => {
            let parcel:Parcel = new Parcel( element[0] );
            expect( parcel.id ).toBe(element[1]);
            expect( parcel.weight ).toBe(element[2]);
            expect( parcel.distance ).toBe(element[3]);
            expect( parcel.voucherCode ).toBe(element[4]);
        });
    });

    test("Parcel - Create parcel with mismatch parameters", async () => {
        let arrTest: string[] = [
            'PKG1',
            'PKG1 5',
        ];
        arrTest.forEach( (element:string) => {
            expect(
                () => {
                    let parcel: Parcel = new Parcel( element );
                }   
            ).toThrow();
        });

      
    });

    test("Parcel - Create parcel with invalid inputs", async () => {
        let arrTest: string[] = [
            'PKG1 A 100 OFR001',
            'PKG1 5 B OFR001',
            'PKG1 5 B OFR001',
        ];
        arrTest.forEach( (element:string) => {
            expect(
                () => {
                    let parcel:Parcel = new Parcel( element );
                }   
            ).toThrow();
        });

      
    });

    test("Parcel - Create parcel with negative numberic inputs", async () => {

        let arrTest:string[] = [
            'PKG1 -5 100 OFR001',
            'PKG1 5 -100 OFR001',
        ];
        arrTest.forEach( (element:string) => {
            expect(
                () => {
                    let parcel:Parcel = new Parcel( element );
                }   
            ).toThrow();
        });
    });
    test("Parcel - Calculate Cost", async () => {

        let arrTest: any[] = [
            ["PKG1 5 5 OFR001", 175],
            ["PKG1 15 5 OFR001", 275],
        ];
        arrTest.forEach( (element: any) => {
            let parcel:Parcel = new Parcel( element[0] );
            expect( parcel.calculateCost(BASE_COST, WEIGHT_MULTIPLYER, DISTANCE_MULTIPLYER) ).toBe(element[1]);
        });
    });
1
    test("Parcel - Calculate Discount & Total Cost", async () => {
        let voucherCollection:VoucherCollection = new VoucherCollection( voucherInputs );
        let arrTest: any[] = [
            ["PKG1 5 5 OFR001", 175],
            ["PKG3 10 100 OFR003", 665],
            ["PKG4 110 60 OFR002", 1395],
        ];
        let parcel: Parcel;
        arrTest.forEach( (element: any) => {
            parcel = new Parcel( element[0] );
            expect( parcel.calculateTotal( BASE_COST, WEIGHT_MULTIPLYER, DISTANCE_MULTIPLYER, voucherCollection.getDiscount(parcel) ) ).toBe(element[1]);
        });
    });
});