import { VacationEntry } from "./models";
import vacations from "./vacations.json";
import { getGroupedVacantions } from "./utils";

const typedVacantions: VacationEntry[] = vacations;

console.log(getGroupedVacantions(typedVacantions));
