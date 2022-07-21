import { useEffect, useState, memo, useContext } from 'react'
import {
    Card,
    Row,
    Col,
    Table,
    Container,
    Button,
    OverlayTrigger,
    Tooltip,
    Alert,
    Form
} from 'react-bootstrap'
import { ApiErrors } from '../../Services/apiFetch'
import { Link } from 'react-router-dom'
import { IApercu_entreprise } from '../../Types/IApercu_entreprise'
import { Pencil } from '../UI/Pencil'
import { Eye } from '../UI/Eye'
import { Trash } from '../UI/Trash'
import { useEntreprises } from '../Hooks/TaxManagementHook'
import { ConfirmModal } from '../UI/ConfirmModal'
import { toast } from 'react-toastify';
import { SheetIcon } from '../UI/SheetIcon'
import { ReceivedModal } from './ReceivedModal'
import { SearchIcon } from '../UI/SearchIcon'
import { ExclamationIcon } from '../UI/ExclamationIcon'
import { SearchModal } from './SearchModal'
import { UserContext } from '../Contexts/UserContext'
import { Paginate } from '../../Services/Paginate'
import { ElementsPerPage } from '../../Services/ElementsPerPage'
import { Loader } from 'react-bootstrap-typeahead'
import { ExclamationTriangle } from '../UI/ExclamationTriangle'

export const TaxManagement = () => {

    const showDelete = (localStorage.getItem('showDelete') === 'true')
    const showDisable = (localStorage.getItem('showDisable') === 'true')
    const [loader, setLoader] = useState<boolean>(true)
    const [optionsLoader, setOptionsLoader] = useState<boolean>(false)
    const { entreprises, totalPages, pageCourante, totalRecus, totalPaiementsRecus, totalInfractions, totalEntreprises, totalDesactives, getAll, deleteOne, setReceived } = useEntreprises()
    const [deleteModal, setDeleteModal] = useState<{ show: boolean, entreprise: IApercu_entreprise }>({ show: false, entreprise: {} as IApercu_entreprise })
    const [receivedModal, setReceivedModal] = useState<boolean>(false)
    const [searchModal, setSearchModal] = useState<boolean>(false)
    const [errorModal, setErrorModal] = useState<{ show: boolean, message: string }>({ show: false, message: "" })
    const [filterOptions, setFilterOptions] = useState<any>({ matricule: "", nom: "", pubExoneration: false, showDelete: showDelete, showDisable: showDisable, pageCourante: 1, elementsParPage: 15 })
    const value = useContext(UserContext)

    useEffect(() => {
        (async () => {
            try {
                setOptionsLoader(true)
                await getAll(filterOptions)
                setTimeout(() => setLoader(false), 300)
                setOptionsLoader(false)
            } catch (e: any) {
                if (e instanceof ApiErrors) {
                    setErrorModal({ show: true, message: e.singleError.error })
                }
            }
        })()
    }, [filterOptions])

    const handleDelete = async (entreprise: IApercu_entreprise) => {
        try {
            await deleteOne(filterOptions.showDelete, entreprise)
            setDeleteModal(d => ({ ...d, show: false }))
            toast.success("La suppression a été programmée")
        } catch (e: any) {
            if (e instanceof ApiErrors) {
                toast.error(e.singleError.error)
            }
        }
    }

    const ChangeShowDelete = (e: any) => {
        localStorage.setItem('showDelete', e.target.checked);
        setFilterOptions((options: any) => ({ ...options, showDelete: e.target.checked }))
    }

    const ChangeShowDisable = (e: any) => {
        localStorage.setItem('showDisable', e.target.checked);
        setFilterOptions((options: any) => ({ ...options, showDisable: e.target.checked }))
    }

    return <>
        <ConfirmModal
            show={deleteModal.show}
            element={deleteModal.entreprise}
            onClose={() => setDeleteModal(d => ({ ...d, show: false }))}
            onConfirm={(element: IApercu_entreprise) => handleDelete(element)}
            bodyText="Voulez-vous vraiment effectuer une demande de suppression pour cette entreprise ?"
            confirmButtonText="Oui"
            leaveButtonText="Non"
        />
        <ReceivedModal
            show={receivedModal}
            handleClose={() => setReceivedModal(false)}
            onSubmit={setReceived}
        />
        <SearchModal
            options={filterOptions}
            show={searchModal}
            handleClose={() => setSearchModal(false)}
            handleSearch={(options) => setFilterOptions((filters: any) => ({ ...options, pageCourante: 1, elementsParPage: filters.elementsParPage, showDisable: showDisable, showDelete: showDelete }))}
        />
        <Container fluid={true}>
            <nav aria-label="breadcrumb" className="mt-3">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item active" aria-current="page">Accueil</li>
                </ol>
            </nav>
            <div className="d-flex justify-content-between align-items-center">
                <h2>Gestion des entreprises</h2>
                <div>
                    {value.user && value.user.role > 1 && <><Button variant="success" className="me-2" size="sm" onClick={() => setReceivedModal(true)}><SheetIcon /> Encodage des reçus</Button>
                        <Link to="/notreceived" className="me-2 btn btn-danger btn-sm"><ExclamationIcon /> Encodage des non reçus</Link></>}
                    <Button variant="secondary" size="sm" onClick={() => setSearchModal(true)}><SearchIcon /> Recherche</Button>
                </div>
            </div>
            <hr className="mt-3 mb-4" />
            <Row className="me-0 mt-0 mt-3">
                <Col md="3" xs="12">
                    <Card>
                        <Card.Body>
                            {value.user && value.user.role > 1 && <div className="d-grid gap-2 mb-3">
                                <Link className="btn btn-primary btn-sm" to={'/entreprise/create'}>Nouvel enregistrement</Link>
                            </div>}
                            {entreprises.length > 0 && <div>
                                <div className="fs-5 mb-2">Statistiques</div>
                                <div><span className="fw-bold">{totalEntreprises}</span> entreprises enregistrées {totalDesactives > 0 && `(dont ${totalDesactives} désactivée${totalDesactives > 1 ? "s" : ""})`}</div>
                                <div><span className="fw-bold">{totalRecus}</span> entreprises en ordre de déclaration ({Math.round((totalRecus * 100) / (totalEntreprises - totalDesactives))} %)</div>
                                <div><span className="fw-bold">{totalPaiementsRecus}</span> entreprises en ordre de paiement ({Math.round((totalPaiementsRecus * 100) / (totalEntreprises - totalDesactives))} %)</div>
                                <div><span className="fw-bold">{totalInfractions}</span> entreprises en infraction ({Math.round((totalInfractions * 100) / (totalEntreprises - totalDesactives))} %)</div>
                            </div>}
                            {(filterOptions.matricule !== "" || filterOptions.nom !== "" || filterOptions.pubExoneration !== false || (filterOptions.rue !== null && filterOptions.rue !== undefined)) && <div className="mt-3">
                                <Button size="sm" variant="danger" onClick={() => setFilterOptions((options: any) => ({ ...options, matricule: "", nom: "", pubExoneration: false, rue: null }))}>Supprimer les filtres</Button>
                            </div>}
                            <Form.Group controlId="show_delete" className="mt-3">
                                <Form.Check type="checkbox" label="Afficher les entreprises en attente de suppression" onChange={ChangeShowDelete} defaultChecked={filterOptions.showDelete} />
                            </Form.Group>
                            <Form.Group controlId="show_disable" className="mt-2">
                                <Form.Check type="checkbox" label="Afficher les entreprises désactivées" onChange={ChangeShowDisable} defaultChecked={filterOptions.showDisable} />
                            </Form.Group>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md="9" xs="1" style={{ paddingRight: 0 }}>
                    {errorModal.show && <Alert variant="danger">{errorModal.message}</Alert>}
                    <Table bordered size="sm">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Matricule</th>
                                <th>Nom entreprise</th>
                                <th>Panneaux</th>
                                <th>Statut déclaration</th>
                                <th>Statut paiement</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loader && <div>Chargement...</div>}
                            {(loader == false && entreprises.length > 0) && entreprises.map((entreprise: IApercu_entreprise) => <Tax apercu_entreprise={entreprise} handleDelete={(entreprise: IApercu_entreprise) => setDeleteModal({ show: true, entreprise: entreprise })} />)}
                        </tbody>
                    </Table>
                    {(loader == false && entreprises.length > 0) && <>
                        <div className="d-flex justify-content-end align-items-center">
                            {optionsLoader && <div className="me-2"><Loader /></div>}
                            <div className="me-2">
                                <ElementsPerPage
                                    elementsPerPage={filterOptions.elementsParPage}
                                    onChange={(elements) => setFilterOptions((filters: any) => ({ ...filters, elementsParPage: elements }))}
                                />
                            </div>
                            <Paginate
                                totalPages={totalPages}
                                pageCourante={pageCourante}
                                pageChange={(page) => setFilterOptions((filters: any) => ({ ...filters, pageCourante: page }))}
                            />
                        </div>
                    </>}
                </Col>
            </Row>
        </Container>
    </>
}

interface ITax {
    apercu_entreprise: IApercu_entreprise,
    handleDelete: (entreprise: IApercu_entreprise) => void
}

interface IPaymentStatus {
    status: number
}

const PaymentStatus = ({ status }: IPaymentStatus) => {
    if (status === 0) {
        return <td className="table-danger">Impayé</td>
    } else if (status === 1) {
        return <td className="table-warning">Partiellement payé</td>
    } else if (status === 2) {
        return <td className="table-success">Payé</td>
    } else if (status === 3) {
        return <td className="table-primary">Rien à payer</td>
    } else {
        return <td className="table-secondary"></td>
    }
}


const Tax = memo(({ apercu_entreprise, handleDelete }: ITax) => {
    const value = useContext(UserContext)
    return <>
        <tr key={apercu_entreprise.matricule_ciger} className={apercu_entreprise.desactive ? "table-secondary" : ""}>
            <td>{apercu_entreprise.id_entreprise}
                {apercu_entreprise.suppression &&
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip id={`tooltip-2`}>
                                Suppression programmée
                            </Tooltip>
                        }
                    >
                        <span style={{ float: 'right' }}><ExclamationTriangle /></span>
                    </OverlayTrigger>
                }
            </td>
            <td>{apercu_entreprise.matricule_ciger}</td>
            <td>{apercu_entreprise.nom}</td>
            <td>{apercu_entreprise.nombre_panneaux}</td>
            <td className={apercu_entreprise.proces_verbal ? "table-dark" : apercu_entreprise.recu ? "table-success" : "table-danger"}>{apercu_entreprise.proces_verbal ? "Procès-verbal" : apercu_entreprise.recu ? "Reçue" : "Non reçue"}</td>
            <PaymentStatus status={apercu_entreprise.statut_paiement} />
            <td>
                <div className="d-flex">
                    {value.user && value.user.role > 1 && <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip id={`tooltip-1`}>
                                Éditer
                            </Tooltip>
                        }
                    >
                        <Link className="me-1 btn btn-secondary btn-sm" to={`/entreprise/edit/${apercu_entreprise.id_entreprise}`}><Pencil /></Link>
                    </OverlayTrigger>}
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip id={`tooltip-2`}>
                                Visionner
                            </Tooltip>
                        }
                    >
                        <Link className="me-1 btn btn-info btn-sm" to={`/entreprise/view/${apercu_entreprise.id_entreprise}`}><Eye /></Link>
                    </OverlayTrigger>
                    {value.user && value.user.role > 1 && <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip id={`tooltip-2`}>
                                Supprimer
                            </Tooltip>
                        }
                    >
                        <Button size="sm" variant="danger" disabled={apercu_entreprise.suppression} onClick={() => handleDelete(apercu_entreprise)}><Trash /></Button>
                    </OverlayTrigger>}
                </div>
            </td>
        </tr>
    </>
})