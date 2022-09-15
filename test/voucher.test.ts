import { Voucher } from "../src/libs/voucher";



describe("Voucher Tests", () => {
    const voucherInputs:string = 'OFR001 10 0 200 70 200\nOFR002 7 50 150 100 150\nOFR003 5 50 250 10 150';
    // setup voucher
    let voucher:Voucher;

    test("Voucher - Create voucher with valid inputs", async () => {
        voucher = new Voucher( "OFR001 10 0 200 70 200" );
        expect( voucher.code ).toBe('OFR001');
        expect( voucher.percentage ).toBe(10);
        expect( voucher.minDistance ).toBe(0);
        expect( voucher.maxDistance ).toBe(200);
        expect( voucher.minWeight ).toBe(70);
        expect( voucher.maxWeight ).toBe(200);
    });

    test("Voucher - Create voucher with mismatch parameters", async () => {
        let arrTest: string[] = [
            "OFR001 0",
            "OFR001 10 70 200"
        ];
        arrTest.forEach( (element:string) => {
            expect(
                () => {
                    voucher = new Voucher( element );
                }
            ).toThrow();
        });
    });

    test("Voucher - Create voucher with invalid inputs", async () => {
        let arrTest: string[] = [
            "OFR001 A 0 200 70 200",
            "OFR001 10 B 200 70 200",
            "OFR001 10 0 C 70 200",
            "OFR001 10 0 200 D 200",
            "OFR001 10 0 200 70 E"
        ];
        arrTest.forEach( (element:string) => {
            expect(
                () => {
                    voucher = new Voucher( element );
                }
            ).toThrow();
        });
    });

    test("Voucher - Create voucher with negative numeric inputs", async () => {
        let arrTest: string[] = [
            "OFR001 -10 0 200 70 200",
            "OFR001 10 -1 200 70 200",
            "OFR001 10 0 -200 70 200",
            "OFR001 10 0 200 -70 200",
            "OFR001 10 0 200 70 -200"
        ];
        arrTest.forEach( (element:string) => {
            expect(
                () => {
                    voucher = new Voucher( element );
                }
            ).toThrow();
        });
    });
});