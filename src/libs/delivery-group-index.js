class DeliveryGroupIndex{

    constructor( group, weight, size ){
        this.group = group.concat();
        this.weight = weight;
        this.size = size;
        this.startTime = 0;
        this.travelTime = 0;
    }

    isIndexExistInGroup( arrays ){
        return arrays.find( (element) =>{
            let b = this.group.find( (groupIndex) => {
                return groupIndex === element;
            });
            return b !== undefined;
        });

    }
}

module.exports = DeliveryGroupIndex;