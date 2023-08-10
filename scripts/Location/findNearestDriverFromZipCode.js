let inputConfig = input.config()
const locationsList = inputConfig.locationsList
const driver_zip_code = inputConfig.zip

const locationsTable = base.getTable("📍 Drop off locations")
const locView = locationsTable.getView("Drop-offs for This Weekend")
let queryZipCodeResult = await locView.selectRecordsAsync({fields: ["🗺 Zip Codes"]})
let queryName = await locView.selectRecordsAsync({fields: ["Drop off location"]})
let best_loc_id

//find common locations(s) in driver_consistent_locations and final_locations_list_id
let shorten_list_zip = []
if (locationsList && driver_zip_code) {
  // console.log(shorten_list.length)
  for (let i = 0; i < locationsList.length; i++) {
    const loc_id = locationsList[i]
    let loc_rec = queryZipCodeResult.getRecord(loc_id)
    if (loc_rec) {
      shorten_list_zip.push(parseInt(loc_rec.getCellValueAsString("🗺 Zip Codes")))
    }
  }
}

// find nearest zip code 
let closestZipCode = null
let closestDistance = Infinity
for (let i = 0; i < locationsList.length; i++) {
    const currentZipCode = shorten_list_zip[i]
    const currentDistance = Math.abs(currentZipCode - driver_zip_code)
    if (currentDistance < closestDistance) {
        closestZipCode = currentZipCode
        closestDistance = currentDistance
    }
}
const index = shorten_list_zip.indexOf(closestZipCode)
best_loc_id = locationsList[index]

// console.log(best_loc_id)
let res = queryName.getRecord(best_loc_id)
output.set("best_loc_name", res.getCellValueAsString("Drop off location"))
output.set("best_loc_id", best_loc_id)
