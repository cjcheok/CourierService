# CourierService

Problem 01 - Delivery Cost
- I'm using Parcel instead of Package to avoid confusion.
- Define your vouchers and it's rules inside "inputs/vouchers.txt"
- Each voucher are seperated by new line.
- Voucher paramater are "voucherCode" "percentage" "minDistance" "maxDistance" "minWeight" "maxWeight"
- Define your inputs in "inputs/delivery-cost.txt"
- First line should have 2 numeric values "baseCost" "numberOfParcel"
- Following lines are the parcel's parameter "ParcelID" "weight" "distance" "voucherCode(optional)"
- hit "npm run problem1" to run the CLA and to see the output.


Problem 2 - Delivery Time Estimation
- I'm using Parcel instead of Package to avoid confusion.
- Define your vouchers and it's rules inside "inputs/vouchers.txt"
- Each voucher are seperated by new line.
- Voucher paramater are "voucherCode" "percentage" "minDistance" "maxDistance" "minWeight" "maxWeight"
- Define your inputs in "inputs/delivery-time-estimation.txt"
- First line should have 2 numeric paramaters values "baseCost" "numberOfParcel"
- Following lines are the parcel's parameter "ParcelID" "weight" "distance" "voucherCode(optional)"
- Last line should have 3 numeric paramaters values "numOfVehicles" "maxSpeed" "maxLoad"
- hit "npm run problem2" to run the CLA and to see the output.


Test Results & Coverage
- test file located at test/delivery-calculator.test.js
- hit "npm run test" to see the test results.
- the test also utilise "inputs/vouchers.txt", "inputs/delivery-cost.txt" and "inputs/delivery-time-estimation.txt"