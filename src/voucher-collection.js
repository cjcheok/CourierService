const Voucher = require('./voucher');

class VoucherCollection{

    constructor( inputs ){
        this.vouchers = [];
        inputs.split('\n').forEach( input => {
            this.vouchers.push( new Voucher(input) );
        });
    }

    length(){
        return this.vouchers.length;
    }

}

module.exports = VoucherCollection;