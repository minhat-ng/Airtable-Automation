let inputConfig = input.config()
const best_loc_id = inputConfig.best_loc_id
const best_loc_name = inputConfig.best_loc_name
const driver_id = inputConfig.driver_id
const driver_name = inputConfig.driver_name

let table = base.getTable("📅 Scheduled Slots")
// let query = await table.selectRecordsAsync({fields: []});

await table.updateRecordAsync(driver_id, {
    "📍 Drop off location": [{id: best_loc_id}],
})


// console.log(`Updated ${driver_name} drop off location to ${best_loc_name}`);
