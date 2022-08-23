const DeliveryGroupIndex = require('./delivery-group-index');

class DeliveryGroup{
    #groups = [];
    #groupIndexes = [];
    #vehicles = [];
    #allParcelInOneGroup = [];

    constructor( numberOfVehicles, maxLoad, maxSpeed ){

        this.maxLoad = maxLoad;
        this.maxSpeed = maxSpeed;

        for( let i=0; i<numberOfVehicles; i++ ){
            this.#vehicles.push( 0 );
        }
    }



    calculateTime( parcelCollection ){

        this.#createParcelIndexs( parcelCollection );
        this.#getParcelListThatCanShareSlot();
        this.#groups = this.#getBestGroups();

        while( this.#groups.length > 0 ){
            let vehicleIndex = this.#getFastestAvailableVehicle();
            let longestTime = 0;
            for( let i=0; i<this.#groups[0].group.length; i++ ){
                parcelCollection.parcels[ this.#groupIndexes[ this.#groups[0].group[i]].index ].calculateTime( this.maxSpeed, this.#vehicles[vehicleIndex] );
                if( parcelCollection.parcels[ this.#groupIndexes[ this.#groups[0].group[i] ].index ].travelTime > longestTime ) 
                    longestTime = parcelCollection.parcels[ this.#groupIndexes[ this.#groups[0].group[i]].index ].travelTime;
            }
            this.#vehicles[vehicleIndex] += longestTime * 2;
            this.#groups.shift();
        }

    }

    #createParcelIndexs( parcelCollection ){
        this.#allParcelInOneGroup = [];
        let isParcelWeightWithinMaxLoad = true;
        parcelCollection.parcels.forEach( (parcel, index) => {
            this.#groupIndexes.push( {index:index, weight:parcel.weight} );
            this.#allParcelInOneGroup.push( index );
            if( parcel.weight > this.maxLoad ){
                isParcelWeightWithinMaxLoad = false;
            }
        });
        if( !isParcelWeightWithinMaxLoad ) {
            throw new Error('Max load is smaller / less than parcel weight.');
        }
        this.#groupIndexes.sort(
            function( a , b){
                if(a.weight< b.weight) return -1;
                else return 1;
            }
        );
    }

    #getParcelListThatCanShareSlot(){
        let arrGroups = [];
        let arrOnlyOneParcel = [];
        let arrAvailableParcelCombination = [];
        let mostLight = this.#groupIndexes[0];
        this.#groupIndexes.forEach( (element, index) => {
            if( element.weight + mostLight.weight > this.maxLoad ){
                arrOnlyOneParcel.push( new DeliveryGroupIndex([index], element.weight, 1) );
            }
            else arrAvailableParcelCombination.push( index );
        });
        if( arrOnlyOneParcel.length == 0 ){
            arrGroups.push( new DeliveryGroupIndex(this.#allParcelInOneGroup, 0, this.#groupIndexes.length) );
        }

        arrAvailableParcelCombination.forEach( (element, index) => {
            if( index > 0 ) 
                arrGroups = arrGroups.concat( this.#generateAllGroupsBySize( arrAvailableParcelCombination.length, index ) );
        });
        arrGroups = arrGroups.concat(arrOnlyOneParcel);
        for( let i=0; i<arrGroups.length; i++ ){
            let totalWeight = 0;
            for( let j=0; j<arrGroups[i].group.length; j++ ){
                totalWeight += this.#groupIndexes[ arrGroups[i].group[j] ].weight;
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
                else return -1;
            }
        );
        this.#groups = arrGroups;
    }

    #generateAllGroupsBySize( totalPossibleParcels, arraySize ){
        var groups = [];
        var tempParcelGroup = [];
        var startIndex = 0;
        var index = startIndex;
        var endIndex = (totalPossibleParcels - 1) - arraySize + 1;

        while( tempParcelGroup.length < arraySize ){
            tempParcelGroup.push( index++ );
        }
        groups.push(new DeliveryGroupIndex(tempParcelGroup, 0, arraySize) );
        tempParcelGroup = new DeliveryGroupIndex( groups[groups.length - 1].group,0,arraySize);

        while( tempParcelGroup.group[0] != endIndex) {

            for( let i=arraySize - 1; i>=0; i-- ){
                var maxValueOfColumn = arraySize - i - 1;

                if( tempParcelGroup.group[i] + 1 <= this.#groupIndexes.length - 1 - maxValueOfColumn ){
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
            tempParcelGroup = new DeliveryGroupIndex( groups[groups.length - 1].group,0,arraySize);
        }
        return groups;
    }

    #getBestGroups(){
        var arrBestGroup  = [];
        while( this.#groups.length > 0 ){
            arrBestGroup.push( this.#groups[0] );
            var arrIndexs = this.#groups[0].group.concat();
            for( let i=0; i<this.#groups.length; i++ ){
                if( this.#groups[i].isIndexExistInGroup(arrIndexs) !== undefined ){
                    this.#groups.splice( i--, 1);
                }
            }
        }
        return arrBestGroup;
    }
    #getFastestAvailableVehicle(){
        let vehicleIndex = -1;
        let waitTime = 9999999;
        this.#vehicles.forEach( (element,index) => {
            // get shortest waitTime
            if( element < waitTime ){
                waitTime = element;
                vehicleIndex = index;
            }
        });
        return vehicleIndex;
    }
}

module.exports = DeliveryGroup;