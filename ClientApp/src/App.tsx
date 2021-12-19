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
import { ManagePrices } from './Components/TaxeManagement/Prices/ManagePrices';
import { ManageNotReceived } from './Components/TaxeManagement/NotReceived/ManageNotReceived';
import { Loader } from './Components/UI/Loader';
import { ChangeFiscalYear } from './Components/TaxeManagement/FiscalYear/ChangeFiscalYear';
import { IExercice } from './Types/IExercice';
import { Login } from './Components/TaxeManagement/Login';
import { Register } from './Components/TaxeManagement/Register';

export const App = () => {
  const [motifsMajoration, setMotifsMajoration] = useState<any>(null)
  const [tarifs, setTarifs] = useState<any>(null)
  const [exerciceCourant, setExerciceCourant] = useState<any>(null)
  const [informations, setInformations] = useState<any>(null)

  useEffect(() => {
    (async () => {
      const motifs = await apiFetch('/motifs_majoration/getall')
      const tarifs = await apiFetch('/prices/getall')
      const exerciceCourant = await apiFetch('/fiscalyears/getcurrentfiscalyear')
      const informations = await apiFetch('/informations/getinformations')
      setMotifsMajoration(motifs)
      setTarifs(tarifs)
      setExerciceCourant(exerciceCourant)
      setInformations(informations)
    })()
  }, [])

  const editFiscalYear = (data: any) => {
    if(data.id == exerciceCourant.id) {
      setExerciceCourant(data)
    }
  }
  return <>
    <Router>
      <ToastContainer autoClose={2500} />
      <Navigation />
      <Route path="/" exact component={TaxManagement} />
      <Route path="/entreprise/edit/:id" exact render={(matchProps) =>
        <EditTax {...matchProps} motifs={motifsMajoration} tarifs={tarifs} currentFiscalYear={exerciceCourant} informations={informations} />
      }>
      </Route>
      <Route path="/entreprise/create/" exact>
        <CreateTax motifs={motifsMajoration} tarifs={tarifs} currentFiscalYear={exerciceCourant} />
      </Route>
      <Route path="/entreprise/view/:id" exact component={ViewTax} />
      <Route path="/notreceived" exact>
        {exerciceCourant != null ? <ManageNotReceived motifs={motifsMajoration} currentFiscalYear={exerciceCourant} /> : <Loader/>}
      </Route>
      <Route path="/tools/printalldeclarations" exact>
        {(tarifs != null && exerciceCourant != null && informations != null) && <PrintAllTaxes tarifs={tarifs} currentFiscalYear={exerciceCourant} informations={informations} />}
      </Route>
      <Route path="/tools/managefiscalyears">
        <ManageFiscalYears handleEdit={editFiscalYear} />
        </Route>
      <Route path="/tools/manageprices" component={ManagePrices} />
      <Route path="/tools/changefiscalyear">
        <ChangeFiscalYear currentFiscalYear={exerciceCourant} handleChange={(data: IExercice) => setExerciceCourant(data)} />
        </Route>
      <Route path="/login" component={Login}/>
      <Route path="/register" component={Register}/>
    </Router>
  </>
}
