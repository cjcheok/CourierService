const Voucher = require('./voucher');
const Parcel = require('./parcel');
class VoucherCollection{

    constructor( inputs ){
        this.vouchers = [];
        inputs.split('\n').forEach( input => {
            if( input.length != 0 ) {
                this.vouchers.push( new Voucher(input) );
            }
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
        return (voucher && voucher.isEligible(parcel) ) ? voucher : null;
    }


    getDiscount( parcel ) {
        let voucher = this.match( parcel );
        return voucher ? voucher.percentage : 0;
    }

}

module.exports = VoucherCollection;