import { useState, useEffect, memo } from "react"
import {
    Container,
    Table,
    OverlayTrigger,
    Tooltip,
    Button
} from "react-bootstrap"
import { Link, useHistory } from "react-router-dom"
import { ApiErrors, apiFetch } from "../../../Services/apiFetch"
import { IApercuSimulation } from "../../../Types/IApercuSimulation"
import { ISimulation } from "../../../Types/ISimulation"
import { useSimulations } from "../../Hooks/SimulationsHook"
import { ConfirmModal } from "../../UI/ConfirmModal"
import { Exit } from "../../UI/Exit"
import { Pencil } from "../../UI/Pencil"
import { PlusIcon } from "../../UI/PlusIcon"
import { Trash } from "../../UI/Trash"
import { v1 as uuidv1 } from 'uuid'
import { SumTax } from "../../../Services/SumTax"
import { IExercice } from "../../../Types/IExercice"
import { IPrice } from "../../../Types/IPrice"
import { Loader } from "react-bootstrap-typeahead"
import { toast } from "react-toastify"
import { ElementsPerPage } from "../../../Services/ElementsPerPage"
import { Paginate } from "../../../Services/Paginate"

interface IManageSimulations {
    currentFiscalYear: IExercice,
    prices: IPrice[]
}

export const ManageSimulations = ({ currentFiscalYear, prices }: IManageSimulations) => {

    const { simulations, totalPages, pageCourante, elementsParPage, totalSimulations, getAll, deleteOne } = useSimulations()
    const [filterOptions, setFilterOptions] = useState<any>({ pageCourante: 1, elementsParPage: 15 })
    const [loader, setLoader] = useState<boolean>(true)
    const [optionsLoader, setOptionsLoader] = useState<boolean>(false)
    const [errorModal, setErrorModal] = useState<{ show: boolean, message: string }>({ show: false, message: "" })
    const [deleteModal, setDeleteModal] = useState<{ show: boolean, simulation: IApercuSimulation }>({ show: false, simulation: {} as IApercuSimulation })

    useEffect(() => {
        (async () => {
            try {
                setOptionsLoader(true)
                await getAll(filterOptions)
                setOptionsLoader(false)
                setTimeout(() => setLoader(false), 300)
            } catch (e: any) {
                if (e instanceof ApiErrors) {
                    setErrorModal({ show: true, message: e.singleError.error })
                }
            }
        })()
    }, [filterOptions])

    const handleDelete = async (element: IApercuSimulation) => {
        try {
            await deleteOne(element)
            toast.success('La simulation a été supprimée')
            setDeleteModal(elem => ({ ...elem, show: false }))
        } catch (e: any) {
            if (e instanceof ApiErrors) {
                toast.error(e.singleError.error)
            }
        }
    }

    return <>
        <ConfirmModal
            show={deleteModal.show}
            element={deleteModal.simulation}
            onClose={() => setDeleteModal(d => ({ ...d, show: false }))}
            onConfirm={(element: IApercuSimulation) => handleDelete(element)}
            bodyText="Voulez-vous vraiment supprimer cette simulation ?"
        />
        <Container fluid={true}>
            <nav aria-label="breadcrumb" className="mt-3">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Accueil</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Gestion des simulations</li>
                </ol>
            </nav>
            <div className="d-flex justify-content-between align-items-center mt-2 mb-3">
                <h2 className="mb-0">Gestion des simulations</h2>
                <Link to="/pricingsimulation/create/" className="link"><PlusIcon /> Nouvelle simulation</Link>
            </div>
            <hr className="my-3" />
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom entreprise</th>
                        <th>Nombre de publicités</th>
                        <th>Date de création</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loader && <div>Chargement...</div>}
                    {(simulations.length === 0 && loader === false) && <tr><td colSpan={5}>Aucun résultat</td></tr>}
                    {(loader == false && simulations.length > 0) && simulations.map((simulation: IApercuSimulation) => <Simulation simulation={simulation} currentFiscalYear={currentFiscalYear} prices={prices} handleDelete={(simulation: IApercuSimulation) => setDeleteModal({ show: true, simulation: simulation })} />)}
                </tbody>
            </Table>
            {simulations.length > 0 && <div className="d-flex justify-content-end align-items-center">
            {optionsLoader && <div className="me-2"><Loader/></div>}
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

interface Simulation {
    simulation: IApercuSimulation,
    currentFiscalYear: IExercice,
    prices: IPrice[],
    handleDelete: (simulation: IApercuSimulation) => void
}

const Simulation = memo(({ simulation, currentFiscalYear, prices, handleDelete }: Simulation) => {

    const history = useHistory()
    const [loader, setLoader] = useState<boolean>(false)

    const handleCreateEntreprise = async () => {
        setLoader(true)
        let fetchSimulation: ISimulation = await apiFetch(`/simulations/id/${simulation.id_simulation}`)
        fetchSimulation.publicites = fetchSimulation.publicites.map(({ id, id_simulation, ...pub }: any) => pub).map((pub: any) => ({ ...pub, taxe_totale: SumTax(currentFiscalYear.id, pub.quantite, pub.surface, pub.face, pub.type_publicite, pub.exoneration, prices), exercice_courant: currentFiscalYear.id, uuid: uuidv1() }))
        history.push({ pathname: '/entreprise/create', state: { simulation: fetchSimulation } })
    }

    return <>
        <tr key={simulation.id_simulation}>
            <td>{simulation.id_simulation}</td>
            <td>{simulation.nom}</td>
            <td>{simulation.nombre_panneaux}</td>
            <td>{simulation.date_creation}</td>
            <td>
                <div className="d-flex">
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip id={`tooltip-1`}>
                                Créer une entreprise
                            </Tooltip>
                        }
                    >
                        <div className="me-1 btn btn-success btn-sm" onClick={handleCreateEntreprise}>{loader === false ? <Exit /> : <Loader />}</div>
                    </OverlayTrigger>
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip id={`tooltip-2`}>
                                Éditer
                            </Tooltip>
                        }
                    >
                        <Link className="me-1 btn btn-secondary btn-sm" to={`/pricingsimulation/edit/${simulation.id_simulation}`}><Pencil /></Link>
                    </OverlayTrigger>
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip id={`tooltip-3`}>
                                Supprimer
                            </Tooltip>
                        }
                    >
                        <Button size="sm" variant="danger" onClick={() => handleDelete(simulation)}><Trash /></Button>
                    </OverlayTrigger>
                </div>
            </td>
        </tr>
    </>
})