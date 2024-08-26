
const TimezoneOffset = -5;
export function inWorkingHours(): boolean {
    const today = new Date();

    today.setHours(today.getHours() + TimezoneOffset);

    const hour = today.getHours();
    const minutes = today.getMinutes();
    const weekDay = today.getDay();

    switch (weekDay) {
      case 0:
        console.log(`sunday: ${hour}:${minutes}`);
        return false;
      case 6:
        console.log(`saturday: ${hour}:${minutes}`);
        return hour >= 8 && hour < 13; // Entre las 8:00 AM y las 12:59 PM
      default:
        console.log(`on Week: ${hour}:${minutes}`);
        return (
          (hour >= 8 && hour < 13) || // Entre las 8:00 AM y las 12:59 AM
          (hour >= 0 && hour < 17) // Entre las 2:00 PM y las 4:59 PM   17
        );
    }
  }