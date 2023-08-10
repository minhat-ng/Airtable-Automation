let inputConfig = input.config()
const restrictNeighbors = inputConfig.restrictNeighbors
const locationsList = inputConfig.locationsList



const neighborhoodsTable = base.getTable("🏡 Neighborhoods")

const find_restricted_loc = async restricted => {
  let restricted_list = new Set()
  if (restricted) {
    for (let i = 0; i < restricted.length ; i++) {
      const neighD = restricted[i]
      const neigh_record = await neighborhoodsTable.selectRecordAsync(neighD)
      if (neigh_record) {
        const loc_list = neigh_record.getCellValue("📍 Drop off locations")
        if (loc_list){
          loc_list.forEach(loc_record => {restricted_list.add(loc_record.id)})
        }
      }
    }
  }
  return restricted_list
}


let remove_loc = new Set()
if (restrictNeighbors) {
        await find_restricted_loc(restrictNeighbors)
          .then(result => {
            for (let item of result) {remove_loc.add(item)}
          })
          .catch(e => {
            // console.log("An error occurred:", e)
          })
}

let curr_list = locationsList.filter(element => !remove_loc.has(element)) //remove restricted locations
console.log(curr_list.length)
output.set("locationsList", curr_list)
