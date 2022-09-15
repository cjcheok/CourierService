import { DeliveryGroup } from "../src/libs/delivery-group";

describe("Delivery Group Tests", () => {
    test("Delivery Group - Constructor with valid parameters", async () => {
        let deliveryGroup:DeliveryGroup = new DeliveryGroup(2,200,70);
        
    });

    test("Delivery Group - Constructor with invalid parameters", async () => {

        let arrTest:any[] = [
            [2,-200,70],
            [2,-200,'A'],
            [0,200,70],
            [2,0,70],
            [2,200,0],
        ];
        
        arrTest.forEach( (element:any, index:number) => {
            expect(
                () =>{
                    let deliveryGroup:DeliveryGroup = new DeliveryGroup(element[0], element[1], element[2]);
                }
            ).toThrow();
        });
        
    });
});