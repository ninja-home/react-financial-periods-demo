import { createSlice } from "@reduxjs/toolkit";
import { FinancePeriodType, StoreType } from "utils/types";

export interface ReducerSetFinancialPeriodsActionType {
  payload: Array<FinancePeriodType>
}

// let initRecipeValueFromLocalStorage: Array<FinancePeriodType> = [];
// const localStorageData = window.localStorage.getItem('MY_APP_STATE')
// if (localStorageData) {
//   initRecipeValueFromLocalStorage = JSON.parse(localStorageData)
// }

export const reduxSlice: any = createSlice({
  name: 'reduxSlice',
  initialState: {
    financialPeriods: [] // initRecipeValueFromLocalStorage
  },
  reducers: {
    setFinancialPeriods: (state: StoreType, action: ReducerSetFinancialPeriodsActionType) => {
      state.financialPeriods = action.payload
      // window.localStorage.setItem('MY_APP_STATE', JSON.stringify(state.financialPeriods));
    },
    deleteFinancialPeriodItem: (state: StoreType, action: {
      payload: FinancePeriodType
    }) => {
      state.financialPeriods = state.financialPeriods.filter(item => item.id !== action.payload.id)
      // window.localStorage.setItem('MY_APP_STATE', JSON.stringify(state.financialPeriods));
    }
  }
})

export const { setFinancialPeriods, deleteFinancialPeriodItem } = reduxSlice.actions

export default reduxSlice.reducer