import { defaultMaxListeners } from 'events'
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
    Accordion,
    Badge,
    OverlayTrigger,
    Tooltip
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { apiFetch, ApiErrors } from '../../../Services/apiFetch'
import { PubInfos } from '../../../Services/PubInfos'
import { IPayment } from '../../../Types/IPayment'
import { IPaymentDetails } from '../../../Types/IPaymentDetails'
import { IPublicite } from '../../../Types/IPublicite'
import { ConfirmModal } from '../../UI/ConfirmModal'
import { Loader } from '../../UI/Loader'
import { Pencil } from '../../UI/Pencil'
import { PlusIcon } from '../../UI/PlusIcon'
import { Trash } from '../../UI/Trash'
import { EncodePaymentModal } from './EncodePaymentModal'

interface IPaymentDetail {
    match: any
}

export const PaymentDetail = ({ match }: IPaymentDetail) => {

    const id: number = match.params.id
    const [details, setDetails] = useState<IPaymentDetails>({} as IPaymentDetails)
    const [errorModal, setErrorModal] = useState<{ show: boolean, message: string }>({ show: false, message: "" })
    const [paymentModal, setPaymentModal] = useState<{ show: boolean, type: 'create' | 'edit', payment?: IPayment }>({ show: false, type: 'create' })
    const [loader, setLoader] = useState<boolean>(true)
    const [deleteModal, setDeleteModal] = useState<{ show: boolean, payment: IPayment }>({ show: false, payment: {} as IPayment })

    useEffect(() => {
        (async () => {
            try {
                const paymentDetails: IPaymentDetails = await apiFetch(`/paiements/getpayments/${id}`)
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

    const PaymentStatus = () => {
        const AlreadyPayed: number = details.paiements.reduce((acc: number, curr: IPayment) => {
            return curr.montant + acc
        }, 0)
        if (AlreadyPayed === 0) {
            return <Badge bg="danger">Impayé</Badge>
        } else if (AlreadyPayed < details.taxe_totale) {
            return <Badge bg="warning">Partiellement payé</Badge>
        } else {
            return <Badge bg="success">Payé</Badge>
        }
    }

    const SubmitPayment = async (data: IPayment, type: 'create' | 'edit') => {
        try {
            if (type === 'create') {
                data = { ...data, id_entreprise: details.entreprise.id_entreprise }
                const submitpayment: IPayment = await apiFetch(`/paiements/new`, {
                    method: 'POST',
                    body: JSON.stringify(data)
                })
                setDetails((details: IPaymentDetails) => ({ ...details, paiements: [...details.paiements, submitpayment] }))
                setPaymentModal({ show: false, type: 'create', payment: {} as IPayment })
                toast.success("Le paiement a été comptabilisé")
            } else {
                const editpayment: IPayment = await apiFetch(`/paiements/edit`, {
                    method: 'PUT',
                    body: JSON.stringify(data)
                })
                setDetails((details: IPaymentDetails) => ({ ...details, paiements: details.paiements.map((p: IPayment) => p.id_paiement === data.id_paiement ? editpayment : p) }))
                setPaymentModal({ show: false, type: 'create', payment: {} as IPayment })
                toast.success("Le paiement a été modifié")
            }
        } catch (e) {
            if (e instanceof ApiErrors) {
                toast.error(e.singleError.error)
            }
        }
    }

    const DeletePayment = async(payment: IPayment) => {
        try {
            await apiFetch(`/paiements/delete/${payment.id_paiement}`, {
                method: 'DELETE'
            })
            setDetails((details: IPaymentDetails) => ({...details, paiements: details.paiements.filter((p: IPayment) => p.id_paiement != payment.id_paiement)}))
            setDeleteModal(modal => ({...modal, show: false}))
            toast.success("Le paiement a été supprimé")
        } catch(e) {
            if(e instanceof ApiErrors) {
                toast.error(e.singleError.error)
            }
        }
    }

    if (loader) {
        return <Loader />
    }

    return <>
        <EncodePaymentModal
            show={paymentModal.show}
            type={paymentModal.type}
            total_tax={LeftToPay() ? LeftToPay().toFixed(2) : 0}
            payment={paymentModal.payment}
            onSubmit={(data, type) => SubmitPayment(data, type)}
            handleClose={() => setPaymentModal({ show: false, type: 'create', payment: {} as IPayment })}
        />
        <ConfirmModal
            show={deleteModal.show}
            element={deleteModal.payment}
            bodyText="Voulez-vous vraiment supprimer ce paiement ?"
            onClose={() => setDeleteModal(e => ({ ...e, show: false }))}
            onConfirm={DeletePayment}
        />
        <Container fluid="xl">
            <nav aria-label="breadcrumb" className="mt-3">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Accueil</Link></li>
                    <li className="breadcrumb-item"><Link to="/payment_management">Gestion des paiements</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Détails #{id}</li>
                </ol>
            </nav>
            <h2 className="mt-2">Détails des paiements de {details.entreprise.nom}</h2>
            <hr className="my-3" />
            <div className="d-flex justify-content-end">
                <h2>{PaymentStatus()}</h2>
            </div>
            <Card className="mb-3">
                <Card.Header as="h6">Informations sur l'entreprise</Card.Header>
                <Card.Body>
                    <Row>
                        <Col>
                            <div>ID : {details.entreprise.id_entreprise}</div>
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
                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Type publicité</th>
                                    <th>Quantité</th>
                                    <th>Face</th>
                                    <th>Mesure</th>
                                    <th>Surface</th>
                                    <th>Surface totale</th>
                                    <th>Éxo.</th>
                                    <th>Taxe totale</th>
                                </tr>
                            </thead>
                            <tbody>
                                {details.entreprise.publicites.map((pub: IPublicite) => {
                                    const { type_pub, type_face } = PubInfos(pub.type_publicite, pub.face)
                                    return <tr key={pub.numero_panneau}>
                                        <td>{pub.numero_panneau}</td>
                                        <td>{type_pub}</td>
                                        <td>{pub.quantite}</td>
                                        <td>{type_face}</td>
                                        <td>{pub.mesure}</td>
                                        <td>{pub.surface} dm²</td>
                                        <td>{pub.surface_totale} dm²</td>
                                        <td>{pub.exoneration ? "Oui" : "Non"}</td>
                                        <td>{pub.taxe_totale} €</td>
                                    </tr>
                                })}
                            </tbody>
                        </Table>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            <div className="d-flex justify-content-end mt-4 mb-4">
                <Button size="sm" variant="success" onClick={() => setPaymentModal({ show: true, type: 'create' })}><PlusIcon /> Nouveau paiement</Button>
            </div>
            <Table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Montant payé</th>
                        <th>Mode de paiement</th>
                        <th>Remarque</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {details.paiements.length === 0 && <tr><td colSpan={6} className="table-active">Aucun paiement enregistré</td></tr>}
                    {details.paiements.length > 0 && details.paiements.map((payment: IPayment) => <Payment
                        payment={payment}
                        handleEdit={(payment: IPayment) => setPaymentModal({ type: 'edit', show: true, payment: payment })}
                        handleDelete={(payment: IPayment) => setDeleteModal(modal => ({ ...modal, show: true, payment: payment }))}
                    />)}
                    <tr>
                        <td colSpan={6}>
                            <div className="d-flex justify-content-end">
                                <div>
                                    <div><span className="fw-bold">Total sans majoration</span> : {details.taxe.toFixed(2)} €</div>
                                    <div><span className="fw-bold">Montant majoration</span> : {details.montant_majoration.toFixed(2)} €</div>
                                    <div><span className="fw-bold">Total avec majoration</span> : {details.taxe_totale.toFixed(2)} €</div>
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
    handleEdit: (payment: IPayment) => void,
    handleDelete: (payment: IPayment) => void
}

const Payment = ({ payment, handleEdit, handleDelete }: Payment) => {

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
            <td>
                <div className="d-flex">
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip id={`tooltip-1`}>
                                Éditer
                            </Tooltip>
                        }
                    >
                        <Button size="sm" variant="secondary" className="me-1" onClick={() => handleEdit(payment)}><Pencil /></Button>
                    </OverlayTrigger>
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip id={`tooltip-2`}>
                                Supprimer
                            </Tooltip>
                        }
                    >
                        <Button size="sm" variant="danger" onClick={() => handleDelete(payment)}><Trash /></Button>
                    </OverlayTrigger>
                </div>
            </td>
        </tr>
    </>
}