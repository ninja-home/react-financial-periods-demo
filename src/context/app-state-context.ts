import { createContext } from "react";
import { FinancePeriodType } from "utils/types";

export interface AppState {
  financialPeriods: Array<FinancePeriodType>
}

export const initialState: AppState = {
  financialPeriods: []
}

const AppStateContext = createContext<AppState>(initialState)

export default AppStateContext