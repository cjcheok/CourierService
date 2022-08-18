const VoucherCollection = require('./voucher-collection');
const Parcel = require('./parcel');


class DeliveryCalculator{

    constructor( weightMultiplyer, distanceMultiplyer ){
        this.weightMultiplyer = weightMultiplyer;
        this.distanceMultiplyer = distanceMultiplyer;
        this.vechicles = 0;
        this.maxLoad = 0;
        this.maxSpeed = 0;

        this.voucherCollection = new VoucherCollection("");
        this.baseCost = 0;
        this.numberOfParcel = 0;
        this.parcels = [];
    }

    initVoucher( inputs ){
        this.voucherCollection = new VoucherCollection( inputs );
    }

    outputDeliveryTime( inputs ){
        inputs.split("\n").forEach( (element, i) => {
            
            if( i == 0 ){
                let arrParameters = element.split(" ");
                if( arrParameters.length == 2 ){

                    if( !isNaN( arrParameters[0] ) && !isNaN( arrParameters[1] ) ){
                        this.baseCost = parseInt( arrParameters[0] );
                        this.numberOfParcel = parseInt( arrParameters[1] );
                    }
                    else{
                        throw('Invalid input format.');
                    }

                }else{
                    throw('Invalid input format.');
                }
            }else if( i > 0 && i == this.numberOfParcel + 1 ) {

                let arrParameters = element.split(" ");
                if( arrParameters.length == 3 ){

                    if( !isNaN( arrParameters[0] ) && !isNaN( arrParameters[1] ) && !isNaN( arrParameters[2] ) ){
                        this.vechicles = parseInt( arrParameters[0] );
                        this.maxSpeed = parseInt( arrParameters[1] );
                        this.maxLoad = parseInt( arrParameters[2] );
                    }
                    else{
                        throw('Invalid input format.');
                    }

                }else{
                    throw('Invalid input format.');
                }
            }else{
                
                if( element != "" ){
                    this.parcels.push( new Parcel(element) );
                }else{
                    throw('Invalid input format.');
                }
            }
        });

        if( this.parcels.length != this.numberOfParcel ){
            throw('Number of parcels mismatch.');
        }
    }

    outputDeliveryCost( inputs ){

        inputs.split("\n").forEach( (element, i) => {
            
            if( i == 0 ){
                let arrParameters = element.split(" ");
                if( arrParameters.length == 2 ){

                    if( !isNaN( arrParameters[0] ) && !isNaN( arrParameters[1] ) ){
                        this.baseCost = parseInt( arrParameters[0] );
                        this.numberOfParcel = parseInt( arrParameters[1] );
                    }
                    else{
                        throw('Invalid input format.');
                    }

                }else{
                    throw('Invalid input format.');
                }
            }else{
                
                if( element != "" ){
                    this.parcels.push( new Parcel(element) );
                }else{
                    throw('Invalid input format.');
                }
            }
        });

        if( this.parcels.length != this.numberOfParcel ){
            throw('Number of parcels mismatch.');
        }

        let strOutput = '';

        this.parcels.forEach( parcel => {
            parcel.calculateTotal( this.baseCost, this.weightMultiplyer, this.distanceMultiplyer, this.voucherCollection.getDiscount( parcel )  );
            strOutput += parcel.id + ' ' + parcel.discount + ' ' + parcel.total + '\n';
        });

        return strOutput.slice(0, -1);
    }
}

module.exports = DeliveryCalculator;