import {
    Modal,
    Button
} from 'react-bootstrap'

interface IConfirmModal {
    show: boolean,
    type: "create" | "edit",
    onClose: () => void,
}

export const ConfirmModal = ({ show, type, onClose }: IConfirmModal) => {

    return <>
        <Modal show={show} onHide={onClose} animation={false}>
            <Modal.Header closeButton>
                <Modal.Title>Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                La simuation a bien été {type == 'create' ? 'créée' : 'modifiée'}.
                <div className="mt-3"><Button variant="success">Générer le reçu</Button></div>
                </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Fermer
                </Button>
            </Modal.Footer>
        </Modal>
    </>
}