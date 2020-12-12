import SERVER_DATA from "data/all";

function shouldUpdateDayCycle() {
  const tick = SERVER_DATA.TICK;
  const time_between_nights = SERVER_DATA.TIME_BETWEEN_NIGHTS;

  return Math.round(tick / (
    time_between_nights / 50
  )) === tick / (
    time_between_nights / 50
  );
}

export default shouldUpdateDayCycle;
