import { useEffect, useState, useRef } from 'react'
import {
    Modal,
    Col,
    Row,
    Button,
    Form
} from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form'
import { AsyncTypeahead, Menu, MenuItem } from 'react-bootstrap-typeahead'
import { IRue } from '../../Types/IRue'
import { apiFetch } from '../../Services/apiFetch'
import { NOMEM } from 'dns'

interface ISearchModal {
    options: { matricule: string, nom: string, pubExoneration: boolean, rue: number }
    show: boolean,
    handleClose: () => void,
    handleSearch: (data: any) => void
}

export const SearchModal = ({ options, show, handleClose, handleSearch }: ISearchModal) => {
    const { register, handleSubmit, control, setValue, setError, clearErrors, formState: { errors } } = useForm()
    const [streets, setStreets] = useState<IRue[]>([])
    const [loadingStreets, setLoadingStreets] = useState<boolean>(false)
    const streetRef: any = useRef()

    useEffect(() => {
        (async () => {
           if(options.matricule === "") {
            setValue('matricule', '')
           }
           if(options.nom === "") {
            setValue('nom', '')
           }
           if(options.pubExoneration === false) {
            setValue('pubExoneration', false)
           }
           if(options.rue === undefined || options.rue === null) {
            setValue('rue', '')
           }
        })()
    }, [options])

    const onSearch = (data: any) => {
        data = ({ ...data, rue: data.rue.rueId })
        handleSearch(data)
        handleClose()
    }

    const StreetSearch = async (query: string) => {
        setLoadingStreets(true)
        const streets = await apiFetch(`/rues/getbyname`, {
            method: 'POST',
            body: JSON.stringify({ nom_rue: query })
        })
        setStreets(streets)
        setLoadingStreets(false)
    }

    const SetValueOnChange = (data: any) => {
        const rue: IRue = { ...data[0] }
        const inputvalue = { ...data }
        if (Object.keys(rue).length > 0) {
            setValue('rue', rue)
            clearErrors(['rue.nom_rue', 'rue.code_rue', 'rue.code_postal.cp'])
        } else {
            setValue('rue.nom_rue', inputvalue.nom_rue)
        }
    }

    const ResetStreet = () => {
        setValue('rue', '')
        streetRef.current.clear()
    }
    return <>
        <Modal show={show} onHide={handleClose} size="lg" animation={false}>
            <Modal.Header closeButton>
                <Modal.Title as="h5">Recherche</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        <Col>
                            <Form.Group controlId="matricule">
                                <Form.Label column="sm">Recherche par matricule</Form.Label>
                                <Form.Control type="text" size="sm" placeholder="Matricule" isInvalid={errors.matricule} {...register('matricule')} autoFocus={options.nom.length === 0 && options.matricule.length === 0} />
                                {errors.matricule && <Form.Control.Feedback type="invalid">{errors.matricule.message}</Form.Control.Feedback>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="nom">
                                <Form.Label column="sm">Recherche par nom</Form.Label>
                                <Form.Control type="text" size="sm" placeholder="Nom" isInvalid={errors.matricule} {...register('nom')} />
                            </Form.Group>
                        </Col>
                        <p className="mt-3 mb-1 fw-bold">Filtrer des entreprises en fonction des publicités</p>
                        <Col>
                            <Form.Group controlId="exoneration">
                                <Form.Label column="sm">Exonération</Form.Label>
                                <Form.Check type="checkbox" isInvalid={errors.matricule} {...register('pubExoneration')} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="adresse_rue">
                                <Form.Label column="sm">Rue</Form.Label>
                                <Controller
                                    control={control}
                                    name="rue.nom_rue"
                                    render={({
                                        field: { onChange, onBlur, value, name, ref }
                                    }) => (
                                        <AsyncTypeahead
                                            filterBy={() => true}
                                            id="rue"
                                            isLoading={loadingStreets}
                                            labelKey="nom_rue"
                                            placeholder="Rue"
                                            ref={streetRef}
                                            isInvalid={errors.rue && errors.rue.nom_rue}
                                            onSearch={(query) => StreetSearch(query)}
                                            options={streets}
                                            onChange={(value: any[]) => SetValueOnChange(value)}
                                            emptyLabel='Aucun résultat'
                                            defaultInputValue={value}
                                            size="sm"
                                            className="is-invalid"
                                            renderMenu={(results, menuProps) => (
                                                <Menu {...menuProps}>
                                                    {results.map((result, index) => (
                                                        <>
                                                            {result.code_postal &&
                                                                <MenuItem
                                                                    key={index}
                                                                    option={result}
                                                                    position={index}>
                                                                    <div>{result.nom_rue}</div>
                                                                    <div>
                                                                        <small>{result.code_postal.localite}</small>
                                                                    </div>
                                                                </MenuItem>
                                                            }
                                                        </>
                                                    ))}
                                                </Menu>
                                            )}
                                        />
                                    )} />
                                <div className="link" onClick={ResetStreet}>(réinitialiser)</div>
                                {errors.rue && errors.rue.nom_rue && <Form.Control.Feedback type="invalid">{errors.rue.nom_rue.message}</Form.Control.Feedback>}
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" size="sm" onClick={handleClose}>
                    Annuler
                </Button>
                <Button variant="success" size="sm" onClick={handleSubmit(onSearch)}>
                    Rechercher
                </Button>
            </Modal.Footer>
        </Modal>
    </>
}