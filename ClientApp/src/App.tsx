import { useEffect, useState, useMemo } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from "react-router-dom";
import { Alert } from 'react-bootstrap'
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
import { ManageGeneralInformations } from './Components/TaxeManagement/GeneralInformations/ManageGeneralInformations';
import { IInformation } from './Types/IInformations';
import { IPrice } from './Types/IPrice';
import { ManageInactiveAccounts } from './Components/ManageUsers/ManageInactiveAccounts';
import { ManageAccount } from './Components/UserAccount/ManageAccount';
import { AppLoader } from './Components/UI/AppLoader';
import { ManageSimulations } from './Components/TaxeManagement/Simulations/ManageSimulations';
import { CreateSimulation } from './Components/TaxeManagement/Simulations/CreateSimulation';
import { EditSimulation } from './Components/TaxeManagement/Simulations/EditSimulation';
import { ManagePayment } from './Components/TaxeManagement/Payment/ManagePayments';
import { PaymentDetail } from './Components/TaxeManagement/Payment/PaymentDetail';
import { ManageNothingToPay } from './Components/TaxeManagement/Payment/NothingToPay/ManageNothingToPay';
import { Footer } from './Components/Footer/Footer';

export const App = () => {
  const [user, setUser] = useState<IUser | null>(null)
  const [motifsMajoration, setMotifsMajoration] = useState<any>(null)
  const [tarifs, setTarifs] = useState<any>(null)
  const [exerciceCourant, setExerciceCourant] = useState<any>(null)
  const [informations, setInformations] = useState<IInformation | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    (async () => {
      if (user === null) {
        try {
          const fetchuser = await apiFetch('/user/getuser')
          setUser(fetchuser)
        } catch (e: any) {
          setUser(null)
        }

      }
      if (user !== null) {
        try {
          if (motifsMajoration === null) {
            const motifs = await apiFetch('/motifs_majoration/getall')
            setMotifsMajoration(motifs)
          }
          if (tarifs === null) {
            const tarifs = await apiFetch('/prices/getall')
            setTarifs(tarifs)
          }
          if (exerciceCourant === null) {
            const exerciceCourant = await apiFetch('/fiscalyears/getcurrentfiscalyear')
            setExerciceCourant(exerciceCourant)
          }
          if (informations === null) {
            const informations = await apiFetch('/informations/getinformations')
            setInformations(informations)
          }
        } catch (e: any) {
          setError(true)
        }
      }
      setTimeout(() => setLoading(false), 800)
    })()
  }, [user])

  const editFiscalYear = (data: any) => {
    if (data.id == exerciceCourant.id) {
      setExerciceCourant(data)
    }
  }

  const toggleUser = (user?: IUser) => {
    if (user === undefined) {
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
  }, [user])

  return <>
    {loading ? <AppLoader /> :
      <Router>
        <UserContext.Provider value={value}>
          <ToastContainer autoClose={2500} />
          <Navigation />
          {error ? <Alert variant="danger" className="mt-3">Une erreur est survenue lors du chargement des données. Veuillez actualiser la page et contacter le service informatique si le problème persiste.</Alert> : <><PrivateRoute path="/business_management" exact component={TaxManagement} />
            <Route path="/" exact>
              <Redirect to={{ pathname: '/business_management' }} />
            </Route>
            <PrivateRoute path="/entreprise/edit/:id" exact>
              <EditTax motifs={motifsMajoration} tarifs={tarifs} currentFiscalYear={exerciceCourant} informations={informations} />
            </PrivateRoute>
            <PrivateRoute path="/entreprise/create/" exact>
              <CreateTax motifs={motifsMajoration} tarifs={tarifs} currentFiscalYear={exerciceCourant} />
            </PrivateRoute>
            <PrivateRoute path="/entreprise/view/:id" exact>
              {(tarifs != null && motifsMajoration != null && exerciceCourant != null && informations != null) ? <ViewTax motifs={motifsMajoration} tarifs={tarifs} currentFiscalYear={exerciceCourant} informations={informations} /> : <Loader />}
            </PrivateRoute>
            <PrivateRoute path="/notreceived" exact>
              {exerciceCourant != null ? <ManageNotReceived motifs={motifsMajoration} currentFiscalYear={exerciceCourant} /> : <Loader />}
            </PrivateRoute>
            <PrivateRoute path="/payment_management" exact>
              {exerciceCourant != null ? <ManagePayment currentFiscalYear={exerciceCourant} /> : <Loader />}
            </PrivateRoute>
            <PrivateRoute path="/payment_management/nothingtopay" exact>
              <ManageNothingToPay />
            </PrivateRoute>
            <PrivateRoute path="/payment_management/details/:id" exact component={PaymentDetail} />
            <PrivateRoute path="/tools/pricingsimulation" exact>
              {(tarifs != null && exerciceCourant != null) ? <ManageSimulations currentFiscalYear={exerciceCourant} prices={tarifs} /> : <Loader />}
            </PrivateRoute>
            <PrivateRoute path="/pricingsimulation/create/" exact>
              <CreateSimulation tarifs={tarifs} currentFiscalYear={exerciceCourant} />
            </PrivateRoute>
            <PrivateRoute path="/pricingsimulation/edit/:id" exact>
              <EditSimulation tarifs={tarifs} currentFiscalYear={exerciceCourant} />
            </PrivateRoute>
            <PrivateRoute path="/tools/printalldeclarations" exact>
              {(tarifs != null && exerciceCourant != null && informations != null) ? <PrintAllTaxes tarifs={tarifs} currentFiscalYear={exerciceCourant} informations={informations} /> : <Loader />}
            </PrivateRoute>
            <PrivateRoute path="/tools/printallminutes" exact>
              {(tarifs != null && motifsMajoration != null && exerciceCourant != null && informations != null) ? <PrintAllMinutes tarifs={tarifs} motifsMajoration={motifsMajoration} currentFiscalYear={exerciceCourant} informations={informations} /> : <Loader />}
            </PrivateRoute>
            <PrivateRoute path="/tools/managefiscalyears">
              <ManageFiscalYears currentFiscalYear={exerciceCourant} handleEdit={editFiscalYear} />
            </PrivateRoute>
            <PrivateRoute path="/tools/manageprices">
              <ManagePrices
                currentFiscalYear={exerciceCourant}
                handleEdit={(price: IPrice) => setTarifs((prices: IPrice[]) => prices.map((p: IPrice) => p.id === price.id ? price : p))}
                handleCreate={(price: IPrice) => setTarifs((prices: IPrice[]) => ([...prices, price]))}
              />
            </PrivateRoute>
            <PrivateRoute path="/tools/managegeneralinformations">
              {informations !== null ? <ManageGeneralInformations generalInformations={informations} handleChange={(data: IInformation) => setInformations(data)} /> : <Loader />}
            </PrivateRoute>
            <PrivateRoute path="/tools/changefiscalyear">
              <ChangeFiscalYear currentFiscalYear={exerciceCourant} handleChange={(data: IExercice) => setExerciceCourant(data)} />
            </PrivateRoute>
            <Route path="/login">
              {user ? <Redirect to="/" /> : <Login handleLogin={toggleUser} />}
            </Route>
            <Route path="/register" component={Register} />
            <PrivateRoute path="/manageaccess/all" component={ManageUsers} />
            <PrivateRoute path="/manageaccess/edit/:id" exact component={EditUser} />
            <PrivateRoute path="/manageaccess/pendingaccounts" component={ManageInactiveAccounts} />
            <PrivateRoute path="/account/manageaccount">
              <ManageAccount />
            </PrivateRoute>
            <Route path="/passwordchange">
              {user?.changement_pass === 1 ? <PasswordChange /> : <Redirect to="/" />}
            </Route></>}
          <Footer />
        </UserContext.Provider>
      </Router>
    }
  </>
}
