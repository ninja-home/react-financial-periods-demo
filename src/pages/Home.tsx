import FinancePeriodsTable from 'components/finance-period-table/FinancePeriodTable';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { APIService } from 'service/api-service';
import { setFinancialPeriods } from 'redux/redux-slice';
import { FinancePeriodType, StoreValue } from 'utils/types';
import MainLayout from '../layouts/MainLayout';

/**
 * Display financial periods data in the materiable table
 * Pulling data from the mock server and dispatch data into the store
 */
const Home: React.FC = () => {
  
  const financialPeriods = useSelector((state: StoreValue) => state.recipeReducer.financialPeriods)
  const dispatch = useDispatch()
  const getFinancialPeriodsData = useCallback(async () => {
    try {
      const financePeriodsRes: Array<FinancePeriodType> = await APIService.getFinancialPeriods()
      dispatch(setFinancialPeriods(financePeriodsRes))
    } catch (e: any) {
      console.log('Get Recipes Error : ', e.response?.data?.message)
    }
  }, [dispatch])

  useEffect(() => {
    if (financialPeriods.length === 0) {
      getFinancialPeriodsData()
    }
  }, [])

  return (
    <MainLayout>
      <FinancePeriodsTable getFinancialPeriodsData={getFinancialPeriodsData}/> 
    </MainLayout>
  );
};

export default Home;