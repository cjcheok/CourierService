import { Parcel } from "./parcel";
import { Voucher } from "./voucher";

export class VoucherCollection{
    vouchers: Voucher[];

    constructor( inputs: string ){
        this.vouchers = [];
        inputs.split('\n').forEach( input => {
            if( input.length != 0 ) {
                if( !this.isVoucherCodeExist(input.split(" ")[0]) )
                    this.vouchers.push( new Voucher(input) );
                else{
                    throw new Error('Voucher Collection- Voucher code already exist.');
                }
            }
        });
    }
    /*
        Check if Voucher Code Exist, to avoid duplicate voucher code
        - code: String

        return isExist: Boolean
    */
    isVoucherCodeExist( code: string ){
        let isExist = false;
        this.vouchers.forEach( element => {
            if( element.code == code ) isExist = true;
        });

        return isExist;
    }
    /*
        Get total number of vouchers
    */
    length(){
        return this.vouchers.length;
    }

    /*
        Find Voucher By Code
        - code: String

        return foundVoucher : Voucher or null if does not match.
    */
    findByCode( code: string ){
        let foundVoucher = null;
        this.vouchers.forEach( voucher => {
            if( voucher.code == code ) {
                foundVoucher = voucher;
            }
        });
        return foundVoucher;
    }

    /*
        Find voucher that matches the parcel by passing Parcel Class as paramter
        - parcel: Parcel

        return voucher : Voucher or null if does not match.
    */
    match( parcel: Parcel ){    
        let voucher: any = this.findByCode( parcel.voucherCode );
        return (voucher && voucher.isEligible(parcel) ) ? voucher : null;
    }

    /*
        Get discount of the parcel
        - parcel: Parcel

        return discount value : Number
    */
    getDiscount( parcel: Parcel ) {
        let voucher: any = this.match( parcel );
        return voucher ? voucher.percentage : 0;
    }

}