const Parcel = require('./parcel');

class ParcelCollection{

    constructor(){
        this.parcels = [];
    }

    /*
        Add Parcel into collection
        - inputs: String
    */
    addParcel( inputs ){
        if( !this.#isParcelIDExist(inputs.split(" ")[0]) )
            this.parcels.push( new Parcel(inputs) );
        else{
            throw new Error('Parcel Collection - Parcel ID already exist.');
        }
    }
    /*
        Check if Parcel ID Exist, to avoid duplicate ID
        - id: String

        return isExist: Boolean
    */
    #isParcelIDExist( id ){
        let isExist = false;
        this.parcels.forEach( element => {
            if( element.id == id ) isExist = true;
        });

        return isExist;
    }

    /*
        Reset Collection
    */
    reset(){
        this.parcels = [];
    }

    /*
        Get total parcels
        
        return length: Number
    */
    length(){
        return this.parcels.length;
    }

    /*
        Get Cost Result output
        - deliveryCalculator: DeliveryCalculator
        return result: String
    */    
    outputCost( deliveryCalculator ){
        let strOutput = '';
        this.parcels.forEach( parcel => {
            parcel.calculateTotal( deliveryCalculator.baseCost, deliveryCalculator.weightMultiplyer, deliveryCalculator.distanceMultiplyer, deliveryCalculator.voucherCollection.getDiscount( parcel )  );
            strOutput += parcel.outputCost();
        });
        return strOutput.slice(0, -1);
    }

    /*
        Get Time Result output
        - deliveryCalculator: DeliveryCalculator
        return result: String
    */    
    outputTime( deliveryCalculator ){
        let strOutput = '';
        this.parcels.forEach( parcel => {
            parcel.calculateTotal( deliveryCalculator.baseCost, deliveryCalculator.weightMultiplyer, deliveryCalculator.distanceMultiplyer, deliveryCalculator.voucherCollection.getDiscount( parcel )  );
            strOutput += parcel.outputTime();
        });
        return strOutput.slice(0, -1);
    }
    
}

module.exports = ParcelCollection;