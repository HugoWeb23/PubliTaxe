import {
    Modal,
    Button
} from 'react-bootstrap'
import { ISimulation } from '../../../Types/ISimulation'

interface IConfirmModal {
    show: boolean,
    data: ISimulation,
    type: "create" | "edit",
    onClose: () => void,
    onConfirm: (simulation: ISimulation) => void
}

export const ConfirmModal = ({ show, data, type, onClose, onConfirm }: IConfirmModal) => {

    const handleConfirm = () => {
        onConfirm(data)
    }

    return <>
        <Modal show={show} onHide={onClose} animation={false}>
            <Modal.Header closeButton>
                <Modal.Title as="h5">Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                La simuation a bien été {type == 'create' ? 'créée' : 'modifiée'}.
                <div className="mt-3"><Button size="sm" variant="success" onClick={handleConfirm}>Générer le reçu</Button></div>
                </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" size="sm" onClick={onClose}>
                    Fermer
                </Button>
            </Modal.Footer>
        </Modal>
    </>
}