let inputConfig = input.config()
const locationsList = inputConfig.locationsList
const driver_time_slot = inputConfig.timeSlot

// console.log(final_locations_list_id)
// console.log(driver_time_slot)

const locationsTable = base.getTable("📍 Drop off locations")
const locView = locationsTable.getView("Drop-offs for This Weekend")


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

let mismatched_list = new Set()
if (driver_time_slot) {
    for (let i = 0; i < locationsList.length; i++) {
      const loc_id = locationsList[i]
      const loc_rec = await locView.selectRecordAsync(loc_id)
      if (loc_rec) {
        const start_time = loc_rec.getCellValueAsString("Starts accepting at")
        const end_time = loc_rec.getCellValueAsString("Stops accepting at")
        
        await isTimeWithinSlot(driver_time_slot, start_time, end_time)
          .then(result => {
            if (!result) {
              mismatched_list.add(loc_id)
            }
          })
          .catch(e => {
            // console.log("An error occurred:", e)
          })
      
        
      }
    }
}
// console.log(mismatched_list)
let shorten_list = locationsList.filter(element => !mismatched_list.has(element)) //remove time mismatched locations
console.log(shorten_list.length)
output.set("locationsList", shorten_list)
