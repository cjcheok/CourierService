# CourierService

Project setup
- This project is build on nodejs.
- You'll need to install nodejs, you can refer to https://nodejs.org/en/ for how to setup nodejs.
- After install nodejs, open your terminal / commandline, navigate to the project folder and run "npm install" to install dependencies
- "npm install" to install dependencies
- "npm run test" to run test
- "npm run problem1" to run problem1, inputs are located at storage/delivery-cost-calculation/
- "npm run problem2" to run problem2, inputs are located at storage/delivery-time-calculation/


Problem 01 - Delivery Cost
- I'm using Parcel instead of Package to avoid confusion.
- Define weight & distrance multiplier inside "storage/delivery-time-calculation/configs.txt"
- config paramteres "weightMultiplier:Number" "distanceMultiplier:Number"
- Define your vouchers and it's rules inside "storage/delivery-cost-calculation/vouchers.txt"
- Each voucher are seperated by new line.
- Voucher paramater are "voucherCode:String" "percentage:Number" "minDistance:Number" "maxDistance:Number" "minWeight:Number" "maxWeight:Number"
- Define your inputs in "storage/delivery-cost-calculation/package.txt"
- First line should have 2 numeric values "baseCost:Number" "numberOfParcel:Number"
- Following lines are the parcel's parameter "ParcelID:String" "weight:Number" "distance:Number" "voucherCode(optional):String"
- hit "npm run problem1" to run the CLA and to see the output.



Problem 2 - Delivery Time Estimation
- I'm using Parcel instead of Package to avoid confusion.
- Define weight & distrance multiplier inside "storage/delivery-time-calculation/configs.txt"
- config paramteres "weightMultiplier:Number" "distanceMultiplier:Number"
- Define your vouchers and it's rules inside "storage/delivery-time-calculation/vouchers.txt"
- Each voucher are seperated by new line.
- Voucher paramater are "voucherCode:String" "percentage:Number" "minDistance:Number" "maxDistance:Number" "minWeight:Number" "maxWeight:Number"
- Define your inputs in "storage/delivery-time-calculation/packages.txt"
- First line should have 2 numeric paramaters values "baseCost" "numberOfParcel"
- Following lines are the parcel's parameter "ParcelID:String" "weight:Number" "distance:Number" "voucherCode(optional):String"
- Last line should have 3 numeric paramaters values "numOfVehicles:Number" "maxSpeed:Number" "maxLoad:Number"
- hit "npm run problem2" to run the CLA and to see the output.



Test Results & Coverage
- test file located at inside "test" folder.
- hit "npm run test" to see the test results.