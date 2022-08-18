class Parcel{

    constructor( inputs ){
        this.id = '';
        this.weight = 0;
        this.distance = 0;
        this.voucherCode = '';
        
        let arrInputs = inputs.split(' ');
        if( arrInputs.length == 4 ){

            let hasError = false;
            for( let i=1; i<3; i++ ){
                if( isNaN(arrInputs[i]) || parseFloat(arrInputs[i]) < 0 ) {
                    hasError = true;
                }
            }
            this.id = arrInputs[0];
            this.weight = parseFloat( arrInputs[1] );
            this.distance = parseFloat( arrInputs[2] );
            this.voucherCode = arrInputs[3];
        }
        else{
            throw('Parameters mismatch.');
        }
    }
}

module.exports = Parcel;