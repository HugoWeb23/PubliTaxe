import { useState, useEffect, memo } from "react"
import {
    Container,
    Table,
    OverlayTrigger,
    Tooltip,
    Button
} from "react-bootstrap"
import { Link } from "react-router-dom"
import { ApiErrors } from "../../../Services/apiFetch"
import { IApercuSimulation } from "../../../Types/IApercuSimulation"
import { useSimulations } from "../../Hooks/SimulationsHook"
import { ConfirmModal } from "../../UI/ConfirmModal"
import { Pencil } from "../../UI/Pencil"
import { PlusIcon } from "../../UI/PlusIcon"
import { Trash } from "../../UI/Trash"

export const ManageSimulations = () => {

    const { simulations, totalPages, pageCourante, totalSimulations, getAll } = useSimulations()
    const [filterOptions, setFilterOptions] = useState<any>({ matricule: "", nom: "", pubExoneration: false, pageCourante: 1, elementsParPage: 15 })
    const [loader, setLoader] = useState<boolean>(true)
    const [errorModal, setErrorModal] = useState<{ show: boolean, message: string }>({ show: false, message: "" })
    const [deleteModal, setDeleteModal] = useState<{ show: boolean, simulation: IApercuSimulation }>({ show: false, simulation: {} as IApercuSimulation })

    useEffect(() => {
        (async () => {
            try {
                await getAll(filterOptions)
                setTimeout(() => setLoader(false), 300)
            } catch (e: any) {
                if (e instanceof ApiErrors) {
                    setErrorModal({ show: true, message: e.singleError.error })
                }
            }
        })()
    }, [filterOptions])

    const handleDelete = (element: IApercuSimulation) => {
        alert('lol')
    }

    return <>
        <ConfirmModal
            show={deleteModal.show}
            element={deleteModal.simulation}
            onClose={() => setDeleteModal(d => ({ ...d, show: false }))}
            onConfirm={(element: IApercuSimulation) => handleDelete(element)}
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
                    {(loader == false && simulations.length > 0) && simulations.map((simulation: IApercuSimulation) => <Simulation simulation={simulation} handleDelete={(simulation: IApercuSimulation) => setDeleteModal({ show: true, simulation: simulation })} />)}
                </tbody>
            </Table>
        </Container>
    </>
}

interface ISimulation {
    simulation: IApercuSimulation,
    handleDelete: (simulation: IApercuSimulation) => void
}

const Simulation = memo(({ simulation, handleDelete }: ISimulation) => {
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
                                Éditer
                            </Tooltip>
                        }
                    >
                        <Link className="me-1 btn btn-secondary btn-sm" to={`/pricingsimulation/edit/${simulation.id_simulation}`}><Pencil /></Link>
                    </OverlayTrigger>
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip id={`tooltip-2`}>
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