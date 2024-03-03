export interface VacationEntry {
  _id: string;
  user: { _id: string; name: string };
  usedDays: number;
  status?: string;
  startDate: string;
  endDate: string;
}

export interface GroupedVacantions {
  userId: string;
  name: string;
  weekenDates: { startDate: string; endDate: string }[];
}
