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
import './styles.css';
import { EditTax } from './Components/TaxeManagement/EditTax';
import { CreateTax } from './Components/TaxeManagement/CreateTax';

export const App = () => {
  return <>
      <Router>
      <ToastContainer autoClose={2500} />
      <Navigation/>
      <Route path="/" exact component={TaxManagement}/>
      <Route path="/entreprise/edit/:id" exact component={EditTax}/>
      <Route path="/entreprise/create/" exact component={CreateTax}/>
      </Router>
  </>
}
