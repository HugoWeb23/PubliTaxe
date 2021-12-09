import React, { useEffect, useState } from 'react';
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
import { ViewTax } from './Components/TaxeManagement/ViewTax';
import { apiFetch } from './Services/apiFetch';
import { PrintAllTaxes } from './Components/TaxeManagement/PrintAllTaxes';
import { ManageFiscalYears } from './Components/TaxeManagement/FiscalYear/ManageFiscalYears';

export const App = () => {
  const [motifsMajoration, setMotifsMajoration] = useState<any>(null)
  const [tarifs, setTarifs] = useState<any>(null)

  useEffect(() => {
    (async () => {
      const motifs = await apiFetch('/motifs_majoration/getall')
      const tarifs = await apiFetch('/prices/getall')
      setMotifsMajoration(motifs)
      setTarifs(tarifs)
    })()
  }, [])
  return <>
    <Router>
      <ToastContainer autoClose={2500} />
      <Navigation />
      <Route path="/" exact component={TaxManagement} />
      <Route path="/entreprise/edit/:id" exact render={(matchProps) =>
        <EditTax {...matchProps} motifs={motifsMajoration} tarifs={tarifs} />
      }>
      </Route>
      <Route path="/entreprise/create/" exact>
        <CreateTax motifs={motifsMajoration} tarifs={tarifs} />
      </Route>
      <Route path="/entreprise/view/:id" exact component={ViewTax} />
      <Route path="/tools/printall" exact>
        <PrintAllTaxes tarifs={tarifs} />
      </Route>
      <Route path="/tools/managefiscalyears" component={ManageFiscalYears}/>
    </Router>
  </>
}
