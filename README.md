# CourierService

Problem 01 - Delivery Cost
- I'm using Parcel instead of Package to avoid confusion.
- Define your vouchers and it's rules inside "inputs/vouchers.txt"
- Each voucher are seperated by new line.
- Voucher paramater are "voucherCode" "percentage" "minDistance" "maxDistance" "minWeight" "maxWeight"
- Define your inputs in "inputs/delivery-cost.txt"
- First line should have 2 numeric values "baseCost" "numberOfParcel"
- Following lines are the parcel's parameter "ParcelID" "weight" "distance" "voucherCode(optional)"
- hit "npm run delivery-cost" to run the CLA and to see the output.
- test file located at test/delivery-cost.test.js
- the test also utilise "inputs/vouchers.txt" and "inputs/delivery-cost.txt"
- hit "npm run test delivery-cost" to see the test results.
