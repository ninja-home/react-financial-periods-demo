export interface FinancePeriodType {
  id: Number,
  name: String,
  year: number,
  start_date: Date,
  end_date: Date,
  weeks: number
}

export interface StoreType {
  financialPeriods: Array<FinancePeriodType>
}
export interface StoreValue {
  recipeReducer: StoreType
}