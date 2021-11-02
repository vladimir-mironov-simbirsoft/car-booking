type Query = [string, any[]];

export const getReport = (from: string, to: string): Query => [
  `
    WITH cars AS
    (
      SELECT
        car."id", car."licensePlate"
      FROM car
    ), booking_car_percentage AS
    (
      SELECT
          booking."carId",
          SUM(booking."cost") as "cost",
          SUM(DATE_PART('day', AGE(booking."to", booking."from"))) as "bookingDays",
          to_char((SUM(DATE_PART('day', AGE(booking."to", booking."from")))/DATE_PART('day', AGE($1, $2)))*100, 'FM999999999.00') as "percentage"
      FROM booking
      where booking."from" <= $1 :: timestamp and booking."to" >= $2 :: timestamp
      GROUP BY booking."carId"
    )
    SELECT
      cars."id" AS "carId",
      cars."licensePlate",
      case when coalesce(booking."percentage", '0')::numeric > 100 then '100' else coalesce(booking."percentage", '0')  end AS "percentagePerCar",
      coalesce(to_char((sum( case when booking."bookingDays" > DATE_PART('day', AGE($1, $2)) then DATE_PART('day', AGE($1, $2)) else booking."bookingDays"   end) over ()/(count(cars."id") over () * DATE_PART('day', AGE($1, $2)))::numeric) * 100, 'FM999999999.00'), '0') as "totalPercentage"
    FROM cars
    LEFT JOIN booking_car_percentage as booking
      on cars."id" = booking."carId"
    group by cars."id", cars."licensePlate", booking."cost", booking."bookingDays", booking."percentage"
    ORDER BY cars."id" 
  `,
  [to, from],
];
