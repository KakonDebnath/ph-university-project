import { TSchedule } from './offeredCourse.interface';

const hasTimeConflict = (
  existingSchedules: TSchedule[],
  newSchedule: TSchedule,
) => {
  for (const exSchedule of existingSchedules) {
    const existingStartTime = new Date(`1970-01-01T${exSchedule.startTime}`);
    const existingEndTime = new Date(`1970-01-01T${exSchedule.endTime}`);

    const newStartTime = new Date(`1970-01-01T${newSchedule.startTime}`);
    const newEndTime = new Date(`1970-01-01T${newSchedule.endTime}`);

    // 10:30 - 12:30
    // 11:30 - 1.30
    if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
      return true;
    }
  }

  return false;
};

export default hasTimeConflict;
