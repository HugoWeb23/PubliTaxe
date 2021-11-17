import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { Navigation } from './Components/Navigation/Navigation';
import { TaxManagement } from './Components/TaxeManagement/TaxManagement';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const App = () => {
  return <>
      <Router>
      <ToastContainer autoClose={2500} />
      <Navigation/>
      <Route path="/gestion" component={TaxManagement}/>
      </Router>
  </>
}
