import { useEffect, useState, memo } from 'react'
import {
    Table,
    Container,
    Button,
    Alert,
    Form,
    Card,
    Badge
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { IApercu_entreprise } from '../../../Types/IApercu_entreprise'
import { IExercice } from '../../../Types/IExercice'
import { Loader } from '../../UI/Loader'
import { toast } from 'react-toastify';
import { ApiErrors } from '../../../Services/apiFetch'
import { usePayments } from '../../Hooks/PaymentHook'
import { IApercu_paiement } from '../../../Types/IApercu_paiement'
import { PlusIcon } from '../../UI/PlusIcon'

interface IManagePayment {
    currentFiscalYear: IExercice
}

interface IFilterOptions {
    exercice: number,
    type: string,
    elementsParPage: 15,
    pageCourante: 1
}

export const ManagePayment = ({ currentFiscalYear }: IManagePayment) => {
    const [loader, setLoader] = useState<boolean>(true)
    const [filterOptions, setFilterOptions] = useState<IFilterOptions>({ exercice: currentFiscalYear.id, type: "all", elementsParPage: 15, pageCourante: 1 })
    const [selectedEntreprise, setSelectedEntreprise] = useState<{ entrepriseInfos: IApercu_entreprise, show: boolean }>({ entrepriseInfos: {} as IApercu_entreprise, show: false })
    const [errorModal, setErrorModal] = useState<{ show: boolean, message: string }>({ show: false, message: "" })
    const { paiements, getAll } = usePayments()

    useEffect(() => {
        (async () => {
            await getAll(filterOptions)
            setLoader(false)
        })()
    }, [filterOptions])

    if (loader === true || currentFiscalYear === null) {
        return <Loader />
    }
    return <>
        <Container fluid={true}>
            <nav aria-label="breadcrumb" className="mt-3">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Accueil</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Gestion des paiements</li>
                </ol>
            </nav>
            <h2 className="mt-2 mb-3">Gestion des paiements (exercice {currentFiscalYear.annee_exercice})</h2>
            <hr className="my-3" />
            <div className="d-flex justify-content-between">
                <Card style={{ width: '100%' }} className="me-3">
                    <PlusIcon/>
                </Card>
                <Card style={{ width: '100%' }} className="me-3">
                    Test
                </Card>
                <Card style={{ width: '100%' }} className="me-3">
                    Test
                </Card>
            </div>
            <Form.Group controlId="status" className="mb-3">
                <Form.Label>Afficher</Form.Label>
                <Form.Select onChange={(e: any) => setFilterOptions((filters: IFilterOptions) => ({...filters, type: e.target.value}))}>
                    <option value="all">Tous</option>
                    <option value="unpaid">Paiements non reçus</option>
                    <option value="partially_paid">Paiements partiellement reçus</option>
                    <option value="payed">Paiements reçus</option>
                </Form.Select>
            </Form.Group>
            {errorModal.show && <Alert variant="danger">{errorModal.message}</Alert>}
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>Matricule</th>
                        <th>Nom entreprise</th>
                        <th>Panneaux</th>
                        <th>Statut du paiement</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {(loader == false && paiements.length == 0) && <tr><td colSpan={5}>Aucun résultat</td></tr>}
                    {(loader == false && paiements.length > 0) && paiements.map((paiement: IApercu_paiement) => {
                        return <Entreprise entreprise={paiement} />
                    })}
                </tbody>
            </Table>
        </Container>
    </>
}

interface IEntreprise {
    entreprise: IApercu_paiement
}

const Entreprise = ({ entreprise }: IEntreprise) => {
    return <tr>
        <td>{entreprise.matricule_ciger}</td>
        <td>{entreprise.nom}</td>
        <td>{entreprise.nombre_panneaux}</td>
        <td><PaymentStatus status={entreprise.statut_paiement}/></td>
        <td><Button size="sm" variant="success" className="d-flex align-items-center" disabled={entreprise.statut_paiement === 3}><PlusIcon/> Encoder un paiement</Button></td>
    </tr>
}

interface IPaymentStatus {
    status: number
}

const PaymentStatus = ({ status }: IPaymentStatus) => {
    if (status === 1) {
        return <Badge bg="danger">Impayé</Badge>
    } else if(status === 2) {
        return <Badge bg="warning">Partiellement payé</Badge>
    } else if(status === 3) {
        return <Badge bg="success">Payé</Badge>
    } else {
        return <Badge></Badge>
    }
}