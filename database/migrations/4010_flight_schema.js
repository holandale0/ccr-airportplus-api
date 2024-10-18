'use strict'





/** @type {import('@adonisjs/lucid/src/Schema')} */





const Schema    = use ('Schema')
const TableName = 'Flight'





class FlightSchema extends Schema
{





  up()
  {
    this.create
    (
      TableName, (table) =>
      {
        table.increments ('Id')

        //#region UP

        table.integer ('EnterpriseId') .references ('Id') .inTable ('Company' ) .notNullable()

        table.specificType ('Type', 'tinyint')                                        .notNullable()   // Arrival, Departure
        table.date         ('Date'           )                                        .nullable()
        table.integer      ('LinkId'         ) .references ('Id') .inTable ('Flight') .nullable()

        table.integer ('SubsidiaryId'    ) .references ('Id') .inTable ('Company' ) .notNullable()
        table.integer ('TerminalId'      ) .references ('Id') .inTable ('Resource') .notNullable()
        table.integer ('GateId'          ) .references ('Id') .inTable ('Resource') .nullable()
        table.integer ('StandId'         ) .references ('Id') .inTable ('Resource') .nullable()
        table.integer ('CheckinCounterId') .references ('Id') .inTable ('Resource') .nullable()
        table.integer ('BeltId'          ) .references ('Id') .inTable ('Resource') .nullable()

        table.integer ('AirlineId'               ) .references ('Id') .inTable ('Company' ) .notNullable()
        table.integer ('Code'                    )                                          .notNullable()
        table.integer ('AircraftId'              ) .references ('Id') .inTable ('Aircraft') .nullable()
        table.string  ('AircraftRegistration', 20)                                          .nullable()
        table.string  ('AircraftSerialNumber', 20)                                          .nullable()

        table.integer  ('OriginId'           ) .references ('Id') .inTable ('Company') .notNullable()   // Origin Airport
        table.datetime ('OriginScheduledTime') .nullable()
        table.datetime ('OriginActualTime'   ) .nullable()

        table.integer  ('DestinationId'           ) .references ('Id') .inTable ('Company') .notNullable()   // Destination Airport
        table.datetime ('DestinationScheduledTime') .nullable()
        table.datetime ('DestinationEstimatedTime') .nullable()

        table.datetime ('ScheduledTime') .nullable()   // Schedured local time
        table.datetime ('EstimatedTime') .nullable()   // Estimated local time
        table.datetime ('ActualTime'   ) .nullable()   // Actual local time

        table.boolean ('Ramp'     ) .notNullable()
        table.boolean ('Passenger') .notNullable()
        table.boolean ('Cargo'    ) .notNullable()

        table.specificType ('Services'   , 'tinyint') .nullable()
        table.specificType ('Employees'  , 'tinyint') .nullable()
        table.specificType ('Equipments' , 'tinyint') .nullable()
        table.specificType ('Attachments', 'tinyint') .nullable()

        table.integer ('MainServiceId') .references ('Id') .inTable ('MainService') .nullable()

        table.integer ('InboundNumber'    ) .nullable()
        table.integer ('OutboundNumber'   ) .nullable()
        table.string  ('TailNumber'    , 5) .nullable()

        table.datetime ('OnBlock' ) .nullable()
        table.datetime ('OffBlock') .nullable()

        table.specificType ('Comments', 'nvarchar (max)') .nullable()

        //#endregion

        table.timestamps()
        table.specificType ('Status', 'tinyint') .defaultTo (0)   // Ontime, Delayed, Cancelled
      }
    )



    this.alter
    (
      TableName, (table) =>
      {
        table.renameColumn ('created_at', 'CreatedAt')
        table.renameColumn ('updated_at', 'UpdatedAt')
      }
    )
  }





  down()
  {
    this.drop (TableName)
  }





}





module.exports = FlightSchema
