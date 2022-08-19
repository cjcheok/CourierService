const Parcel = require('./parcel');
class Voucher{


    constructor( inputs ){
        this.code = '';
        this.percentage = 0;
        this.minDistance = 0;
        this.maxDistance = 0;
        this.minWeight = 0;
        this.maxWeight = 0;

        let arrInputs = inputs.replace(/(\r\n|\n|\r)/gm, "").split(' ');
        if( arrInputs.length == 6 ){
            this.code = arrInputs[0];

            let hasError = false;
            for( let i=1; i<arrInputs.length; i++ ){
                if( isNaN(arrInputs[i]) || parseFloat(arrInputs[i]) < 0 ) {
                    hasError = true;
                }
            }

            if( !hasError ){
                this.percentage = parseFloat( arrInputs[1] );
                this.minDistance = parseInt( arrInputs[2] );
                this.maxDistance = parseInt( arrInputs[3] );
                this.minWeight = parseInt( arrInputs[4] );
                this.maxWeight = parseInt( arrInputs[5] );
            }
            else{
                throw('Invalid parameter formats.');
            }
        }
        else{
            throw('Parameters mismatch.');
        }
    }

    isEligible( parcel ){
        return ( this.weightInRange(parcel.weight) && this.distanceInRange(parcel.distance) );
    }
    weightInRange( weight ){
        return this.inRange(weight, this.minWeight, this.maxWeight );
    }
    distanceInRange( distance ){
        return this.inRange(distance, this.minDistance, this.maxDistance );
    }
    inRange( val, min, max ){
        return (min <= val && val <= max );
    }
}

module.exports = Voucher;