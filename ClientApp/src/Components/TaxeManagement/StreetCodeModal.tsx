import {
    Modal,
    Button,
    Form,
    Table
} from 'react-bootstrap'
import { useForm } from 'react-hook-form'

interface StreetCodeModal {
    isOpen: boolean
    handleClose: () => void
}

export const StreetCodeModal = ({ isOpen, handleClose }: StreetCodeModal) => {
    const { register, handleSubmit, setError, clearErrors, formState: { errors, isSubmitting } } = useForm();

    const OnSearch = async (data: any) => {

    }

    return <Modal show={isOpen} onHide={handleClose} size="xl" >
        <Modal.Header closeButton>
            <Modal.Title>Recherche par numéro de rue</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={handleSubmit(OnSearch)}>
                <Form.Group controlId="code_rue">
                    <Form.Label>Code rue</Form.Label>
                    <Form.Control type="text" placeholder="Code rue" autoFocus />
                </Form.Group>
                <Button type="submit" variant="primary" className="mt-3">Chercher</Button>
            </Form>
            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>Code rue</th>
                        <th>Nom rue</th>
                        <th>Code postal</th>
                        <th>Localité</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                        <td><Button size="sm">Sélectionner</Button></td>
                    </tr>
                </tbody>
            </Table>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Fermer
            </Button>
        </Modal.Footer>
    </Modal>
}