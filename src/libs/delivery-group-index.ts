export class DeliveryGroupIndex{

    group: number[];
    weight: number;
    size: number;

    constructor( group: number[], weight: number, size: number ){

        if( !Array.isArray( group)  ){
            throw new Error('Invalid group input.');
        }

        if( isNaN(weight) || weight < 0  ){
            throw new Error('Invalid weight input.');
        }

        if( isNaN(size) || size < 0  ){
            throw new Error('Invalid size input.');
        }
        if( group.length != size  ){
            throw new Error('Group size and size doesnt not match.');
        }

        group.forEach( (element) => {
            if( isNaN(element) || element < 0 ){
                throw new Error('Group element can only be positive integer.');
            }
        });

        this.group = group.concat();
        this.weight = weight;
        this.size = size;
    }

    /*
        Check if the index exist in group
        - arrays: Array - An array of index to check.
    */
    isIndexExistInGroup( arrays: number[] ){
        return arrays.find( (element) =>{
            let b = this.group.find( (groupIndex) => {
                return groupIndex === element;
            });
            return b !== undefined;
        });

    }
    /*
        sum all weight
        - arrIndexes: Array ( get weight from the array base on group's index)
    */
    sumWeight( arrIndexes: any[] ){
        let total = 0;
        this.group.forEach( (element :number,index) => {
            total += arrIndexes[element].weight;
        });
        return total;
    }
}