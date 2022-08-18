const VoucherCollection = require('./voucher-collection');
const Parcel = require('./parcel');


class DeliveryCalculator{

    constructor( weightMultiplyer, distanceMultiplyer ){
        this.weightMultiplyer = weightMultiplyer;
        this.distanceMultiplyer = distanceMultiplyer;
        this.vechicles = 0;
        this.maxLoad = 0;
        this.maxSpeed = 0;

        this.voucherCollection = new VoucherCollection("");
        this.baseCost = 0;
        this.numberOfParcel = 0;
        this.parcels = [];


        this.parcelGroup = [];
    }


    groupParcels(){
        let arrGroups = [];
        this.parcels.forEach( (element, index) => {
            if( index > 0 ) 
                arrGroups = arrGroups.concat( this.generateAllGroups( index ) );
        });

        for( let i=0; i<arrGroups.length; i++ ){
            let totalWeight = 0;
            for( let j=0; j<arrGroups[i].group.length; j++ ){
                totalWeight += this.parcels[ arrGroups[i].group[j] ].weight;
            }

            if( totalWeight > this.maxLoad ){
                arrGroups.splice(i--,1);
            }else{
                arrGroups[i].weight = totalWeight;
            }
        }

        arrGroups.sort(
            function( a , b){
                if(a.weight * a.size < b.weight * b.size) return 1;
                if(a.weight * a.size > b.weight * b.size) return -1;
                return 0;
            }
        );

        var arrBestGroup  = [];
        while( arrGroups.length > 0 ){
            arrBestGroup.push( {weight:arrGroups[0].weight, group:arrGroups[0].group.concat(), size:arrGroups[0].size} );
            var arrIndexs = arrGroups[0].group.concat();

            for( let i=0; i<arrGroups.length; i++ ){

                var currerntGroup = arrGroups[i].group;
                var isExist = false;
                for( let j=0; j<currerntGroup.length; j++ ){
            
                    for( let k=0; k<arrIndexs.length; k++ ){
                        if( currerntGroup[j] == arrIndexs[k] ){
                            isExist = true;
                            break;
                        }
                    }
                    if( isExist ) break;
                }
                if( isExist ) {
                    arrGroups.splice( i, 1);
                    i--;
                }
            }
        }

        console.log(arrBestGroup);
    }

    generateAllGroups( arraySize ){

        var groups = [];
        var group = [];
        var startIndex = 0;
        var index = startIndex;
        var endIndex = (this.parcels.length - 1) - arraySize + 1;

        while( group.length < arraySize ){
            group.push( index++ );
        }
        groups.push( {group:group, weight:0, size:arraySize } );

        var currentGroupSize = groups.length;
        var group = {weight:0, size: arraySize, group:[]};
        group.group = groups[currentGroupSize-1].group.concat();

        while( group.group[0] != endIndex) {

            for( let i=arraySize - 1; i>=0; i-- ){
                var dmax = arraySize - i - 1;

                if( group.group[i] + 1 <= this.parcels.length - 1 - dmax ){
                    group.group[i]++;
                    let previousIndex = i;
                    for( let g = i + 1; g<= arraySize - 1; g++ ){
                        group.group[g] = group.group[previousIndex] + 1;
                        previousIndex = g;
                    }
                    break;
                }
            }
            groups.push( group );
            currentGroupSize = groups.length;
            group = {weight:0, size: arraySize, group:[]};
            group.group = groups[currentGroupSize-1].group.concat();
        }
        return groups;
    }

    initVoucher( inputs ){
        this.voucherCollection = new VoucherCollection( inputs );
    }

    outputDeliveryTime( inputs ){
        inputs.split("\n").forEach( (element, i) => {
            
            if( i == 0 ){
                let arrParameters = element.split(" ");
                if( arrParameters.length == 2 ){

                    if( !isNaN( arrParameters[0] ) && !isNaN( arrParameters[1] ) ){
                        this.baseCost = parseInt( arrParameters[0] );
                        this.numberOfParcel = parseInt( arrParameters[1] );
                    }
                    else{
                        throw('Invalid input format.');
                    }

                }else{
                    throw('Invalid input format.');
                }
            }else if( i > 0 && i == this.numberOfParcel + 1 ) {

                let arrParameters = element.split(" ");
                if( arrParameters.length == 3 ){

                    if( !isNaN( arrParameters[0] ) && !isNaN( arrParameters[1] ) && !isNaN( arrParameters[2] ) ){
                        this.vechicles = parseInt( arrParameters[0] );
                        this.maxSpeed = parseInt( arrParameters[1] );
                        this.maxLoad = parseInt( arrParameters[2] );
                    }
                    else{
                        throw('Invalid input format.');
                    }

                }else{
                    throw('Invalid input format.');
                }
            }else{
                
                if( element != "" ){
                    this.parcels.push( new Parcel(element) );
                }else{
                    throw('Invalid input format.');
                }
            }
        });

        if( this.parcels.length != this.numberOfParcel ){
            throw('Number of parcels mismatch.');
        }

        let strOutput = '';

        this.parcels.forEach( parcel => {
            parcel.calculateHours( this.maxSpeed );
            parcel.calculateTotal( this.baseCost, this.weightMultiplyer, this.distanceMultiplyer, this.voucherCollection.getDiscount( parcel )  );
            strOutput += parcel.outputTime();
        });

        return strOutput.slice(0, -1);
    }

    outputDeliveryCost( inputs ){

        inputs.split("\n").forEach( (element, i) => {
            
            if( i == 0 ){
                let arrParameters = element.split(" ");
                if( arrParameters.length == 2 ){

                    if( !isNaN( arrParameters[0] ) && !isNaN( arrParameters[1] ) ){
                        this.baseCost = parseInt( arrParameters[0] );
                        this.numberOfParcel = parseInt( arrParameters[1] );
                    }
                    else{
                        throw('Invalid input format.');
                    }

                }else{
                    throw('Invalid input format.');
                }
            }else{
                
                if( element != "" ){
                    this.parcels.push( new Parcel(element) );
                }else{
                    throw('Invalid input format.');
                }
            }
        });

        if( this.parcels.length != this.numberOfParcel ){
            throw('Number of parcels mismatch.');
        }

        let strOutput = '';

        this.parcels.forEach( parcel => {
            parcel.calculateTotal( this.baseCost, this.weightMultiplyer, this.distanceMultiplyer, this.voucherCollection.getDiscount( parcel )  );
            strOutput += parcel.outputCost();
        });

        return strOutput.slice(0, -1);
    }
}

module.exports = DeliveryCalculator;