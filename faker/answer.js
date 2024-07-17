import {faker} from "@faker-js/faker"
import Answer from "../models/Answer.js"

const run = async (limit) =>{
try {

    let data = []

    for(let i = 0; i < limit; i++){
    data.push({
        "6695cf5189a3dd563684b328": faker.person.fullName(),
        "6684a8cc478516e9586b867c": faker.helpers.arrayElement(["53", "20"]),
        "668b481354a7069f96e844ed": faker.helpers.arrayElements(["Soto", "Rawon", "Bakso"]),
        "formId": "6684a8bd478516e9586b867a",
        "userId": "6684b205ff39f75504c1319c"
    })
 }

   const fakeData = await Answer.insertMany(data)
   if(fakeData) {
    console.log(fakeData)
    process.exit()
   }

} catch (error) {
    console.log(error)
    process.exit()
}


}

export {run}



