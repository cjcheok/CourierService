const Voucher = require('./voucher');
const Parcel = require('./parcel');
class VoucherCollection{

    constructor( inputs ){
        this.vouchers = [];
        inputs.split('\n').forEach( input => {
            if( input.length != 0 ) this.vouchers.push( new Voucher(input) );
        });
    }

    length(){
        return this.vouchers.length;
    }

    find( code ){
        let foundVoucher = null;
        this.vouchers.forEach( voucher => {
            if( voucher.code == code ) {
                foundVoucher = voucher;
            }
        });
        return foundVoucher;
    }

    match( parcel ){
        let voucher = this.find( parcel.voucherCode );
        if( voucher ){
            if( voucher.isEligible( parcel ) ) return voucher;
        }        
        return null;
    }


    getDiscount( parcel ) {
        let voucher = this.match( parcel );
        if( voucher ) return voucher.percentage;
        else return 0;
    }

}

module.exports = VoucherCollection;