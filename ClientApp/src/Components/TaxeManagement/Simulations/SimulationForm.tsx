import { useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form"
import {
    Form,
    Button,
    Row,
    Col,
    Container,
    Card
} from 'react-bootstrap'
import { AsyncTypeahead, Menu, MenuItem } from 'react-bootstrap-typeahead'
import "react-bootstrap-typeahead/css/Typeahead.css";
import { Entreprise } from '../../../Types/IEntreprise'
import { StreetCodeModal } from "../StreetCodeModal";
import { IRue } from "../../../Types/IRue";
import { IMotif_majoration } from "../../../Types/IMotif_majoration";
import { apiFetch, ApiErrors } from "../../../Services/apiFetch";
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from "react-router-dom";
import { LeftArrow } from '../../UI/LeftArroy'
import { Printer } from "../../UI/Printer";
import { IndividualPrint } from '../IndividualPrint';
import { IExercice } from "../../../Types/IExercice";
import { IPrintData } from "../../../Types/IPrintData";
import { ManageAdvertisingSimulation } from "./ManageAdvertisingSimulation";
import { SimulationFormSchema } from "../../../Validation/Tax/SimulationForm";
import { ConfirmModal } from "./ConfirmModal";


export const SimulationForm = ({ data, type, tarifs, currentFiscalYear, allFiscalYears, onFormSubmit }: any) => {
    const defaultValues = data ? data : {}
    const [streetCodeModal, setStreetCodeModal] = useState<boolean>(false)
    const [confirmationModal, setConfirmationModal] = useState<boolean>(false)
    const [postCodes, setPostCodes] = useState<any>(data?.code_postal ? [data.code_postal] : [])
    const [codePostal, setCodePostal] = useState<any>(null)
    const [publicites, setPublicites] = useState(data?.publicites ? data.publicites : [])
    const { register, reset, control, handleSubmit, setValue, setError, clearErrors, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(SimulationFormSchema), defaultValues: defaultValues })

    const OnSubmit = async(data: any) => {
        try {
            const form2 = { ...data }
            const newArray = form2.publicites.map(({ rue, ...rest }: any) => rest)
            form2.publicites = newArray
            if (codePostal != null) {
                form2.code_postalId = codePostal
            }
            form2.exercices = data.exercices.join(';')
            const submit = await onFormSubmit(form2)
            if(type == 'edit') {
                setPublicites(submit.publicites)
            } else {
                reset()
                setPublicites([])
            }
            setConfirmationModal(true)
        } catch(e) {
            if (e instanceof ApiErrors) {
                toast.error(e.singleError.error)
            }
        }
       
    }

    const handleSelectStreet = (street: IRue) => {
        setCodePostal(street.code_postal.code_postalId)
        setValue('code_rue', street.code_rue)
        setValue('adresse_rue', street.nom_rue)
        setValue('code_postal.cp', street.code_postal.cp)
        setValue('code_postal.localite', street.code_postal.localite)
        setPostCodes([street.code_postal])
        clearErrors(['code_postal.cp', 'code_postal.localite', 'adresse_rue'])
    }

    const PostCodeSearch = async (query: any) => {
        try {
            const codes = await apiFetch(`/codes_postaux/getbycode/${query}`)
            setPostCodes(codes)
        } catch (e: any) {
            if (e instanceof ApiErrors) {
                toast.error(e.singleError.error)
            }
        }
    }

    const LocalitySearch = async (query: any) => {
        try {
            const codes = await apiFetch(`/codes_postaux/getbylocality/${query}`)
            setPostCodes(codes)
        } catch (e: any) {
            if (e instanceof ApiErrors) {
                toast.error(e.singleError.error)
            }
        }
    }

    const SetValueOnChange = (type: 'cp' | 'localite', data: any) => {
        const code_postal = { ...data[0] }
        const inputvalue = { ...data }
        if (Object.keys(code_postal).length > 0) {
            setCodePostal(code_postal.code_postalId)
            setValue('code_postal.cp', code_postal.cp)
            setValue('code_postal.localite', code_postal.localite)
            clearErrors(['code_postal.cp', 'code_postal.localite'])
        } else {
            if (type == 'cp') {
                setValue('code_postal.cp', inputvalue.cp)
            } else if (type == 'localite') {
                setValue('code_postal.localite', inputvalue.localite)
            }
        }
    }

    const exercices = useWatch({
        control,
        name: "exercices",
        defaultValue: defaultValues.exercices !== undefined ? defaultValues.exercices : []
    })

    return <>
        <ConfirmModal type={type} show={confirmationModal} onClose={() => setConfirmationModal(false)}/>
        <StreetCodeModal isOpen={streetCodeModal} handleClose={() => setStreetCodeModal(false)} onSelect={handleSelectStreet} />
        <Container fluid="xl">
            <Form onSubmit={handleSubmit(OnSubmit)} className="mb-2">
                <div className="mt-3">
                    <nav aria-label="breadcrumb" className="mt-3">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Accueil</Link></li>
                            <li className="breadcrumb-item"><Link to="/tools/pricingsimulation">Gestion des simulations</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">{type === "create" ? "Créer" : "Éditer"} une simulation</li>
                        </ol>
                    </nav>
                </div>
                <div className="d-flex justify-content-end align-items-center mb-3">
                    <div>
                        <Button variant="success" type="submit" disabled={isSubmitting}>{type == "create" ? "Nouvelle simulation" : "Modifier la simulation"}</Button>
                    </div>
                </div>
                <Row className="mb-3">
                    <Col>
                        <Form.Group controlId="nom">
                            <Form.Label column="sm">Nom entreprise</Form.Label>
                            <Form.Control type="text" placeholder="Nom entreprise" isInvalid={errors.nom} {...register('nom')} size="sm" />
                            {errors.nom && <Form.Control.Feedback type="invalid">{errors.nom.message}</Form.Control.Feedback>}
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="numero_tva">
                            <Form.Label column="sm">Numéro de TVA</Form.Label>
                            <Form.Control type="text" placeholder="Numéro de TVA" isInvalid={errors.numero_tva} {...register('numero_tva')} size="sm" />
                            {errors.numero_tva && <Form.Control.Feedback type="invalid">{errors.numero_tva.message}</Form.Control.Feedback>}
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="langue">
                            <Form.Label column="sm">Langue</Form.Label>
                            <Form.Select size="sm" {...register('role_linguistique')}>
                                <option value="1">Français</option>
                                <option value="2">Néerlandais</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group controlId="code_rue">
                            <Form.Label column="sm">Code rue</Form.Label>
                            <Form.Control type="text" placeholder="Code rue" disabled isInvalid={errors.code_rue} {...register('code_rue')} size="sm" />
                            {errors.code_rue && <Form.Control.Feedback type="invalid">{errors.code_rue.message}</Form.Control.Feedback>}
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="rue">
                            <Form.Label column="sm">Rue</Form.Label>
                            <Form.Control type="text" placeholder="Rue" isInvalid={errors.adresse_rue} {...register('adresse_rue')} size="sm" />
                            {errors.adresse_rue && <Form.Control.Feedback type="invalid">{errors.adresse_rue.message}</Form.Control.Feedback>}
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="numero">
                            <Form.Label column="sm">Numéro</Form.Label>
                            <Form.Control type="text" placeholder="Numéro" isInvalid={errors.adresse_numero} {...register('adresse_numero')} size="sm" />
                            {errors.adresse_numero && <Form.Control.Feedback type="invalid">{errors.adresse_numero.message}</Form.Control.Feedback>}
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="index">
                            <Form.Label column="sm">Index</Form.Label>
                            <Form.Control type="text" placeholder="Index" isInvalid={errors.adresse_index} {...register('adresse_index')} size="sm" />
                            {errors.adresse_index && <Form.Control.Feedback type="invalid">{errors.adresse_index.message}</Form.Control.Feedback>}
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="boite">
                            <Form.Label column="sm">Boite</Form.Label>
                            <Form.Control type="text" placeholder="Boite" isInvalid={errors.adresse_boite} {...register('adresse_boite')} size="sm" />
                            {errors.adresse_boite && <Form.Control.Feedback type="invalid">{errors.adresse_boite.message}</Form.Control.Feedback>}
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col><div className="link" onClick={() => setStreetCodeModal(true)}>Recherche par code rue</div></Col>
                </Row>
                <Row className="mb-3">
                    <Col>
                        <Form.Group controlId="code_postal">
                            <Form.Label column="sm">Code postal</Form.Label>
                            <Controller
                                control={control}
                                name="code_postal.cp"
                                render={({
                                    field: { onChange, onBlur, value, name, ref }
                                }) => (
                                    <AsyncTypeahead
                                        filterBy={() => true}
                                        id="localite"
                                        isLoading={false}
                                        labelKey="cp"
                                        placeholder="Code postal"
                                        isInvalid={errors.code_postal && errors.code_postal.cp}
                                        onSearch={(query) => PostCodeSearch(query)}
                                        options={postCodes}
                                        onChange={(value) => SetValueOnChange('cp', value)}
                                        emptyLabel='Aucun résultat'
                                        selected={value != undefined ? [value] : []}
                                        size="sm"
                                        className="is-invalid"
                                        renderMenu={(results, menuProps) => (
                                            <Menu {...menuProps}>
                                                {results.map((result, index) => (
                                                    <MenuItem
                                                        key={index}
                                                        option={result}
                                                        position={index}>
                                                        <div>{result.cp}</div>
                                                        <div>
                                                            <small>{result.localite}</small>
                                                        </div>
                                                    </MenuItem>
                                                ))}
                                            </Menu>
                                        )}
                                    />
                                )} />
                            {errors.code_postal && errors.code_postal.cp && <Form.Control.Feedback type="invalid">{errors.code_postal.cp.message}</Form.Control.Feedback>}
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="localite">
                            <Form.Label column="sm">Localité</Form.Label>
                            <Controller
                                control={control}
                                name="code_postal.localite"
                                render={({
                                    field: { onChange, onBlur, value, name, ref }
                                }) => (
                                    <AsyncTypeahead
                                        filterBy={() => true}
                                        id="localite"
                                        isLoading={false}
                                        labelKey="localite"
                                        placeholder="Localité"
                                        isInvalid={errors.code_postal && errors.code_postal.localite}
                                        onSearch={(query) => LocalitySearch(query)}
                                        options={postCodes}
                                        onChange={(value: any) => SetValueOnChange('localite', value)}
                                        emptyLabel='Aucun résultat'
                                        selected={value != undefined ? [value] : []}
                                        size="sm"
                                        className="is-invalid"
                                        renderMenu={(results, menuProps) => (
                                            <Menu {...menuProps}>
                                                {results.map((result, index) => (
                                                    <MenuItem
                                                        key={index}
                                                        option={result}
                                                        position={index}>
                                                        <div>{result.cp}</div>
                                                        <div>
                                                            <small>{result.localite}</small>
                                                        </div>
                                                    </MenuItem>
                                                ))}
                                            </Menu>
                                        )}
                                    />
                                )} />
                            {errors.code_postal && errors.code_postal.localite && <Form.Control.Feedback type="invalid">{errors.code_postal.localite.message}</Form.Control.Feedback>}
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="telephone">
                            <Form.Label column="sm">Téléphone</Form.Label>
                            <Form.Control type="text" placeholder="Téléphone" isInvalid={errors.numero_telephone} {...register('numero_telephone')} size="sm" />
                            {errors.numero_telephone && <Form.Control.Feedback type="invalid">{errors.numero_telephone.message}</Form.Control.Feedback>}
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="mail_contact">
                            <Form.Label column="sm">Adresse e-mail</Form.Label>
                            <Form.Control type="text" placeholder="Adresse e-mail" isInvalid={errors.mail_contact} {...register('mail_contact')} size="sm" />
                            {errors.mail_contact && <Form.Control.Feedback type="invalid">{errors.mail_contact.message}</Form.Control.Feedback>}
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group controlId="commentaire">
                            <Form.Label column="sm">Commentaire</Form.Label>
                            <Form.Control as="textarea" placeholder="Commentaire" isInvalid={errors.commentaire_taxation} {...register('commentaire_taxation')} size="sm" />
                            {errors.commentaire_taxation && <Form.Control.Feedback type="invalid">{errors.commentaire_taxation.message}</Form.Control.Feedback>}
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group controlId="exercices">
                <Form.Label column="sm">Sélection des exercices</Form.Label>
                <div className="d-flex mb-3">
                    {allFiscalYears.filter((f: IExercice) => f.annee_exercice >= currentFiscalYear.annee_exercice).map((f: IExercice, index: number) => {
                        return <div className="form-check me-3" key={f.annee_exercice}>
                            <input id={f.annee_exercice.toString()} className="form-check-input" type="checkbox" {...register('exercices')} value={f.id} />
                            <label className="form-check-label" htmlFor={f.annee_exercice.toString()}>
                                {f.annee_exercice}
                            </label>
                        </div>
                    })}
                </div>
                </Form.Group>
            </Form>
            <ManageAdvertisingSimulation
                pubs={publicites}
                tarifs={tarifs}
                currentFiscalYear={currentFiscalYear}
                allFiscalYears={allFiscalYears}
                exos={exercices}
                onSubmit={(pubs: any) => setValue('publicites', pubs)}
            />
        </Container>
    </>
}