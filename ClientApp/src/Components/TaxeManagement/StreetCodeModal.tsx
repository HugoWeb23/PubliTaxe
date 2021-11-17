import axios from 'axios'
import { useState } from 'react';
import {
    Modal,
    Button,
    Form,
    Table,
    Alert
} from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { IRue } from '../../Types/IRue';
import { AxiosService } from '../../Services/AxiosService';
import { ErrorAlert } from '../UI/ErrorAlert';
import { IErreur } from '../../Types/IErreur';
import { yupResolver } from '@hookform/resolvers/yup';
import { SearchStreetCodeSchema } from '../../Validation/Streets/SearchStreetCodeSchema';

interface StreetCodeModal {
    isOpen: boolean
    handleClose: () => void,
    onSelect: (street: IRue) => void
}

export const StreetCodeModal = ({ isOpen, handleClose, onSelect }: StreetCodeModal) => {
    const { register, handleSubmit, setError, clearErrors, formState: { errors, isSubmitting } } = useForm({resolver: yupResolver(SearchStreetCodeSchema)});
    const [rues, setRues] = useState<IRue[] | null>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [problem, setProblem] = useState<IErreur | null>(null);

    const OnSearch = async (data: any) => {
        setLoading(true)
        setProblem(null)
        try {
            const rues = await AxiosService(`/rues/getbycode/${data.code_rue}`)
            setRues(rues.length > 0 ? rues : null)
        } catch(e: any) {
            setProblem(e)
        }
        setLoading(false)
    }

    const handleSelectStreet = (street: IRue) => {
        onSelect(street)
        handleClose()
    }

    return <Modal show={isOpen} onHide={handleClose} size="xl" >
        <Modal.Header closeButton>
            <Modal.Title>Recherche par code de rue</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={handleSubmit(OnSearch)} className="mb-3">
                <Form.Group controlId="code_rue">
                    <Form.Label>Code rue</Form.Label>
                    <Form.Control type="text" placeholder="Code rue" isInvalid={errors.code_rue} autoFocus {...register('code_rue')} />
                    {errors.code_rue && <Form.Control.Feedback type="invalid">{errors.code_rue.message}</Form.Control.Feedback>}
                </Form.Group>
                <Button type="submit" variant="primary" className="mt-3">Chercher</Button>
            </Form>
            {problem != null && <ErrorAlert erreur={problem.erreur} details={problem.details}/>}
            {rues == null && <Alert variant="warning">Aucun résultat</Alert>}
            {loading == false && (rues != null && rues.length > 0) &&
                <Table striped bordered hover className="mt-3">
                    <thead>
                        <tr>
                            <th>Nom rue</th>
                            <th>Code postal</th>
                            <th>Localité</th>
                            <th>Code pays</th>
                            <th>Nom pays</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rues.map((rue: IRue, index: number) => {
                            return <tr key={index}>
                            <td>{rue.nom_rue}</td>
                            <td>{rue.code_postal.cp}</td>
                            <td>{rue.code_postal.localite}</td>
                            <td>{rue.code_postal.pays.code_pays}</td>
                            <td>{rue.code_postal.pays.nom_pays}</td>
                            <td><Button size="sm" onClick={() => handleSelectStreet(rue)}>Sélectionner</Button></td>
                        </tr>
                        })}
                    </tbody>
                </Table>
            }
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Fermer
            </Button>
        </Modal.Footer>
    </Modal>
}