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
            

            let hasError = false;
            for( let i=1; i<arrInputs.length; i++ ){
                if( isNaN(arrInputs[i]) || parseFloat(arrInputs[i]) < 0 ) {
                    hasError = true;
                }
                else arrInputs[i] = parseFloat(arrInputs[i]);
            }

            if( !hasError ){
               [this.code, this.percentage, this.minDistance, this.maxDistance, this.minWeight, this.maxWeight] = arrInputs;
            }
            else{
                throw new Error('Voucher - Invalid parameter formats.');
            }
        }
        else{
            throw new Error('Voucher - Parameters mismatch.');
        }
    }

    /*
        Check if Weight & Distance is within range of the voucher.
        - parcel: Parcel
    */
    isEligible( parcel ){
        return ( this.#weightInRange(parcel.weight) && this.#distanceInRange(parcel.distance) );
    }

    /*
        Check if Weight is within range of the voucher.
        - weight: Number
    */
    #weightInRange( weight ){
        return this.#inRange(weight, this.minWeight, this.maxWeight );
    }

    /*
        Check if Distance is within range of the voucher.
        - distance: Number
    */
    #distanceInRange( distance ){
        return this.#inRange(distance, this.minDistance, this.maxDistance );
    }

    /*
        Check if the value is within the range
        - val: Number
        - min: Number
        - max: Number
    */
    #inRange( val, min, max ){
        return (min <= val && val <= max );
    }
}

module.exports = Voucher;