class Voucher{


    constructor( inputs ){
        this.code = '';
        this.percentage = 0;
        this.minDistance = 0;
        this.maxDistance = 0;
        this.minWeight = 0;
        this.maxWeight = 0;

        let arrInputs = inputs.split(' ');
        this.code = arrInputs[0];
        this.percentage = parseFloat( arrInputs[1] );
        this.minDistance = parseInt( arrInputs[2] );
        this.maxDistance = parseInt( arrInputs[3] );
        this.minWeight = parseInt( arrInputs[4] );
        this.maxWeight = parseInt( arrInputs[5] );
    }
}

module.exports = Voucher;