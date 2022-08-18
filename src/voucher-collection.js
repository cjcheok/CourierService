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

    find( code ){
        let found = false;
        this.vouchers.forEach( voucher => {
            if( voucher.code == code ) {
                found = true;
            }
        });
        return found;
    }

}

module.exports = VoucherCollection;