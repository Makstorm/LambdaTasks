export const calculateDeadline = (
  taskDurationInMinutes: number,
  now = new Date()
) => {
  let durationLeft = taskDurationInMinutes;

  const startOfWorkDay = 10;
  const endOfWorkDay = 19;
  const workDayDurationInMinutes = (endOfWorkDay - startOfWorkDay) * 60;

  const deadline = new Date(now);

  if (now.getDay() === 0) {
    deadline.setDate(deadline.getDate() + 1);
  } else if (now.getDay() === 6) {
    deadline.setDate(deadline.getDate() + 2);
  } else if (now.getHours() < startOfWorkDay) {
    deadline.setHours(startOfWorkDay, 0, 0, 0);
  } else if (
    now.getHours() >= endOfWorkDay ||
    (now.getHours() === endOfWorkDay && now.getMinutes() > 0)
  ) {
    deadline.setDate(deadline.getDate() + 1);
    deadline.setHours(startOfWorkDay, 0, 0, 0);
  } else {
    let currentDayWorkTimeLeft =
      endOfWorkDay * 60 - (deadline.getHours() * 60 + deadline.getMinutes());

    if (durationLeft <= currentDayWorkTimeLeft) {
      deadline.setMinutes(deadline.getMinutes() + durationLeft);
    } else {
      durationLeft -= currentDayWorkTimeLeft;
      deadline.setDate(deadline.getDate() + 1);
      deadline.setHours(startOfWorkDay, 0, 0, 0);
    }
  }

  // console.log("start day", deadline.getDay(), deadline.getHours());

  while (durationLeft !== 0) {
    // console.log(durationLeft);
    // console.log("startofIteration", deadline.getDay(), deadline.getHours());
    if (deadline.getDay() === 6) {
      deadline.setDate(deadline.getDate() + 2);
      deadline.setHours(startOfWorkDay, 0, 0, 0);
    }

    if (durationLeft <= workDayDurationInMinutes) {
      deadline.setMinutes(deadline.getMinutes() + durationLeft);
      durationLeft -= durationLeft;
    } else {
      deadline.setDate(deadline.getDate() + 1);
      deadline.setHours(startOfWorkDay, 0, 0, 0);
      durationLeft -= 540;
    }
    // console.log("endofIteration", deadline.getDay(), deadline.getHours());
  }

  return deadline;
};
