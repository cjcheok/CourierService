class DeliveryGroupIndex{

    constructor( group, weight, size ){

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

    isIndexExistInGroup( arrays ){
        return arrays.find( (element) =>{
            let b = this.group.find( (groupIndex) => {
                return groupIndex === element;
            });
            return b !== undefined;
        });

    }

    sumWeight( arrIndexes ){
        let total = 0;
        this.group.forEach( (element,index) => {
            total += arrIndexes[element].weight;
        });
        return total;
    }
}

module.exports = DeliveryGroupIndex;