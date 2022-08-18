const VoucherCollection = require('../src/voucher-collection');
const Parcel = require('./parcel');


class DeliveryCost{

    constructor( weightMultiplyer, distanceMultiplyer ){
        this.weightMultiplyer = weightMultiplyer;
        this.distanceMultiplyer = distanceMultiplyer;
        this.voucherCollection = new VoucherCollection("");
        this.baseCost = 0;
        this.numberOfParcel = 0;
        this.parcels = [];
    }

    initVoucher( inputs ){
        this.voucherCollection = new VoucherCollection( inputs );
    }

    output( inputs ){

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
            parcel.getTotal( this.baseCost, this.weightMultiplyer, this.distanceMultiplyer, this.voucherCollection.getDiscount( parcel )  );
            strOutput += parcel.id + ' ' + parcel.discount + ' ' + parcel.total + '\n';
        });

        return strOutput.slice(0, -1);
    }
}

module.exports = DeliveryCost;