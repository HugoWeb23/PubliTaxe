import {
    Modal,
    Button
} from 'react-bootstrap'

interface IConfirmModal {
    show: boolean,
    element?: any,
    size?: 'sm' | 'lg' | 'xl',
    titleText?: string,
    bodyText?: string,
    confirmButtonText?: string,
    confirmButtonVariant?: string,
    leaveButtonText?: string,
    leaveButtonVariant?: string,
    hiddenConfirmButton?: boolean,
    onClose: () => void,
    onConfirm: (element: any) => void
}

export const ConfirmModal = ({ show, element, size = undefined, titleText = "Confirmation", bodyText = "Voulez-vous vraiment supprimer cet élément ?", confirmButtonText = "Supprimer", confirmButtonVariant = "danger", leaveButtonText = "Annuler", leaveButtonVariant = "secondary", hiddenConfirmButton = false, onClose, onConfirm }: IConfirmModal) => {

    return <>
        <Modal show={show} onHide={onClose} size={size} animation={false}>
            <Modal.Header closeButton>
                <Modal.Title as="h5">{titleText}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{bodyText}</Modal.Body>
            <Modal.Footer>
                <Button variant={leaveButtonVariant} size="sm" onClick={onClose}>
                    {leaveButtonText}
                </Button>
                {hiddenConfirmButton === false && <Button variant={confirmButtonVariant} size="sm" onClick={() => onConfirm(element)}>
                    {confirmButtonText}
                </Button>}
            </Modal.Footer>
        </Modal>
    </>
}