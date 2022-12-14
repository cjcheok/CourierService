import { DeliveryGroupIndex } from "./delivery-group-index";
import { Parcel } from "./parcel";
import { ParcelCollection } from "./parcel-collection";

export class DeliveryGroup{
    #groups: DeliveryGroupIndex[] = [];
    #groupIndexes: any[] = [];
    #vehicles: number[] = [];
    #allParcelInOneGroup: number[] = [];
    maxLoad: number;
    maxSpeed: number;

    constructor( numberOfVehicles: number, maxLoad: number, maxSpeed: number ){


        if( isNaN(numberOfVehicles) || numberOfVehicles <= 0  ){
            throw new Error('Invalid numberOfVehicles input.');
        }

        if( isNaN(maxLoad) || maxLoad <= 0  ){
            throw new Error('Invalid maxLoad input.');
        }

        if( isNaN(maxSpeed) || maxSpeed <= 0  ){
            throw new Error('Invalid maxSpeed input..');
        }

        this.maxLoad = maxLoad;
        this.maxSpeed = maxSpeed;

        for( let i=0; i<numberOfVehicles; i++ ){
            this.#vehicles.push( 0 );
        }
    }


    /*
        Calculate Delivery Time estimation
        - parcelCollection : ParcelCollection
    */
    calculateTime( parcelCollection: ParcelCollection ){

        this.#createParcelIndexs( parcelCollection );
        this.#getParcelListThatCanShareSlot();
        this.#groups = this.#getBestGroups();

        while( this.#groups.length > 0 ){
            let vehicleIndex = this.#getFastestAvailableVehicle();
            let longestTime = 0;

            this.#groups[0].group.forEach( (element, index) => {
                let parcel = parcelCollection.parcels[ this.#groupIndexes[element].index ];
                parcel.calculateTime( this.maxSpeed, this.#vehicles[vehicleIndex] );
                if( parcel.travelTime > longestTime ) {
                    longestTime = parcel.travelTime;
                }
            });
            this.#vehicles[vehicleIndex] += longestTime * 2;
            this.#groups.shift();
        }

    }

    /*
        create all parcel array index reference. and valid parcel weight and maxload.
        if single parcel weight > maxload then throw error.
        - a : Array Element
        - b : Array Element
    */
    #createParcelIndexs( parcelCollection: ParcelCollection ){
        this.#allParcelInOneGroup = [];
        parcelCollection.parcels.forEach( (parcel:Parcel, index:number) => {
            this.#groupIndexes.push( {index:index, weight:parcel.weight} );
            this.#allParcelInOneGroup.push( index );

            if( parcel.weight > this.maxLoad ){
                throw new Error('Max load is smaller / less than parcel weight.');
            }
        });
        this.#groupIndexes.sort(this.#groupIndexSort);
    }

    /*
        Array Sort - Priority : weight
        - a : Array Element
        - b : Array Element
    */
    #groupIndexSort( a: any, b: any){
        if(a.weight< b.weight) return -1;
        else return 1;
    }

    /*
        Creat all group combinations
    */
    #getParcelListThatCanShareSlot(){
        let arrGroups: DeliveryGroupIndex[] = [];
        let arrOnlyOneParcel: DeliveryGroupIndex[] = [];
        let arrAvailableParcelCombination: number[] = [];
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
        this.#groups = arrGroups.concat(arrOnlyOneParcel);
        this.#filterGroupsThatWithinMaxLoad();

    }

    /*
        Calculate each group's total weight
        if total weight > maxLoad then weight will be 0.
    */
    #filterGroupsThatWithinMaxLoad(){
        this.#groups.forEach( (element, index, arr) => {
            let totalWeight = element.sumWeight(this.#groupIndexes);
            arr[index].weight = totalWeight > this.maxLoad ? 0 : totalWeight;
        });

        this.#groups.sort( this.#sortBySizeWeight);
    }
    
    /*
        Array Sort - Priority : Size, weight
        - a : Array Element
        - b : Array Element
    */
    #sortBySizeWeight( a: DeliveryGroupIndex,b: DeliveryGroupIndex ){
        if(a.weight * a.size < b.weight * b.size) return 1;
        else return -1;
    }

    /*
        Total Parcels = [0,1,2,3]
        generateAllGroupsBySize( 4, 2)
        [0,1] [0,2] [0,3] [1,2] [1,3] [2,3]

        generateAllGroupsBySize( 4, 3)
        [0,1,2] [0,1,3] [0,2,3], [1,2,3]

        Generate all combination of group
        - totalPossibleParcels: Number
        - arraySize: Number
        return groups: Array
    */
    #generateAllGroupsBySize( totalPossibleParcels: number, arraySize: number ){
        var groups = [];
        var tempParcelGroup:number[] = [];
        var tempParcelGroupIndex:DeliveryGroupIndex;
        var startIndex = 0;
        var index = startIndex;
        var endIndex = (totalPossibleParcels - 1) - arraySize + 1;

        while( tempParcelGroup.length < arraySize ){
            tempParcelGroup.push( index++ );
        }
        groups.push(new DeliveryGroupIndex(tempParcelGroup, 0, arraySize) );
        tempParcelGroupIndex = new DeliveryGroupIndex( groups[groups.length - 1].group,0,arraySize);

        /*
        totalPossibleParcels = [0,1,2,3]
        arraySize = 2

        meaning we will generate 2 item array
        [0,1], [0,2],[0,3],[1,2],[1,3],[2,3]
        */
        while( tempParcelGroupIndex.group[0] != endIndex) {
            /*
            calculate from last column
            [0,1] -> [0,2] last column + 1 if it's not the max value.
            [0,2] -> [0,3] 
            [0,2] -> [1,2] if last column is already max value then (last column - 1) increment 1 value and last column = (last column - 1) - 1
            */
            for( let i=arraySize - 1; i>=0; i-- ){
                var maxValueOfColumn = arraySize - i - 1;

                if( tempParcelGroupIndex.group[i] + 1 <= this.#groupIndexes.length - 1 - maxValueOfColumn ){
                    tempParcelGroupIndex.group[i]++;
                    let previousIndex = i;
                    for( let g = i + 1; g<= arraySize - 1; g++ ){
                        tempParcelGroupIndex.group[g] = tempParcelGroupIndex.group[previousIndex] + 1;
                        previousIndex = g;
                    }
                    break;
                }
            }
            groups.push( tempParcelGroupIndex );
            tempParcelGroupIndex = new DeliveryGroupIndex( groups[groups.length - 1].group,0,arraySize);
        }
        return groups;
    }
    /*
        Find the best combination of the group
        return arrBestGroup: Array
    */
    #getBestGroups(){
        var arrBestGroup  = [];
        while( this.#groups.length > 0 ){
            arrBestGroup.push( this.#groups[0] );
            this.#removeIndexesFromGroup( this.#groups[0].group.concat() );
        }
        return arrBestGroup;
    }

    /*
        Remove element in groups if the index exist in group's group
        - arrIndexs: Array
    */
    #removeIndexesFromGroup( arrIndexs: number[] ){
        for( let i=0; i<this.#groups.length; i++ ){
            if( this.#groups[i].isIndexExistInGroup(arrIndexs) !== undefined ){
                this.#groups.splice( i--, 1);
            }
        }
    }

    /*
        Return Fastest Available vehicle Index
        return vehicleIndex: Number
    */
    #getFastestAvailableVehicle(){
        let vehicleIndex = -1;
        let waitTime = 9999999;
        this.#vehicles.forEach( (element,index) => {
            if( element < waitTime ){
                waitTime = element;
                vehicleIndex = index;
            }
        });
        return vehicleIndex;
    }
}