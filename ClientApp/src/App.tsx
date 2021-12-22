import React, { useEffect, useState, useMemo } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
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
import { PrintAllMinutes } from './Components/TaxeManagement/PrintAllMinutes';
import { IUser } from './Types/IUser';
import { PrivateRoute } from './Components/PrivateRoute';
import { UserContext } from './Components/Contexts/UserContext';
import { ManageUsers } from './Components/ManageUsers/ManageUsers';
import { EditUser } from './Components/ManageUsers/EditUser';
import { PasswordChange } from './Components/ManageUsers/PasswordChange';

export const App = () => {
  const [user, setUser] = useState<IUser | null>(null)
  const [motifsMajoration, setMotifsMajoration] = useState<any>(null)
  const [tarifs, setTarifs] = useState<any>(null)
  const [exerciceCourant, setExerciceCourant] = useState<any>(null)
  const [informations, setInformations] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    (async () => {
      if (user === null) {
        try {
          const fetchuser = await apiFetch('/user/getuser')
          setUser(fetchuser)
        } catch(e: any) {
          setUser(null)
        }
        
      }
      if (user !== null) {
        const motifs = await apiFetch('/motifs_majoration/getall')
        const tarifs = await apiFetch('/prices/getall')
        const exerciceCourant = await apiFetch('/fiscalyears/getcurrentfiscalyear')
        const informations = await apiFetch('/informations/getinformations')
        setMotifsMajoration(motifs)
        setTarifs(tarifs)
        setExerciceCourant(exerciceCourant)
        setInformations(informations)
      }
      setLoading(false)
    })()
  }, [user])

  const editFiscalYear = (data: any) => {
    if (data.id == exerciceCourant.id) {
      setExerciceCourant(data)
    }
  }

  const toggleUser = (user?: IUser) => {
    if(user === undefined) {
      setUser(null)
    } else {
      setUser(user)
    }
  }

  const value = useMemo(() => {
    return {
      user,
      toggleUser
    }
  }, [user, toggleUser])

  return <>
    {loading ? 'chargement' :
      <Router>
        <UserContext.Provider value={value}>
        <ToastContainer autoClose={2500} />
        <Navigation />
        <PrivateRoute path="/" exact component={TaxManagement} user={user} />
        <Route path="/entreprise/edit/:id" exact render={(matchProps) =>
          <EditTax {...matchProps} motifs={motifsMajoration} tarifs={tarifs} currentFiscalYear={exerciceCourant} informations={informations} />
        }>
        </Route>
        <Route path="/entreprise/create/" exact>
          <CreateTax motifs={motifsMajoration} tarifs={tarifs} currentFiscalYear={exerciceCourant} />
        </Route>
        <Route path="/entreprise/view/:id" exact component={ViewTax} />
        <Route path="/notreceived" exact>
          {exerciceCourant != null ? <ManageNotReceived motifs={motifsMajoration} currentFiscalYear={exerciceCourant} /> : <Loader />}
        </Route>
        <Route path="/tools/printalldeclarations" exact>
          {(tarifs != null && exerciceCourant != null && informations != null) && <PrintAllTaxes tarifs={tarifs} currentFiscalYear={exerciceCourant} informations={informations} />}
        </Route>
        <Route path="/tools/printallminutes" exact>
          {(tarifs != null && motifsMajoration != null && exerciceCourant != null && informations != null) && <PrintAllMinutes tarifs={tarifs} motifsMajoration={motifsMajoration} currentFiscalYear={exerciceCourant} informations={informations} />}
        </Route>
        <Route path="/tools/managefiscalyears">
          <ManageFiscalYears handleEdit={editFiscalYear} />
        </Route>
        <Route path="/tools/manageprices" component={ManagePrices} />
        <Route path="/tools/changefiscalyear">
          <ChangeFiscalYear currentFiscalYear={exerciceCourant} handleChange={(data: IExercice) => setExerciceCourant(data)} />
        </Route>
        <Route path="/login">
          {user ? <Redirect to="/"/> : <Login handleLogin={toggleUser}/>}
        </Route>
        <Route path="/register" component={Register} />
        <Route path="/manageaccess/all" component={ManageUsers}/>
        <Route path="/manageaccess/edit/:id" exact component={EditUser} />
        <Route path="/passwordchange" component={PasswordChange}/>
        </UserContext.Provider>
      </Router>
    }
  </>
}
