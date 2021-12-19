import { useEffect, useState, memo } from 'react'
import {
    Card,
    Row,
    Col,
    Table,
    DropdownButton,
    Dropdown,
    Container,
    Button,
    OverlayTrigger,
    Tooltip
} from 'react-bootstrap'
import { apiFetch } from '../../Services/apiFetch'
import { Loader } from '../UI/Loader'
import { Link } from 'react-router-dom'
import { IApercu_entreprise } from '../../Types/IApercu_entreprise'
import { Pencil } from '../UI/Pencil'
import { Eye } from '../UI/Eye'
import { Trash } from '../UI/Trash'
import { useEntreprises } from '../Hooks/TaxManagementHook'
import { boolean } from 'yup/lib/locale'
import { ConfirmModal } from '../UI/ConfirmModal'
import { toast } from 'react-toastify';
import { SheetIcon } from '../UI/SheetIcon'
import { ReceivedModal } from './ReceivedModal'
import { SearchIcon } from '../UI/SearchIcon'
import { ExclamationIcon } from '../UI/ExclamationIcon'
import { SearchModal } from './SearchModal'

export const TaxManagement = () => {

    const [loader, setLoader] = useState<boolean>(true)
    const { entreprises, getAll, deleteOne, setReceived } = useEntreprises()
    const [deleteModal, setDeleteModal] = useState<{ show: boolean, entreprise: IApercu_entreprise }>({ show: false, entreprise: {} as IApercu_entreprise })
    const [receivedModal, setReceivedModal] = useState<boolean>(false)
    const [searchModal, setSearchModal] = useState<boolean>(false)
    const [filterOptions, setFilterOptions] = useState<any>({matricules: [], noms: [], pubExoneration: false})

    useEffect(() => {
        (async () => {
            try {
                await getAll(filterOptions)
            } catch (e) {
                alert('error')
            }
            setTimeout(() => setLoader(false), 300)
        })()
    }, [filterOptions])

    const handleDelete = async (entreprise: IApercu_entreprise) => {
        try {
            await deleteOne(entreprise)
            setDeleteModal(d => ({ ...d, show: false }))
            toast.success("L'entreprise a été supprimée")
        } catch (e: any) {
            toast.error(e.error)
        }
    }

    return <>
        <ConfirmModal
            show={deleteModal.show}
            element={deleteModal.entreprise}
            onClose={() => setDeleteModal(d => ({ ...d, show: false }))}
            onConfirm={(element: IApercu_entreprise) => handleDelete(element)}
        />
        <ReceivedModal
            show={receivedModal}
            handleClose={() => setReceivedModal(false)}
            onSubmit={setReceived}
        />
        <SearchModal
            show={searchModal}
            handleClose={() => setSearchModal(false)}
            handleSearch={(options) => setFilterOptions(options)}
        />
        <Container fluid={true}>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="mt-2 mb-3">Gestion des entreprises</h2>
                <div>
                    <Button variant="success" className="me-2" size="sm" onClick={() => setReceivedModal(true)}><SheetIcon /> Encodage des reçus</Button>
                    <Link to="/notreceived" className="me-2 btn btn-danger btn-sm"><ExclamationIcon /> Encodage des non reçus</Link>
                    <Button variant="secondary" size="sm" onClick={() => setSearchModal(true)}><SearchIcon /> Recherche</Button>
                </div>
            </div>

            <Row className="me-0 mt-0 mt-3">
                <Col md="3" xs="12">
                    <Card>
                        <Card.Body>
                            <div className="d-grid gap-2">
                                <Link className="btn btn-primary btn-sm" to={'/entreprise/create'}>Nouvel enregistrement</Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md="9" xs="1" style={{ paddingRight: 0 }}>
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>Matricule</th>
                                <th>Nom entreprise</th>
                                <th>Panneaux</th>
                                <th>Déclaration reçue</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loader && <div>Chargement...</div>}
                            {(loader == false && entreprises.length > 0) && entreprises.map((entreprise: IApercu_entreprise, index: number) => <Tax apercu_entreprise={entreprise} index={index} handleDelete={(entreprise: IApercu_entreprise) => setDeleteModal({ show: true, entreprise: entreprise })} />)}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    </>
}

interface ITax {
    apercu_entreprise: IApercu_entreprise,
    index: number,
    handleDelete: (entreprise: IApercu_entreprise) => void
}


const Tax = memo(({ apercu_entreprise, index, handleDelete }: ITax) => {
    return <>
        <tr key={index}>
            <td>{apercu_entreprise.matricule_ciger}</td>
            <td>{apercu_entreprise.nom}</td>
            <td>{apercu_entreprise.nombre_panneaux}</td>
            <td className={apercu_entreprise.recu ? "table-success" : "table-danger"}>{apercu_entreprise.recu ? "Oui" : "Non"}</td>
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
                        <Link className="me-1 btn btn-secondary btn-sm" to={`/entreprise/edit/${apercu_entreprise.matricule_ciger}`}><Pencil /></Link>
                    </OverlayTrigger>
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip id={`tooltip-2`}>
                                Visionner
                            </Tooltip>
                        }
                    >
                        <Link className="me-1 btn btn-info btn-sm" to={`/entreprise/view/${apercu_entreprise.matricule_ciger}`}><Eye /></Link>
                    </OverlayTrigger>
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip id={`tooltip-2`}>
                                Supprimer
                            </Tooltip>
                        }
                    >
                        <Button size="sm" variant="danger" onClick={() => handleDelete(apercu_entreprise)}><Trash /></Button>
                    </OverlayTrigger>
                </div>
            </td>
        </tr>
    </>
})