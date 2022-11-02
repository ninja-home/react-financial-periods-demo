import { BASE_URL, httpClient } from "./http-client"

export const APIService = {
  getFinancialPeriods: async () => await httpClient.get(`${BASE_URL}FinancialPeriods`),
  addFinancialPeriods: async (params: object) => await httpClient.post(`${BASE_URL}FinancialPeriods`, params),
  updateFinancialPeriods: async (params: object) => await httpClient.put(`${BASE_URL}FinancialPeriods`, params),
  deleteFinancialPeriods: async (params: object) => await httpClient.delete(`${BASE_URL}FinancialPeriods`, params)
}