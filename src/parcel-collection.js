const Parcel = require('./parcel');

class ParcelCollection{

    constructor(){
        this.parcels = [];
        this.groups = [];
        this.vechicles = [];
        this.indexReferences = [];
    }

    /*
        Add Parcel into collection
        - inputs: String
    */
    addParcel( inputs ){
        if( !this.isParcelIDExist(inputs.split(" ")[0]) )
            this.parcels.push( new Parcel(inputs) );
        else{
            throw new Error('Parcel Collection - Parcel ID already exist.');
        }
    }
    /*
        Check if Parcel ID Exist, to avoid duplicate ID
        - id: String

        return isExist: Boolean
    */
    isParcelIDExist( id ){
        let isExist = false;
        this.parcels.forEach( element => {
            if( element.id == id ) isExist = true;
        });

        return isExist;
    }

    /*
        Reset Collection
    */
    reset(){
        this.vechicles = [];
        this.parcels = [];
        this.groups = [];
        this.indexReferences = [];
    }

    /*
        Get total parcels
        
        return length: Number
    */
    length(){
        return this.parcels.length;
    }

    /*
        Get Cost Result output
        - deliveryCalculator: DeliveryCalculator
        return result: String
    */    
    outputCost( deliveryCalculator ){
        let strOutput = '';
        this.parcels.forEach( parcel => {
            parcel.calculateTotal( deliveryCalculator.baseCost, deliveryCalculator.weightMultiplyer, deliveryCalculator.distanceMultiplyer, deliveryCalculator.voucherCollection.getDiscount( parcel )  );
            strOutput += parcel.outputCost();
        });
        return strOutput.slice(0, -1);
    }

    /*
        Get Time Result output
        - deliveryCalculator: DeliveryCalculator
        return result: String
    */    
    outputTime( deliveryCalculator ){
        let strOutput = '';
        this.parcels.forEach( parcel => {
            parcel.calculateTotal( deliveryCalculator.baseCost, deliveryCalculator.weightMultiplyer, deliveryCalculator.distanceMultiplyer, deliveryCalculator.voucherCollection.getDiscount( parcel )  );
            strOutput += parcel.outputTime();
        });
        return strOutput.slice(0, -1);
    }
    
    /*
        Set number of vehicles
        - numberOfVehicles: Number
    */
    setNumberOfVehicles( numberOfVehicles ){
        this.vechicles = [];
        for( let i=0; i<numberOfVehicles; i++ ){
            this.vechicles.push(0);
        }
    }

    /*
        Get Fastest Available Vehicle
    
        return vehicleIndex: Number
    */
    getFastestAvailableVehicle(){
        let vehicleIndex = -1;
        let waitTime = 9999999;
        this.vechicles.forEach( (element,index) => {
            // get shortest waitTime
            if( element < waitTime ){
                waitTime = element;
                vehicleIndex = index;
            }
        });
        return vehicleIndex;
    }

    /*
        Generate All Possibility of the groups
        - maxLoad: Number

        return arrGroups: Array
    */
    getAllGroupPossibilities(maxLoad){
        let arrGroups = [];
        let isParcelWeightWithinMaxLoad = true;
        let allInOneGroup = [];
        this.parcels.forEach( (parcel, index) => {
            this.indexReferences.push( {index:index, weight:parcel.weight} );
            allInOneGroup.push( index );
            if( parcel.weight > maxLoad ) isParcelWeightWithinMaxLoad = false;
        });

        if( !isParcelWeightWithinMaxLoad ) {
            throw new Error('Max load is smaller / less than parcel weight.');
        }

        this.indexReferences.sort(
            function( a , b){
                if(a.weight< b.weight) return -1;
                else return 1;
            }
        );
        let arrSolo = [];
        let arrAvailable = [];
        let mostLight = this.indexReferences[0];
        this.indexReferences.forEach( (element, index) => {
            if( element.weight + mostLight.weight > maxLoad ){
                element.solo = true;
                arrSolo.push( {group:[index], weight: element.weight, size:1} );
            }
            else arrAvailable.push( {weight:element.weight,id:element.index}, );

        });

        if( arrSolo.length == 0 ){
            arrGroups.push( {group:allInOneGroup, weight:0, size:this.indexReferences.length } );
        }
        
        arrAvailable.forEach( (parcel, index) => {
            if( index > 0 ) 
                arrGroups = arrGroups.concat( this.generateAllGroupsBySize( arrAvailable.length, index ) );
        });
        arrGroups = arrGroups.concat(arrSolo);
        
        for( let i=0; i<arrGroups.length; i++ ){
            let totalWeight = 0;
            for( let j=0; j<arrGroups[i].group.length; j++ ){
                totalWeight += this.parcels[  this.indexReferences[ arrGroups[i].group[j] ].index ].weight;
            }

            if( totalWeight > maxLoad ){
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
        return arrGroups;
    }

    /*
        Get the best groups combinations / most efficient
        - arrGroups: Array
    */
    getBestGroups( arrGroups ){
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
        return arrBestGroup;
    }

    /*
        Group parcel into groups for Time estimation calculation
        - deliveryCalculator: DeliveryCalculator
    */
    groupParcels( deliveryCalculator ){
        this.groups = this.getBestGroups( this.getAllGroupPossibilities(deliveryCalculator.maxLoad) );
        while( this.groups.length > 0 ){
            let vehicleIndex = this.getFastestAvailableVehicle();
            let longestTime = 0;
            for( let i=0; i<this.groups[0].group.length; i++ ){
                this.parcels[ this.indexReferences[ this.groups[0].group[i]].index ].calculateTime( deliveryCalculator.maxSpeed, this.vechicles[vehicleIndex] );
                if( this.parcels[ this.indexReferences[ this.groups[0].group[i] ].index ].travelTime > longestTime ) longestTime = this.parcels[ this.indexReferences[ this.groups[0].group[i]].index ].travelTime;
            }
            this.vechicles[vehicleIndex] += longestTime * 2;
            this.groups.shift();
        }
    }


    /*
        Generate All Possibility of the groups by size of the array
        - arraySize: Number

        return groups: Array
    */
    generateAllGroupsBySize( totalPossibleParcels, arraySize ){
        var groups = [];
        var tempParcelGroup = [];
        var startIndex = 0;
        var index = startIndex;
        var endIndex = (totalPossibleParcels - 1) - arraySize + 1;

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