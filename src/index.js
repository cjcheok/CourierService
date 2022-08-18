let arr = [
    {weight:50,id:0},
    {weight:75,id:1},
    {weight:175,id:2},
    {weight:110,id:3},
    {weight:155,id:0}
];

let maxweight = 200;

var garr = [];
for( var ii=1; ii<arr.length; ii++){
    garr = garr.concat( getCombinations( 0, arr.length - 1, ii) );
}


function getCombinations( min, max, size ){

    var main = [];
    var a = [];
    var j = min;
    var cCol = 1;
    var cc  = size - 1;
    var fv = max - size + 1;

    while( a.length < size ){
        a.push( j );
        j++;
    }
    main.push( {index:a, weight: 0} );

    var t = main.length;
    var tem = {weight:0, index:[]};
    tem.index = main[t-1].index.concat();

    while( tem.index[0] != fv ){
    
        for( var j=cc; j>=0; j--){

            var dmax = size - j - 1;
            
            if( tem.index[j] + 1 <= max - dmax ){
                tem.index[j]++;
                var z = j;
                for( var g=j+1; g<=cc; g++ ){
                    tem.index[g] = tem.index[z] + 1;
                    z = g;
                }
                break;
            }
        }
        main.push( tem );

        t = main.length;
        tem = {weight:0, index:[]};
        tem.index = main[t-1].index.concat();
    }


    return main;
}

for( var i=0; i<garr.length; i++ ){

    var t = 0;
    //console.log(garr[i].index);
    for( var j=0; j<garr[i].index.length; j++ ){
        t += arr[ garr[i].index[j] ].weight;
    }
    if( t > maxweight ){
        garr.splice( i,1);
        i--;
    }
    else{
        garr[i].weight = t;
        garr[i].count = garr[i].index.length;
    }
}
garr.sort(
    function( a , b){
        if(a.weight * a.count < b.weight * b.count) return 1;
        if(a.weight * a.count > b.weight * b.count) return -1;
        return 0;
    }
);
console.log(garr);

var gg = [];

while( garr.length > 0 ) {

gg.push( {weight:0, count:0, index:[]} );
var t = gg.length - 1;
gg[t].index = garr[0].index.concat();
gg[t].weight = garr[0].weight;
gg[t].count = garr[0].count;
var tindex = gg[t].index;
for( var i=0; i<garr.length; i++ ){

    var a = garr[i].index;
    var isExist = false;
    for( var j=0; j<a.length; j++ ){

        for( var k=0; k<tindex.length; k++ ){
            if( a[j] == tindex[k] ){
                isExist = true;
                break;
            }
        }
        if( isExist ) break;
    }

    if( isExist ) {
        garr.splice( i, 1);
        i--;
    }
}

}
console.log(gg);