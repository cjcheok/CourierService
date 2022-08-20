class Parcel{

    constructor( inputs ){

        this.id = '';
        this.weight = 0;
        this.distance = 0;
        this.voucherCode = '';

        this.startTime = 0;
        this.travelTime = 0;
        this.totalTime = 0;
        this.total = 0;
        this.discount = 0;
        this.cost = 0;
        
        let arrInputs = inputs.replace(/(\r\n|\n|\r)/gm, "").split(' ');
        if( arrInputs.length >= 3 ){

            let hasError = false;
            for( let i=1; i<3; i++ ){
                if( isNaN(arrInputs[i]) || parseFloat(arrInputs[i]) < 0 ) {
                    hasError = true;
                }
                else
                    arrInputs[i] = parseFloat(arrInputs[i]);
            }
            if( !hasError ){
                if( arrInputs.length < 4 ) arrInputs.push( '' );
                [this.id, this.weight, this.distance, this.voucherCode] = arrInputs;
            }
            else{
                throw new Error('Invalid parameter formats.');
            }
        }
        else{
            throw new Error('Parameters mismatch.');
        }
    }
    

    calculateCost( baseCost, weightMultiplyer, distanceMultiplyer ){
        return this.cost = baseCost + ( this.distance * distanceMultiplyer) + (weightMultiplyer * this.weight);
    }

    calculateDiscount( discountPercentage ){
        return this.discount = this.cost * discountPercentage / 100;
    }

    calculateTime( maxSpeed, startTime ){
        this.travelTime = parseFloat( (this.distance / maxSpeed).toFixed(3).slice(0,-1) );
        this.startTime = startTime;
        this.totalTime = (this.startTime + this.travelTime).toFixed(2);
    }

    calculateTotal( baseCost, weightMultiplyer, distanceMultiplyer, discountPercentage ){
        this.calculateCost( baseCost, weightMultiplyer, distanceMultiplyer );
        this.calculateDiscount( discountPercentage );
        return this.total = this.cost - this.discount;
    }

    outputCost(){
        return this.id + ' ' + this.discount + ' ' + this.total + '\n';
    }
    outputTime(){
        return this.id + ' ' + this.discount + ' ' + this.total + ' ' + this.totalTime + '\n';
    }
}

module.exports = Parcel;