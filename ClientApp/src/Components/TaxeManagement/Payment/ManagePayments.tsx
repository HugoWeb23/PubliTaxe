import { useEffect, useState, useRef } from 'react'
import {
    Table,
    Container,
    Alert,
    Form,
    Card,
    Badge,
    Col,
    Row
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { IExercice } from '../../../Types/IExercice'
import { usePayments } from '../../Hooks/PaymentHook'
import { IApercu_paiement } from '../../../Types/IApercu_paiement'
import { SearchIcon } from '../../UI/SearchIcon'
import { Cross } from '../../UI/Cross'
import { ExclamationIcon } from '../../UI/ExclamationIcon'
import { CheckIcon } from '../../UI/CheckIcon'
import { Paginate } from '../../../Services/Paginate'
import { ElementsPerPage } from '../../../Services/ElementsPerPage'
import { ApiErrors } from '../../../Services/apiFetch'
import { Loader as SmallLoader } from 'react-bootstrap-typeahead'
import { CustomLoader } from '../../UI/CustomLoader'

interface IManagePayment {
    currentFiscalYear: IExercice
}

interface IFilterOptions {
    exercice: number,
    type: string,
    matricule: string,
    elementsParPage: number,
    pageCourante: number
}

export const ManagePayment = ({ currentFiscalYear }: IManagePayment) => {
    const [loader, setLoader] = useState<boolean>(true)
    const [optionsLoader, setOptionsLoader] = useState<boolean>(false)
    const [oldType, setOldType] = useState<string>("")
    const [filterOptions, setFilterOptions] = useState<IFilterOptions>({ exercice: currentFiscalYear.id, type: "all", matricule: "", elementsParPage: 15, pageCourante: 1 })
    const [errorModal, setErrorModal] = useState<{ show: boolean, message: string }>({ show: false, message: "" })
    const { paiements, total_non_payes, total_partiellement_payes, total_payes, total_a_valider, getAll, totalPages, pageCourante, elementsParPage } = usePayments()
    const MatriculeRef: any = useRef(null)

    useEffect(() => {
        (async () => {
            try {
                setOptionsLoader(true)
                await getAll(filterOptions)
                setOptionsLoader(false)
            } catch (e: any) {
                if (e instanceof ApiErrors) {
                    setErrorModal({ show: true, message: e.singleError.error })
                }
            }
            setTimeout(() => setLoader(false), 300)
        })()
    }, [filterOptions])

    const ResetMatricule = () => {
        MatriculeRef.current.value = ''
        setFilterOptions((filters: IFilterOptions) => ({ ...filters, matricule: "", type: oldType }))
    }

    const SearchById = (e: any) => {
        if (e.key === "Enter" && e.target.value.length >= 2) {
            setOldType(filterOptions.type)
            setFilterOptions((filters: IFilterOptions) => ({ ...filters, type: "all", matricule: e.target.value }))
        }
        if (e.key === "Enter" && e.target.value === "") {
            ResetMatricule()
        }
    }

    if (loader === true || currentFiscalYear === null) {
        return <CustomLoader />
    }
    return <>
        <Container fluid={true}>
            <nav aria-label="breadcrumb" className="mt-3">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Accueil</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Gestion des paiements</li>
                </ol>
            </nav>
            <h2 className="mt-2 mb-3">Gestion des paiements <span className="fw-bold">(exercice {currentFiscalYear.annee_exercice})</span></h2>
            <hr className="my-3" />
            <div className="show_payments_status">
                <Card className="payment_status_card">
                    <div className="payment_status red">
                        <div className="payment_icon"><Cross width="35" height="35" fill="#dc3545" /></div>
                        <div className="payment_status_text">
                            <p className="mb-1">Non payés</p>
                            <h2 className="mb-0">{total_non_payes}</h2>
                        </div>
                    </div>
                </Card>
                <Card className="payment_status_card">
                    <div className="payment_status yellow">
                        <div className="payment_icon"><ExclamationIcon width="35" height="35" fill="#ffc107" /></div>
                        <div className="payment_status_text">
                            <p className="mb-1">Partiellement payés</p>
                            <h2 className="mb-0">{total_partiellement_payes}</h2>
                        </div>
                    </div>
                </Card>
                <Card className="payment_status_card">
                    <div className="payment_status green">
                        <div className="payment_icon"><CheckIcon width="35" height="35" fill="#198754" /></div>
                        <div className="payment_status_text">
                            <p className="mb-1">Payés</p>
                            <h2 className="mb-0">{total_payes}</h2>
                        </div>
                    </div>
                </Card>
            </div>
            {errorModal.show && <Alert variant="danger">{errorModal.message}</Alert>}
            <div className="mt-3 mb-3">
                <Link className="btn btn-primary" to={"/payment_management/nothingtopay"}>
                    Entreprises n'ayant rien à payer <Badge bg="danger">{total_a_valider}</Badge>
                    <span className="visually-hidden">Situations à valider</span>
                </Link>
            </div>
            <Row className="me-0 mt-0 mt-3">
                <Col lg="3" xl="2">
                    <Card>
                        <Card.Body>
                            <Form.Group controlId="status" className="mb-3 me-3">
                                <Form.Label>Afficher</Form.Label>
                                <Form.Select size="sm" defaultValue={"all"} value={filterOptions.type} onChange={(e: any) => setFilterOptions((filters: IFilterOptions) => ({ ...filters, type: e.target.value }))}>
                                    <option value="all">Tout</option>
                                    <option value="unpaid">Paiements non reçus</option>
                                    <option value="partially_paid">Paiements partiellement reçus</option>
                                    <option value="payed">Paiements reçus</option>
                                </Form.Select>
                            </Form.Group>
                            <hr className="mb-2" />
                            <Form.Group controlId="matricule" className="mb-3 me-3">
                                <Form.Label>Recherche par matricule</Form.Label>
                                <Form.Control type="text" size="sm" ref={MatriculeRef} placeholder="Recherche par matricule" onKeyDown={(e) => SearchById(e)} />
                                <Form.Text className="text-muted">
                                    Appuyez sur ENTER pour chercher.
                                </Form.Text>
                                {filterOptions.matricule.length > 0 && <div className="link" onClick={ResetMatricule}>(réinitialiser)</div>}
                            </Form.Group>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg="9" xl="10" style={{ paddingRight: 0 }}>
                    <Table striped bordered size="sm">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Matricule</th>
                                <th>Nom entreprise</th>
                                <th>Publicités</th>
                                <th>Statut du paiement</th>
                                <th>Taxe totale</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(loader == false && paiements.length == 0) && <tr><td colSpan={7}>Aucun résultat</td></tr>}
                            {(loader == false && paiements.length > 0) && paiements.map((paiement: IApercu_paiement) => {
                                return <Entreprise entreprise={paiement} />
                            })}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            {paiements.length > 0 && <div className="d-flex justify-content-end align-items-center mb-3">
                {optionsLoader && <div className="me-2"><SmallLoader /></div>}
                <div className="me-2">
                    <ElementsPerPage
                        elementsPerPage={elementsParPage}
                        onChange={(elements) => setFilterOptions((filters: any) => ({ ...filters, elementsParPage: elements }))}
                    />
                </div>
                <Paginate
                    totalPages={totalPages}
                    pageCourante={pageCourante}
                    pageChange={(page) => setFilterOptions((filters: any) => ({ ...filters, pageCourante: page }))}
                />
            </div>}
        </Container>
    </>
}

interface IEntreprise {
    entreprise: IApercu_paiement
}

const Entreprise = ({ entreprise }: IEntreprise) => {
    return <tr>
        <td>{entreprise.id_entreprise}</td>
        <td>{entreprise.matricule_ciger}</td>
        <td>{entreprise.nom}</td>
        <td>{entreprise.nombre_panneaux}</td>
        <td><PaymentStatus status={entreprise.statut_paiement} /></td>
        <td>{entreprise.taxe_totale.toFixed(2)} €</td>
        <td><Link to={`payment_management/details/${entreprise.id_entreprise}`} className="btn btn-success btn-sm"><SearchIcon /> Consulter</Link></td>
    </tr>
}

interface IPaymentStatus {
    status: number
}

const PaymentStatus = ({ status }: IPaymentStatus) => {
    if (status === 0) {
        return <Badge bg="danger">Impayé</Badge>
    } else if (status === 1) {
        return <Badge bg="warning">Partiellement payé</Badge>
    } else if (status === 2) {
        return <Badge bg="success">Payé</Badge>
    } else {
        return <Badge></Badge>
    }
}