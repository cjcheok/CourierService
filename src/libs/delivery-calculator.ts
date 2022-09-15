import { DeliveryGroup } from "./delivery-group";
import { ParcelCollection } from "./parcel-collection";
import { VoucherCollection } from "./voucher-collection";

export class DeliveryCalculator{

    weightMultiplyer: number;
    distanceMultiplyer: number;
    numberOfVehicles: number;
    maxLoad: number;
    maxSpeed: number;
    baseCost: number;
    numberOfParcel: number;
    voucherCollection: VoucherCollection;
    parcelCollection: ParcelCollection;

    constructor( inputs :string ){

        let arrInputs: any[] = inputs.split(" ");
        if( inputs.length < 2 || inputs[1] == "" ){
            throw new Error('DeliveryCalculator - Paramters mismatch');
        }
        if( isNaN(arrInputs[0]) || parseInt(arrInputs[0]) < 0 ){
            throw new Error('DeliveryCalculator - weight multiplyer must be numeric and greater than or equal to 0');
        }
        if( isNaN(arrInputs[1]) || parseInt(arrInputs[1]) < 0 ){
            throw new Error('DeliveryCalculator - distance multiplyer must be numeric and greater than or equal to 0');
        }

        this.weightMultiplyer = parseInt(arrInputs[0]);
        this.distanceMultiplyer = parseInt(arrInputs[1]);
        this.numberOfVehicles = 0;
        this.maxLoad = 0;
        this.maxSpeed = 0;
        this.baseCost = 0;
        this.numberOfParcel = 0;
        this.voucherCollection = new VoucherCollection("");
        this.parcelCollection = new ParcelCollection();
    }

    /*
        Load voucher inputs
        - inputs: String
    */
    initVoucher( inputs: string ){
        this.voucherCollection = new VoucherCollection( inputs );
    }

    /*
        Load delivery inputs
        - inputs: String
    */
    #processInputs( inputs:string ){
        this.parcelCollection.reset();
        inputs.split("\n").forEach( (element, i) => {
            
            if( i == 0 ){
                
                let arrParameters: any[] = element.split(" ");
                if( arrParameters.length == 2 ){

                    if( !isNaN( arrParameters[0] ) && !isNaN( arrParameters[1] ) ){
                        this.baseCost = parseInt( arrParameters[0] );
                        this.numberOfParcel = parseInt( arrParameters[1] );
                    }
                    else{
                        throw new Error('DeliveryCalculator - Invalid input format.');
                    }

                }else{
                    throw new Error('DeliveryCalculator - Invalid input format.');
                }
            }else if( i > 0 && i == this.numberOfParcel + 1 ) {

                let arrParameters: any[] = element.split(" ");
                if( arrParameters.length == 3 ){

                    let hasErrors = false;
                    let errMessage = '';
                    for( let i=0;i<arrParameters.length;i++){
                        if( !isNaN(arrParameters[i]) ){
                            arrParameters[i] = parseInt(arrParameters[i]);
                            if( arrParameters[i] <= 0 ){
                                hasErrors = true;
                                errMessage = 'DeliveryCalculator - Max Speed / Max Load / Number of vehicles cannot be less than equal to Zero.';
                            }
                        }
                        else{
                            hasErrors = true;
                            errMessage = 'DeliveryCalculator - Invalid input format.';
                            
                        }
                    }
                    if( !hasErrors ){
                        [this.numberOfVehicles, this.maxSpeed, this.maxLoad] = arrParameters;
                    }
                    else{
                        throw new Error(errMessage);
                    }

                }else{
                    throw new Error('DeliveryCalculator - Invalid input format.');
                }
            }else{
                
                if( element != "" ){
                    this.parcelCollection.addParcel( element );
                }else{
                    throw new Error('DeliveryCalculator - Invalid input format.');
                }
            }
        });

        if( this.parcelCollection.length() != this.numberOfParcel ){
            throw new Error('DeliveryCalculator - Numbers of parcels does not match.');
        }
        //this.parcelCollection.setNumberOfVehicles( this.numberOfVehicles );
    }

    /*
        Perform Calculation Delivery Time Estimation and return result
        - inputs: String

        return result: String
    */
    outputDeliveryTime( inputs: string ){
        
        this.#processInputs( inputs );
        let deliveryGroup:DeliveryGroup = new DeliveryGroup( this.numberOfVehicles, this.maxLoad, this.maxSpeed );
        //this.parcelCollection.groupParcels( this );
        deliveryGroup.calculateTime( this.parcelCollection );
        return this.parcelCollection.outputTime( this );
    }

    /*
        Perform Calculation Delivery Cost and return result
        - inputs: String

        return result: String
    */
    outputDeliveryCost( inputs: string ){
        this.#processInputs( inputs );
        return this.parcelCollection.outputCost( this );
    }
}