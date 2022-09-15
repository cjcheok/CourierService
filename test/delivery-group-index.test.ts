import { DeliveryGroupIndex } from "../src/libs/delivery-group-index";

describe("Delivery Group Index Tests", () => {
    test("Delivery Group Index - Constructor with valid parameters", async () => {
        let deliveryGroupIndex:DeliveryGroupIndex = new DeliveryGroupIndex( [0], 200, 1);
        
    });

    test("Delivery Group Index - Constructor with invalid parameters", async () => {

        let arrTest:any[] = [
            [[2,9], 200, 1],
            [[0], 200, 2],
            [[0], 'A', 1],
            [[0], 200, 'C'],
            ['D', 200, 9],
            [2, 200, 5],
            [[0,-1], 200,2],
        ];
        
        arrTest.forEach( (element:any, index:number) => {
            expect(
                () =>{
                    let deliveryGroupIndex:DeliveryGroupIndex = new DeliveryGroupIndex(element[0], element[1], element[2]);
                }
            ).toThrow();
        });
        
    });
});