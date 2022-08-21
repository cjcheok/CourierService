const VoucherCollection = require('./voucher-collection');
const Parcel = require('./parcel');
const ParcelCollection = require('./parcel-collection');

class DeliveryCalculator{

    constructor( weightMultiplyer, distanceMultiplyer ){
        this.weightMultiplyer = weightMultiplyer;
        this.distanceMultiplyer = distanceMultiplyer;
        this.numberOfVehicles = 0;
        this.maxLoad = 0;
        this.maxSpeed = 0;
        this.baseCost = 0;
        this.numberOfParcel = 0;
        this.voucherCollection = new VoucherCollection("");
        this.parcelCollection = new ParcelCollection();
    }

    /*
        Load voucher inputs
        - inputs: String
    */
    initVoucher( inputs ){
        this.voucherCollection = new VoucherCollection( inputs );
    }

    /*
        Load delivery inputs
        - inputs: String
    */
    processInputs( inputs){
        this.parcelCollection.reset();
        inputs.split("\n").forEach( (element, i) => {
            
            if( i == 0 ){
                
                let arrParameters = element.split(" ");
                if( arrParameters.length == 2 ){

                    if( !isNaN( arrParameters[0] ) && !isNaN( arrParameters[1] ) ){
                        this.baseCost = parseInt( arrParameters[0] );
                        this.numberOfParcel = parseInt( arrParameters[1] );
                    }
                    else{
                        throw new Error('Invalid input format.');
                    }

                }else{
                    throw new Error('Invalid input format.');
                }
            }else if( i > 0 && i == this.numberOfParcel + 1 ) {

                let arrParameters = element.split(" ");
                if( arrParameters.length == 3 ){

                    if( !isNaN( arrParameters[0] ) && !isNaN( arrParameters[1] ) && !isNaN( arrParameters[2] ) ){
                        this.numberOfVehicles = parseInt( arrParameters[0] );
                        this.maxSpeed = parseInt( arrParameters[1] );
                        this.maxLoad = parseInt( arrParameters[2] );
                    }
                    else{
                        throw new Error('Invalid input format.');
                    }

                }else{
                    throw new Error('Invalid input format.');
                }
            }else{
                
                if( element != "" ){
                    this.parcelCollection.addParcel( element );
                }else{
                    throw new Error('Invalid input format.');
                }
            }
        });

        if( this.parcelCollection.length() != this.numberOfParcel ){
            throw new Error('Numbers of parcels does not match.');
        }
        this.parcelCollection.setNumberOfVehicles( this.numberOfVehicles );
    }

    /*
        Perform Calculation Delivery Time Estimation and return result
        - inputs: String

        return result: String
    */
    outputDeliveryTime( inputs ){
        
        this.processInputs( inputs );
        this.parcelCollection.groupParcels( this );
        return this.parcelCollection.outputTime( this );
    }

    /*
        Perform Calculation Delivery Cost and return result
        - inputs: String

        return result: String
    */
    outputDeliveryCost( inputs ){

        this.processInputs( inputs );
        return this.parcelCollection.outputCost( this );
    }
}

module.exports = DeliveryCalculator;