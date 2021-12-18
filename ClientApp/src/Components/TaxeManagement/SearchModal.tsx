import { useEffect, useState, memo } from 'react'
import {
    Modal,
    Table,
    Col,
    Row,
    Button,
    Form
} from 'react-bootstrap'
import { useForm } from 'react-hook-form'

interface ISearchModal {
    show: boolean,
    handleClose: () => void,
    handleSearch: (data: any) => void
}

export const SearchModal = ({show, handleClose, handleSearch}: ISearchModal) => {
    const { register, handleSubmit, setValue, setError, clearErrors, formState: { errors } } = useForm()

    const onSearch = (data: any) => {
        handleSearch(data)
        handleClose()
    }
    return <>
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Recherche</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        <Col>
                            <Form.Group controlId="matricule">
                                <Form.Label column="sm">Recherche par matricule</Form.Label>
                                <Form.Control type="text" size="sm" placeholder="Matricule" isInvalid={errors.matricule} {...register('matricule')} />
                                {errors.matricule && <Form.Control.Feedback type="invalid">{errors.matricule.message}</Form.Control.Feedback>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="nom">
                                <Form.Label column="sm">Recherche par nom</Form.Label>
                                <Form.Control type="text" size="sm" placeholder="Nom" isInvalid={errors.matricule} {...register('nom')} />
                            </Form.Group>
                        </Col>
                        <p>Filtrer par élements de publicité</p>
                        <Form.Group controlId="exoneration">
                                <Form.Label column="sm">Exoneration</Form.Label>
                                <Form.Check type="checkbox" isInvalid={errors.matricule} {...register('pubExoneration')} />
                            </Form.Group>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Annuler
                </Button>
                <Button variant="success" onClick={handleSubmit(onSearch)}>
                    Rechercher
                </Button>
            </Modal.Footer>
        </Modal>
    </>
}