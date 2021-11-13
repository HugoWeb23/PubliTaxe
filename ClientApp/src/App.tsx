import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { Navigation } from './Components/Navigation/Navigation';
import { TaxManagement } from './Components/TaxeManagement/TaxManagement';

export const App = () => {
  return <>
      <Router>
      <Navigation/>
      <Route path="/gestion" component={TaxManagement}/>
      </Router>
  </>
}
