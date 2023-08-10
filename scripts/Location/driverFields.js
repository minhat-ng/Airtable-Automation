let inputConfig = input.config()
const driver_id = inputConfig.id

const driversTable = base.getTable("📅 Scheduled Slots")
const view = driversTable.getView("Confirmed All Drivers - This Week")
const drivers = await view.selectRecordsAsync()

const driver = drivers.getRecord(driver_id)
const driver_name = driver.getCellValueAsString("Full Name")
const driver_time_slot = driver.getCellValueAsString("Slot Time")
const driver_zip = parseInt(driver.getCellValueAsString("Zip Code"))