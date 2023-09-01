
 

let from = "2023-10-01"
  let today = new Date(from+"T00:00:00Z").toISOString();
  // Current date and time
 // Set time to 12:00 AM

console.log(new Date(from+"T00:00:00Z").toISOString());

//Fri Aug 25 2023 05:30:00 GMT+0530 (India Standard Time)

const isoDateString = "2023-10-01T00:00:00.000Z";
const dateObject = new Date(isoDateString);

console.log(dateObject); // Output: 2023-10-01T00:00:00.000Z
