import { useEffect, useState, memo } from 'react'
import {
    Table,
    Container,
    Button,
    Alert,
    Form,
    Card
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { IApercu_entreprise } from '../../../Types/IApercu_entreprise'
import { IExercice } from '../../../Types/IExercice'
import { Loader } from '../../UI/Loader'
import { toast } from 'react-toastify';
import { ApiErrors } from '../../../Services/apiFetch'

interface IManagePayment {
    currentFiscalYear: IExercice
}

export const ManagePayment = ({ currentFiscalYear }: IManagePayment) => {
    const [loader, setLoader] = useState<boolean>(false)
    const [selectedEntreprise, setSelectedEntreprise] = useState<{ entrepriseInfos: IApercu_entreprise, show: boolean }>({ entrepriseInfos: {} as IApercu_entreprise, show: false })
    const [errorModal, setErrorModal] = useState<{show: boolean, message: string}>({show: false, message: ""})

    useEffect(() => {
        (async () => {
           
        })()
    }, [])

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
            <hr className="my-3"/>
            <div className="d-flex justify-content-between">
            <Card style={{width: '100%'}} className="me-3">
                Test
            </Card>
            <Card style={{width: '100%'}} className="me-3">
                Test
            </Card>
            <Card style={{width: '100%'}} className="me-3">
                Test
            </Card>
            </div>
           <Form.Group controlId="status" className="mb-3">
               <Form.Label>Afficher</Form.Label>
               <Form.Select>
                   <option value="unpaid">Paiements non reçus</option>
                   <option value="partially_paid">Paiements partiellement reçus</option>
                   <option value="paid">Paiements reçus</option>
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
                   
                </tbody>
            </Table>
        </Container>
    </>
}