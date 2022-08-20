const Parcel = require('./parcel');

class ParcelCollection{

    constructor(  ){
        this.parcels = [];
        this.groups = [];
        this.vechicles = [];
    }


    addParcel( inputs ){
        this.parcels.push( new Parcel(inputs) );
    }

    reset(){
        this.vechicles = [];
        this.parcels = [];
        this.groups = [];
    }

    length(){
        return this.parcels.length;
    }

    outputCost( deliveryCalculator ){
        let strOutput = '';
        this.parcels.forEach( parcel => {
            parcel.calculateTotal( deliveryCalculator.baseCost, deliveryCalculator.weightMultiplyer, deliveryCalculator.distanceMultiplyer, deliveryCalculator.voucherCollection.getDiscount( parcel )  );
            strOutput += parcel.outputCost();
        });
        return strOutput.slice(0, -1);
    }

    outputTime( deliveryCalculator ){
        let strOutput = '';
        this.parcels.forEach( parcel => {
            parcel.calculateTotal( deliveryCalculator.baseCost, deliveryCalculator.weightMultiplyer, deliveryCalculator.distanceMultiplyer, deliveryCalculator.voucherCollection.getDiscount( parcel )  );
            strOutput += parcel.outputTime();
        });
        return strOutput.slice(0, -1);
    }
    
    setNumberOfVehicles( numberOfVehicles ){
        this.vechicles = [];
        for( let i=0; i<numberOfVehicles; i++ ){
            this.vechicles.push(0);
        }
    }

    getFastestAvailableVehicle(){
        let vehicleIndex = -1;
        let waitTime = 9999999;
        this.vechicles.forEach( (element,index) => {
            if( element < waitTime ){
                waitTime = element;
                vehicleIndex = index;
            }
        });
        return vehicleIndex;
    }

    groupParcels( deliveryCalculator ){
        let arrGroups = [];
        this.parcels.forEach( (parcel, index) => {
            if( index > 0 ) 
                arrGroups = arrGroups.concat( this.generateAllGroups( index ) );
        });

        for( let i=0; i<arrGroups.length; i++ ){
            let totalWeight = 0;
            for( let j=0; j<arrGroups[i].group.length; j++ ){
                totalWeight += this.parcels[ arrGroups[i].group[j] ].weight;
            }

            if( totalWeight > deliveryCalculator.maxLoad ){
                arrGroups.splice(i--,1);
            }else{
                arrGroups[i].weight = totalWeight;
            }
        }

        arrGroups.sort(
            function( a , b){
                if(a.weight * a.size < b.weight * b.size) return 1;
                else return -1;
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
        this.groups = arrBestGroup;
        while( this.groups.length > 0 ){
            let vehicleIndex = this.getFastestAvailableVehicle();
            let longestTime = 0;
            for( let i=0; i<this.groups[0].group.length; i++ ){
                this.parcels[ this.groups[0].group[i] ].calculateTime( deliveryCalculator.maxSpeed, this.vechicles[vehicleIndex] );
                if( this.parcels[ this.groups[0].group[i] ].travelTime > longestTime ) longestTime = this.parcels[ this.groups[0].group[i] ].travelTime;
            }
            this.vechicles[vehicleIndex] += longestTime * 2;
            this.groups.shift();
        }
    }

    generateAllGroups( arraySize ){

        var groups = [];
        var tempParcelGroup = [];
        var startIndex = 0;
        var index = startIndex;
        var endIndex = (this.parcels.length - 1) - arraySize + 1;

        while( tempParcelGroup.length < arraySize ){
            tempParcelGroup.push( index++ );
        }
        groups.push( {group:tempParcelGroup, weight:0, size:arraySize } );

        var currentGroupSize = groups.length;
        tempParcelGroup = {weight:0, size: arraySize, group:[]};
        tempParcelGroup.group = groups[currentGroupSize-1].group.concat();

        while( tempParcelGroup.group[0] != endIndex) {

            for( let i=arraySize - 1; i>=0; i-- ){
                var maxValueOfColumn = arraySize - i - 1;

                if( tempParcelGroup.group[i] + 1 <= this.parcels.length - 1 - maxValueOfColumn ){
                    tempParcelGroup.group[i]++;
                    let previousIndex = i;
                    for( let g = i + 1; g<= arraySize - 1; g++ ){
                        tempParcelGroup.group[g] = tempParcelGroup.group[previousIndex] + 1;
                        previousIndex = g;
                    }
                    break;
                }
            }
            groups.push( tempParcelGroup );
            currentGroupSize = groups.length;
            tempParcelGroup = {weight:0, size: arraySize, group:[]};
            tempParcelGroup.group = groups[currentGroupSize-1].group.concat();
        }
        return groups;
    }
}

module.exports = ParcelCollection;