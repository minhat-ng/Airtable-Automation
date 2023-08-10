let inputConfig = input.config()
const locId = inputConfig.id
const locStart = inputConfig.locStart
const locStop = inputConfig.locStop
const driversSlotTime = inputConfig.driversSlotTime
const driversSlotID = inputConfig.driversSlotID
const driverHistory = inputConfig.driverHistory
const driversZip = inputConfig.driversZip
const locZip = parseInt(inputConfig.locZip[0])
const length = driversSlotID.length


// check if driver's slot is within [start, end-30mins] (inclusive)
const isTimeWithinSlot = async (driver_time_slot, start_time, end_time) => {
  const driver_time_components = driver_time_slot.match(/(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{2})([ap]m)/i)
  const start_time_components = start_time.match(/(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{2})([ap]m)/i)
  const end_time_components = end_time.match(/(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{2})([ap]m)/i)

  // Extract the parsed components
  const driver_month = parseInt(driver_time_components[1]) - 1 // Months in JavaScript are zero-indexed
  const driver_day = parseInt(driver_time_components[2])
  const driver_year = parseInt(driver_time_components[3])
  const driver_hours = parseInt(driver_time_components[4]) - 4
  const driver_minutes = parseInt(driver_time_components[5])
  const driver_meridiem = driver_time_components[6].toLowerCase()

  const start_month = parseInt(start_time_components[1]) - 1
  const start_day = parseInt(start_time_components[2])
  const start_year = parseInt(start_time_components[3])
  const start_hours = parseInt(start_time_components[4])
  const start_minutes = parseInt(start_time_components[5])
  const start_meridiem = start_time_components[6].toLowerCase()

  const end_month = parseInt(end_time_components[1]) - 1
  const end_day = parseInt(end_time_components[2])
  const end_year = parseInt(end_time_components[3])
  const end_hours = parseInt(end_time_components[4])
  const end_minutes = parseInt(end_time_components[5]) - 30
  const end_meridiem = end_time_components[6].toLowerCase()

  // Convert the time to 24-hour format
  const driver_24_hour = driver_meridiem === "am" ? driver_hours : driver_hours + 12
  const start_24_hour = start_meridiem === "am" ? start_hours : start_hours + 12
  const end_24_hour = end_meridiem === "am" ? end_hours : end_hours + 12

  // Create Date objects with the specified date and time
  const driver_date = new Date(driver_year, driver_month, driver_day, driver_24_hour, driver_minutes)
  const start_date = new Date(start_year, start_month, start_day, start_24_hour, start_minutes)
  const end_date = new Date(end_year, end_month, end_day, end_24_hour, end_minutes)


  //format the driver's date to debug 
  // Step 1: Create a new Date object using the provided parameters
  // const driverDate = new Date(driver_year, driver_month, driver_day, driver_24_hour, driver_minutes);

  // Step 2: Extract the relevant components
  const month = driver_date.getMonth() + 1 // Months are zero-based
  const day = driver_date.getDate()
  const year = driver_date.getFullYear()
  const hours = driver_date.getHours()
  const minutes = driver_date.getMinutes()

  // Step 3: Format the components into the desired format
  const formattedDate = `${month}/${day}/${year}`

  // Step 4: Adjust the hours and add "am" or "pm"
  let formattedTime = "";
  if (hours === 0) {
    formattedTime = `12:${minutes.toString().padStart(2, '0')}am`
  } else if (hours < 12) {
    formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}am`
  } else if (hours === 12) {
    formattedTime = `12:${minutes.toString().padStart(2, '0')}pm`
  } else {
    formattedTime = `${(hours - 12)}:${minutes.toString().padStart(2, '0')}pm`
  }

  // Combine the formatted date and time
  const formattedDateTime = `${formattedDate} ${formattedTime}`

  const result = (driver_date >= start_date && driver_date <= end_date)
  // console.log(formattedDateTime +" | "+ start_time +" | "+ end_time + " => " + result)
  return result
}
function findLocationWithFrequency(arr, minFrequency) {
    const frequencyMap = new Map();

    // Count the frequency of each element
    for (const element of arr) {
        if (frequencyMap.has(element)) {
            frequencyMap.set(element, frequencyMap.get(element) + 1);
        } else {
            frequencyMap.set(element, 1);
        }
    }

    // Identify elements with a frequency of minFrequency or more
    const result = [];
    for (const [element, frequency] of frequencyMap.entries()) {
        if (frequency >= minFrequency) {
            result.push(element);
        }
    }

    return result;
}



// dismissedIndices: set of indicies that we don't want 
let dismissedIndices = new Set()
for (let i = 0; i < driversSlotTime.length; i++) {
      const slotTime = driversSlotID[i]
        await isTimeWithinSlot(slotTime, locStart, locStop)
          .then(result => {
            if (!result) {
              // add unwanted index
              dismissedIndices.add(i)
            }
          })
          .catch(e => {
            // console.log("An error occurred:", e)
          })       
}

// mixmatchedList: set of indicies that we allow
let allowedIndices = [];
for (let i = 0; i <= length; i++) {
    if (!dismissedIndices.has(i)) {
        allowedIndices.push(i);
    }
}


// since index of the input lists match, check if the current index is in the mixmatched_list -> access respective driversHistory + id 
// if finds a driver that has the current location as their frequent location, output that slot
let foundDriverID = ""

for (let i = 0; i < allowedIndices.length; i++){
  let index = allowedIndices[i]
  if (driverHistory[index].length >= 5){
    let locationsWithFrequency = findLocationWithFrequency(driverHistory[index], 5)
    if (locationsWithFrequency && locationsWithFrequency.includes(locId)){
        foundDriverID = driversSlotID[index]
        break
    }
  }
}
output.set("slot", foundDriverID)


// if didn't find driver with matching frequent location, find the nearest driver
let closestDriverID = "";
let firstAllowedIndex = allowedIndices[0]
let closestNumber = parseInt(driversZip[firstAllowedIndex]);
if (!foundDriverID){
  let minDifference = Math.abs(locZip - closestNumber);
   for (let i = 1; i < allowedIndices.length; i++) {
     let index = allowedIndices[i]
     let currentDifference = Math.abs(locZip - parseInt(driversZip[index]));
     if (currentDifference < minDifference) {
            minDifference = currentDifference;
            closestNumber = parseInt(driversZip[index]);
            closestDriverID = driversSlotID[index];
      }
  }
  output.set("slot", closestDriverID)
}
