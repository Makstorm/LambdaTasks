import { VacationEntry, GroupedVacantions } from "models";

export const getGroupedVacantions = (vacations: VacationEntry[]) => {
  const groupedVacantions = new Map<string, GroupedVacantions>();

  vacations.forEach((vacation) => {
    if (!groupedVacantions.has(vacation.user._id)) {
      groupedVacantions.set(vacation.user._id, {
        userId: vacation.user._id,
        name: vacation.user.name,
        weekenDates: [
          { startDate: vacation.startDate, endDate: vacation.endDate },
        ],
      });
    } else {
      const vacationsEtry = groupedVacantions.get(vacation.user._id)!;
      vacationsEtry.weekenDates.push({
        startDate: vacation.startDate,
        endDate: vacation.endDate,
      });
    }
  });

  return Array.from(groupedVacantions.values());
};
