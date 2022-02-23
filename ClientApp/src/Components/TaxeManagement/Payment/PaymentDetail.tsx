import { useState, useEffect } from 'react'
import {
    Form,
    Button,
    Row,
    Col,
    Card,
    Container,
    Table,
    Modal,
    Alert,
    Accordion
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { apiFetch, ApiErrors } from '../../../Services/apiFetch'
import { IPayment } from '../../../Types/IPayment'
import { IPaymentDetails } from '../../../Types/IPaymentDetails'
import { IPublicite } from '../../../Types/IPublicite'
import { Loader } from '../../UI/Loader'

interface IPaymentDetail {
    match: any
}

export const PaymentDetail = ({ match }: IPaymentDetail) => {

    const matricule: number = match.params.id
    const [details, setDetails] = useState<IPaymentDetails>({} as IPaymentDetails)
    const [errorModal, setErrorModal] = useState<{ show: boolean, message: string }>({ show: false, message: "" })
    const [loader, setLoader] = useState<boolean>(true)

    useEffect(() => {
        (async () => {
            try {
                const paymentDetails: IPaymentDetails = await apiFetch(`/paiements/getpayments/${matricule}`)
                setDetails(paymentDetails)
                setLoader(false)
            } catch (e: any) {
                if (e instanceof ApiErrors) {
                    setErrorModal({ show: true, message: e.singleError.error })
                    setLoader(false)
                }
            }
        })()
    }, [])


    const LeftToPay = (): any => {
        return (details.taxe_totale - details.paiements.reduce((acc: number, curr: IPayment) => {
            return curr.montant + acc
        }, 0))
    }

    if (loader) {
        return <Loader />
    }

    return <>
        <Container fluid="xl">
            <nav aria-label="breadcrumb" className="mt-3">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Accueil</Link></li>
                    <li className="breadcrumb-item"><Link to="/payment_management">Gestion des paiements</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Détails #{matricule}</li>
                </ol>
            </nav>
            <h2 className="mt-2">Détails des paiements de {details.entreprise.nom}</h2>
            <hr className="my-3" />
            {details.paiements.reduce((acc: number, curr: IPayment) => {
                return curr.montant + acc
            }, 0) >= details.taxe_totale && <Alert variant="success">L'entreprise est en ordre de paiement</Alert>}
            <Card className="mb-3">
                <Card.Header as="h6">Informations sur l'entreprise</Card.Header>
                <Card.Body>
                    <Row>
                        <Col>
                            <div>Matricule : {details.entreprise.matricule_ciger}</div>
                            <div>Nom : {details.entreprise.nom}</div>
                            <div>Tél. : {details.entreprise.numero_telephone}</div>
                            <div>Personne de contact : {details.entreprise.personne_contact}</div>
                            <div>Adresse e-mail : {details.entreprise.mail_contact}</div>
                        </Col>
                        <Col>
                            <div>{details.entreprise.adresse_rue}, {details.entreprise.adresse_numero}</div>
                            <div>{details.entreprise.code_postal.cp}</div>
                            <div>{details.entreprise.code_postal.localite}</div>
                            <div>{details.entreprise.code_postal.pays.nom_pays}</div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            <Accordion defaultActiveKey="1" className="mb-3">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Liste des enseignes publicitaires</Accordion.Header>
                    <Accordion.Body>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
                        est laborum.
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            <Table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Montant payé</th>
                        <th>Mode de paiement</th>
                        <th>Remarque</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {details.paiements.length === 0 && <tr><td colSpan={5}>Aucun paiement enregistré</td></tr>}
                    {details.paiements.length > 0 && details.paiements.map((payment: IPayment) => <Payment payment={payment} />)}
                    <tr>
                        <td colSpan={5}>
                            <div className="d-flex justify-content-end">
                                <div>
                                    <div><span className="fw-bold">Total sans majoration</span> : {details.taxe} €</div>
                                    <div><span className="fw-bold">Montant majoration</span> : {details.montant_majoration} €</div>
                                    <div><span className="fw-bold">Total avec majoration</span> : {details.taxe_totale} €</div>
                                    <hr style={{ marginTop: "8px", marginBottom: "8px" }} />
                                    <div><span className="fw-bold">Déjà payé</span> : {details.paiements.reduce((acc: number, curr: IPayment) => {
                                        return curr.montant + acc
                                    }, 0)} €</div>
                                    <div><span className="fw-bold">Reste à payer</span> : {LeftToPay().toFixed(2)} €</div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </Table>
        </Container>
    </>
}

interface Payment {
    payment: IPayment
}

const Payment = ({ payment }: Payment) => {

    const Mode_paiement = (mode: number): string => {
        if (mode === 1) {
            return 'Virement bancaire'
        } else if (mode === 2) {
            return 'Carte bancaire'
        } else if (mode === 3) {
            return 'Espèces'
        } else {
            return 'Virement bancaire'
        }
    }

    return <>
        <tr key={payment.id_paiement}>
            <td>{payment.id_paiement}</td>
            <td>{payment.montant} €</td>
            <td>{Mode_paiement(payment.mode_paiement)}</td>
            <td>{payment.remarque}</td>
            <td>{payment.date}</td>
        </tr>
    </>
}