import { useState, memo, useRef } from 'react'
import {
    Modal,
    Table,
    Col,
    Row,
    Button,
    Form
} from 'react-bootstrap'
import { IApercu_entreprise } from '../../Types/IApercu_entreprise'
import { AsyncTypeahead, Menu, MenuItem } from 'react-bootstrap-typeahead'
import { apiFetch, ApiErrors } from '../../Services/apiFetch'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

interface IReceivedModal {
    show: boolean,
    handleClose: () => void,
    onSubmit: (selected: IApercu_entreprise[]) => Promise<void>
}

export const ReceivedModal = ({ show, handleClose, onSubmit }: IReceivedModal) => {

    const [selectedEntreprises, setSelectedEntreprises] = useState<IApercu_entreprise[]>([])
    const [searchEntrepriseById, setSearchEntrepriseById] = useState<IApercu_entreprise>({} as IApercu_entreprise)
    const [entpreview, setEntpreview] = useState<IApercu_entreprise[]>([])
    const { register, setValue, setError, clearErrors, formState: { errors } } = useForm()
    const SearchNameRef: any = useRef()

    const UnSelectEntreprise = (ent: IApercu_entreprise) => {
        setSelectedEntreprises(entreprises => entreprises.filter((entreprise: IApercu_entreprise) => entreprise.matricule_ciger != ent.matricule_ciger))
    }

    const CheckEntIsNotSelected = (matricule: number): boolean => {
        return selectedEntreprises.filter((ent: IApercu_entreprise) => ent.matricule_ciger == matricule).length === 0
    }

    const SearchById = async (e: any) => {
        if (e.key === "Enter" && e.target.value.length >= 2) {
            const matriculeToInt = parseInt(e.target.value)
            clearErrors('matricule')
            if (isNaN(matriculeToInt) === false && CheckEntIsNotSelected(e.target.value)) {
                try {
                    const fetch = await apiFetch(`/entreprises/searchbyid/${matriculeToInt}`)
                    setSelectedEntreprises(ent => ([...ent, fetch]))
                    setValue('matricule', '')
                } catch (e: any) {
                    setError('matricule', { type: "manual", message: "Aucun r??sultat" })
                }
            }
        }
    }

    const SearchByName = async (name: string) => {
        if (name.length > 2) {
            try {
                const fetch = await apiFetch(`/entreprises/searchbyname`, {
                    method: 'POST',
                    body: JSON.stringify({ name: name })
                })
                setEntpreview(fetch)
            } catch (e: any) {
                if (e instanceof ApiErrors) {
                    toast.error(e.singleError.error)
                }
            }
        }
    }

    const SelectEntName = (value: any) => {
        value = { ...value[0] }
        if (CheckEntIsNotSelected(value.matricule_ciger)) {
            setSelectedEntreprises(ent => ([...ent, value]))
        }
        SearchNameRef.current.clear()
    }

    const handleSubmit = async () => {
        try {
            await onSubmit(selectedEntreprises)
            handleClose()
            setSelectedEntreprises([])
            toast.success("Op??ration effectu??e")
        } catch (e: any) {
            if (e instanceof ApiErrors) {
                toast.error(e.singleError.error)
            }
        }
    }
    return <>
        <Modal show={show} onHide={handleClose} size="lg" animation={false}>
            <Modal.Header closeButton>
                <Modal.Title>Encoder des re??us</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        <Col>
                            <Form.Group controlId="matricule">
                                <Form.Label column="sm">Recherche par matricule</Form.Label>
                                <Form.Control type="text" size="sm" placeholder="Matricule" isInvalid={errors.matricule} onKeyDown={(e) => SearchById(e)} {...register('matricule')} />
                                {errors.matricule && <Form.Control.Feedback type="invalid">{errors.matricule.message}</Form.Control.Feedback>}
                                <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                                    Appuyez sur ENTER pour lancer la recherche.
                                </p>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="nom">
                                <Form.Label column="sm">Recherche par nom</Form.Label>
                                <AsyncTypeahead
                                    filterBy={() => true}
                                    id="localite"
                                    labelKey={option => option.nom}
                                    ref={SearchNameRef}
                                    isLoading={false}
                                    placeholder="Nom de l'entreprise"
                                    isInvalid={errors.code_postal && errors.code_postal.cp}
                                    onSearch={(query) => SearchByName(query)}
                                    options={entpreview}
                                    onChange={(value) => SelectEntName(value)}
                                    emptyLabel='Aucun r??sultat'
                                    size="sm"
                                    className="is-invalid"
                                    renderMenu={(results, menuProps) => (
                                        <Menu {...menuProps}>
                                            {results.map((result, index) => (
                                                <MenuItem
                                                    key={index}
                                                    option={result}
                                                    position={index}>
                                                    <div>{result.nom}</div>
                                                    <div>
                                                        <small>Recu: {result.recu ? "oui" : "non"}</small>
                                                    </div>
                                                </MenuItem>
                                            ))}
                                        </Menu>
                                    )}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
                <p className="text-muted mt-3">Entreprises s??lectionn??es</p>
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>Matricule</th>
                            <th>Nom</th>
                            <th>Nombre de panneaux</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedEntreprises.length === 0 && <tr><td colSpan={4}>Aucun ??l??ment</td></tr>}
                        {selectedEntreprises.map((ent: IApercu_entreprise, index: number) => <Entreprise entreprise={ent} index={index} handleDelete={UnSelectEntreprise} />)}
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Annuler
                </Button>
                <Button variant="success" onClick={handleSubmit}>
                    Encoder les re??us
                </Button>
            </Modal.Footer>
        </Modal>
    </>
}

interface IEntreprise {
    entreprise: IApercu_entreprise,
    index: number,
    handleDelete: (entreprise: IApercu_entreprise) => void
}

const Entreprise = memo(({ entreprise, index, handleDelete }: IEntreprise) => {
    return <tr>
        <td>{entreprise.matricule_ciger}</td>
        <td>{entreprise.nom}</td>
        <td>{entreprise.nombre_panneaux}</td>
        <td><Button size="sm" variant="danger" onClick={() => handleDelete(entreprise)}>Annuler</Button></td>
    </tr>
})