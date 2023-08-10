let inputConfig = input.config()
const slot = inputConfig.slot
const locID = inputConfig.id
let recordIds = [locID]
let table = base.getTable("📅 Scheduled Slots")

let locationTable = base.getTable("📍 Drop off locations")
let view = locationTable.getView("Drop-offs for This Weekend")

let queryResult = await view.selectRecordsAsync({fields: ["Not Full"]});
let record = queryResult.getRecord(queryResult.recordIds[0]);
// console.log(record.getCellValueAsString("is Full"));
if (record.getCellValueAsString("Not Full") === "True"){
        await table.updateRecordAsync(slot, {
        "📍 Drop off location": [{id: locID}],
    })
}
