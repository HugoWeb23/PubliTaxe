import { INotReceivedHistory } from '../../Types/INotReceivedHistory'
import {
    Modal,
    Table,
    Alert,
    Button,
    Card
} from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { ApiErrors, apiFetch } from '../../Services/apiFetch'
import { IMotif_majoration } from '../../Types/IMotif_majoration'
import { toast } from 'react-toastify'
import { IExercice } from '../../Types/IExercice'
import { RefreshIcon } from '../UI/RefreshIcon'
import { Loader } from '../UI/Loader'

interface IOffensesModal {
    id_entreprise: number,
    motifs: IMotif_majoration[],
    currentFiscalYear: IExercice,
    isOpen: boolean,
    deletable: boolean,
    handleClose: () => void,
    onDelete: () => void
}

export const OffensesModal = ({ id_entreprise, motifs, currentFiscalYear, isOpen, deletable, handleClose, onDelete }: IOffensesModal) => {

    const [history, setHistory] = useState<INotReceivedHistory[]>([])
    const [confirmDelete, setConfirmDelete] = useState<{ show: boolean, notReceived: INotReceivedHistory }>({ show: false, notReceived: {} as INotReceivedHistory })
    const [loader, setLoader] = useState<boolean>(true)

    const fetchData = async () => {
        setLoader(true)
        const history = await apiFetch(`/notreceived/gethistory/${id_entreprise}`)
        setHistory(history)
        setTimeout(() => setLoader(false), 300)
    }

    useEffect(() => {
        (async () => {
            await fetchData()
        })()
    }, [])

    const handleDelete = async (notReceived: INotReceivedHistory) => {
        try {
            const deleteNotReceived = await apiFetch(`/notreceived/delete/${notReceived.id}`, {
                method: 'DELETE'
            })
            onDelete()
            setHistory(history => history.filter((h: INotReceivedHistory) => h.id !== deleteNotReceived.id))
            setConfirmDelete({show: false, notReceived: {} as INotReceivedHistory})
            toast.success("L'infraction a été supprimée")
        } catch (e) {
            if (e instanceof ApiErrors) {
                toast.error(e.singleError.error)
            }
        }
    }


    return <Modal show={isOpen} onHide={handleClose} size="xl" animation={false}>
        <Modal.Header closeButton>
            <Modal.Title as="h5">Historique des infractions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="d-flex justify-content-end mb-3">
                <Button size="sm" variant="success" onClick={() => fetchData()}><RefreshIcon /> Actualiser</Button>
            </div>
            {loader === true && <Loader />}
            {(loader == false && history.length === 0) && <Alert variant="warning">Aucune infraction enregistrée</Alert>}
            {(loader == false && history.length !== 0) &&
                <>
                {confirmDelete.show && <Card border="danger" className="mb-3">
                    <Card.Header>Confirmation de suppression</Card.Header>
                    <Card.Body>
                        Voulez-vous vraiment supprimer l'infraction de l'exercice {confirmDelete.notReceived.exercice} ?
                        <div className="mt-3">
                            <Button size="sm" variant="success" onClick={() => handleDelete(confirmDelete.notReceived)}>Oui</Button> - <Button size="sm" variant="danger" onClick={() => setConfirmDelete({show: false, notReceived: {} as INotReceivedHistory})}>Non</Button>
                        </div>
                    </Card.Body>
                </Card>}
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>Exercice</th>
                                <th>Motif</th>
                                <th>% Major</th>
                                <th>Remarque</th>
                                <th>Date</th>
                                {deletable && <th>Action</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((histo: INotReceivedHistory) => {
                                return <tr key={histo.id}>
                                    <td>{histo.exercice}</td>
                                    <td>{motifs.find((motif: IMotif_majoration) => motif.id_motif == histo.motif_majorationId)?.libelle}</td>
                                    <td>{histo.pourcentage_majoration} %</td>
                                    <td>{histo.remarque}</td>
                                    <td>{histo.date}</td>
                                    {deletable && <td>{currentFiscalYear.annee_exercice - parseInt(histo.exercice) < 1 && <Button size="sm" variant="danger" onClick={() => setConfirmDelete({show: true, notReceived: histo})}>Supprimer</Button>}</td>}
                                </tr>
                            })}
                        </tbody>
                    </Table>
                </>
            }
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" size="sm" onClick={handleClose}>
                Fermer
            </Button>
        </Modal.Footer>
    </Modal>
}