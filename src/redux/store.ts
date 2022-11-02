import { configureStore } from "@reduxjs/toolkit";
import recipeReducer from './redux-slice'

export default configureStore({
  reducer: {
    recipeReducer: recipeReducer
  }
})