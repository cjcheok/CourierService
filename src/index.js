

const DeliveryGroup = require('../src/libs/delivery-group');
const ParcelCollection = require('../src/libs/parcel-collection');


const packagesInput = '100 5\nPKG1 50 30 OFR001\nPKG2 75 125 OFR008\nPKG3 175 100 OFR003\nPKG4 110 60 OFR002\nPKG5 155 95 NA\n2 70 200';

let numOfParcels = 0;
let parcelCollection = new ParcelCollection();
arrInputs = packagesInput.split("\n");
arrInputs.forEach( (element,index) => {
    if( index == 0 ){
        numOfParcels = parseInt(element.split(" ")[1]);
    }
    else if( index > 0 &&  numOfParcels + 1 == index ){
        
    }else{
        parcelCollection.addParcel(element);
    }
});

let deliveryGroup = new DeliveryGroup(2,200,70);
deliveryGroup.calculateTime( parcelCollection );