const Voucher = require('./voucher');
const Parcel = require('./parcel');
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
            if( voucher.minWeight <= parcel.weight && parcel.weight <= voucher.maxWeight && voucher.minDistance <= parcel.distance && parcel.distance <= voucher.maxDistance ) return true;
        
        }        
        
        return false;
    }

}

module.exports = VoucherCollection;