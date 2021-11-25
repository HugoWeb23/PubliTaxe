import {
    Modal,
    Button
} from 'react-bootstrap'

interface IConfirmModal {
    show: boolean,
    element: any,
    titleText?: string,
    bodyText?: string,
    confirmButtonText?: string,
    confirmButtonVariant?: string,
    leaveButtonText?: string,
    onClose: () => void,
    onConfirm: (element: any) => void
}

export const ConfirmModal = ({ show, element, titleText = "Confirmation", bodyText = "Voulez-vous vraiment supprimer cet élément ?", confirmButtonText = "Supprimer", confirmButtonVariant = "danger", leaveButtonText = "Annuler", onClose, onConfirm }: IConfirmModal) => {

    return <>
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{titleText}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{bodyText}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    {leaveButtonText}
                </Button>
                <Button variant={confirmButtonVariant} onClick={() => onConfirm(element)}>
                    {confirmButtonText}
                </Button>
            </Modal.Footer>
        </Modal>
    </>
}