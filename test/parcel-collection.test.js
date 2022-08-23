const ParcelCollection = require('../src/libs/parcel-collection');

describe("Parcel Collection Tests", () => {
    test("Parcel Collection - Add Parcel to Parcel Collection with valid inputs", async () => {
        let parcelCollection = new ParcelCollection();

        let arrTest = [
            'PKG1 5 5 OFR001',
            'PKG2 15 5 OFR002',
            'PKG3 10 100 OFR003'
        ];
        
        arrTest.forEach( (element, index) => {
            parcelCollection.addParcel( element );
        });

        expect( parcelCollection.length() ).toBe( arrTest.length );
        expect( parcelCollection.parcels[1].id ).toBe('PKG2');
        
    });


    test("Parcel Collection - Add Parcel to Parcel Collection with invalid inputs", async () => {
        let parcelCollection = new ParcelCollection();

        let arrTest = [
            'PKG1 A 5 OFR001',
            'PKG2 15 V OFR002',
            'PKG3 10 -100 OFR003',
            'PKG3 10 -100 OFR003'
        ];
        
        arrTest.forEach( (element, index) => {
            expect(
                () =>{
                    parcelCollection.addParcel( element );
                }
            ).toThrow();
        });
        
    });

});