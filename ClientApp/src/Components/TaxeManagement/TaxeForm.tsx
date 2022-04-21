import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form"
import {
    Form,
    Button,
    Row,
    Col,
    Container,
    Card,
    Alert
} from 'react-bootstrap'
import { AsyncTypeahead, Menu, MenuItem } from 'react-bootstrap-typeahead'
import "react-bootstrap-typeahead/css/Typeahead.css";
import { Entreprise } from '../../Types/IEntreprise'
import { StreetCodeModal } from "./StreetCodeModal";
import { IRue } from "../../Types/IRue";
import { IMotif_majoration } from "../../Types/IMotif_majoration";
import { apiFetch, ApiErrors } from "../../Services/apiFetch";
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { TaxeFormSchema } from "../../Validation/Tax/TaxFormSchema";
import { Link } from "react-router-dom";
import { LeftArrow } from '../UI/LeftArroy'
import { ManageAdvertising } from './ManageAdvertising'
import { Printer } from "../UI/Printer";
import { IndividualPrint } from './IndividualPrint';
import { IExercice } from "../../Types/IExercice";
import { IPrintData } from "../../Types/IPrintData";
import { OffensesModal } from "./OffensesModal";
import { INotReceivedHistory } from "../../Types/INotReceivedHistory";

interface TaxeForm {
    data?: any,
    type: 'create' | 'edit',
    motifs: IMotif_majoration[],
    tarifs: any,
    currentFiscalYear: IExercice,
    informations?: IPrintData,
    formSimulation?: boolean,
    simulationData?: any,
    onFormSubmit: (data: any) => Promise<void>
}

export const TaxeForm = ({ data = {}, type, motifs, tarifs, currentFiscalYear, informations, formSimulation = false, simulationData = {}, onFormSubmit }: TaxeForm) => {
    const defaultValues = data ? data : {}
    const [formSimulationMode, setFormSimulationMode] = useState<boolean>(formSimulation)
    const [tax, setTax] = useState<Entreprise>(data as Entreprise)
    const [publicites, setPublicites] = useState(data.publicites ? data.publicites : simulationData.publicites ? simulationData.publicites : [])
    const [streetCodeModal, setStreetCodeModal] = useState<boolean>(false)
    const [postCodes, setPostCodes] = useState<any>(data.code_postal ? [data.code_postal] : [])
    const [codePostal, setCodePostal] = useState<any>(null)
    const [autoTaxAdress, setAutoTaxAdress] = useState<boolean>(true)
    const [individualPrint, setIndiviualPrint] = useState<boolean>(false)
    const [offensesModal, setOffensesModal] = useState<boolean>(false)
    const [matriculeAvailable, setMatriculeAvailable] = useState<boolean>(false)
    const { register, reset, control, handleSubmit, setValue, setError, clearErrors, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(TaxeFormSchema), defaultValues: defaultValues });

    useEffect(() => {
        if (formSimulation) {
            for (const [key, value] of Object.entries(simulationData)) {
                setValue(key, value)
            }
        }
    }, [])

    const OnSubmit = async (form: any) => {
        try {
            setTax(form)
            const form2 = { ...form }
            const newArray = form2.publicites.map(({ rue, ...rest }: any) => rest)
            form2.publicites = newArray
            if (codePostal != null) {
                form2.code_postalId = codePostal
            }
            const test: any = await onFormSubmit(form2)
            if (type == 'create') {
                reset()
                setPublicites([])
                toast.success("Entreprise créée avec succès")
            } else {
                setPublicites(test.publicites)
                toast.success('Modifications sauvegardées')
            }
        } catch (e: any) {
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

    const UpdatePubs = (pubs: any) => {
        setValue('publicites', pubs)
        if (pubs.length > 0) {
            const checkPubs = pubs.reduce((acc: any, curr: any) => {
                if (acc.rue == undefined) return false
                if ((acc.rue.rueId == curr.rue.rueId) && (acc.adresse_numero == curr.adresse_numero)) {
                    return acc
                } else {
                    return false
                }
            })
            if (checkPubs != false) {
                setValue('code_rue_taxation', checkPubs.rue.code_rue)
                setValue('adresse_taxation', checkPubs.rue.nom_rue)
                setValue('adresse_code_postal_taxation', checkPubs.rue.code_postal.cp)
                setValue('adresse_localite_taxation', checkPubs.rue.code_postal.localite)
                setValue('adresse_numero_taxation', checkPubs.adresse_numero)
                setValue('adresse_index_taxation', '0')
                setValue('adresse_boite_taxation', '0')
            } else {
                setValue('code_rue_taxation', '888')
                setValue('adresse_taxation', "Dans l'arondissement de Mouscron")
                setValue('adresse_index_taxation', '0')
                setValue('adresse_boite_taxation', '0')
                setValue('adresse_code_postal_taxation', '7700')
                setValue('adresse_localite_taxation', 'MOUSCRON')
                setValue('adresse_numero_taxation', '0')
            }
        } else {
            setValue('code_rue_taxation', '')
            setValue('adresse_taxation', '')
            setValue('adresse_boite_taxation', '')
            setValue('adresse_index_taxation', '')
            setValue('adresse_code_postal_taxation', '')
            setValue('adresse_localite_taxation', '')
            setValue('adresse_numero_taxation', '')
        }
    }

    const handleCancelSimulationMode = () => {
        reset();
        setPublicites([]);
        setFormSimulationMode(false);
    }

    const UpdateMajoration = (lastNotReceived: INotReceivedHistory) => {
        setValue('pourcentage_majoration', lastNotReceived.pourcentage_majoration.toString())
        setValue('motif_majorationId', lastNotReceived.motif_majorationId)
    }

    const CheckMatricule = async (e: any) => {
        clearErrors('matricule_ciger')
        setMatriculeAvailable(false)
        if (e.target.value.length > 0) {
            const isAvailable = await apiFetch(`/entreprises/checkmatricule/${e.target.value}`)
            if (isAvailable === false) {
                setError('matricule_ciger', { type: "manual", message: "Ce matricule est déjà utilisé" })
            } else {
                setMatriculeAvailable(true)
            }
        }
    }

    return <>
        <StreetCodeModal isOpen={streetCodeModal} handleClose={() => setStreetCodeModal(false)} onSelect={handleSelectStreet} />
        {type === 'edit' && <OffensesModal id_entreprise={tax.id_entreprise} motifs={motifs} currentFiscalYear={currentFiscalYear} isOpen={offensesModal} handleClose={() => setOffensesModal(false)} onDelete={UpdateMajoration} />}
        {type === 'edit' && <IndividualPrint
            show={individualPrint}
            handleClose={() => setIndiviualPrint(false)}
            tax={tax}
            tarifs={tarifs}
            currentFiscalYear={currentFiscalYear}
            informations={informations}
            motifs={motifs}
            notice={true}
        />}
        <Container fluid="xl">
            <Form onSubmit={handleSubmit(OnSubmit)} className="mb-2">
                <div className="mt-3">
                    <nav aria-label="breadcrumb" className="mt-3">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Accueil</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">{type === "create" ? "Créer" : "Éditer"} une entreprise</li>
                        </ol>
                    </nav>
                </div>
                <div className="d-flex justify-content-end align-items-center mb-3">
                    <div>
                        {type == 'edit' && <Button variant="outline-primary" className="me-4" size="sm" onClick={() => setIndiviualPrint(true)}><Printer /> Impression individuelle</Button>}
                        <Button variant="success" type="submit" disabled={isSubmitting}>{type == "create" ? "Créer l'entreprise" : "Modifier l'entreprise"}</Button>
                    </div>
                </div>
                {formSimulationMode && <div className="bd-callout bd-callout-default">
                    <h5>Création d'une entreprise à partir d'une simulation</h5>
                    Les informations générées automatiquement proviennent de la simulation n°{simulationData.id_simulation}. Si vous souhaitez effectuer des modifications, il est conseillé de les appliquer dans la simulation, et non dans ce formulaire.
                    <div className="mt-3">
                        <Link className="link" to={`/pricingsimulation/edit/${simulationData.id_simulation}`}>Modifier la simulation</Link> - <div className="link" onClick={handleCancelSimulationMode}>Annuler la création de l'entreprise</div>
                    </div>
                </div>}
                <Row className="mb-3">
                    <Col>
                        <Form.Group controlId="matricule_ciger">
                            <Form.Label column="sm">Matricule</Form.Label>
                            <Form.Control type="text" placeholder="Matricule Ciger" isInvalid={errors.matricule_ciger} isValid={matriculeAvailable} size="sm" {...register('matricule_ciger')} onChange={(e) => CheckMatricule(e)} />
                            {errors.matricule_ciger && <Form.Control.Feedback type="invalid">{errors.matricule_ciger.message}</Form.Control.Feedback>}
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="proces_verbal">
                            <Form.Label column="sm">Procès-verbal</Form.Label>
                            <Form.Check type="checkbox" isInvalid={errors.proces_verbal} {...register('proces_verbal')} />
                            {errors.proces_verbal && <Form.Control.Feedback type="invalid">{errors.proces_verbal.message}</Form.Control.Feedback>}
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="recu">
                            <Form.Label column="sm">Reçu</Form.Label>
                            <Form.Check type="checkbox" isInvalid={errors.recu} {...register('recu')} />
                            {errors.recu && <Form.Control.Feedback type="invalid">{errors.recu.message}</Form.Control.Feedback>}
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
                <Row className="mb-3">
                    <Col>
                        <Form.Group controlId="nom">
                            <Form.Label column="sm">Nom entreprise</Form.Label>
                            <Form.Control type="text" placeholder="Nom entreprise" isInvalid={errors.nom} {...register('nom')} size="sm" />
                            {errors.nom && <Form.Control.Feedback type="invalid">{errors.nom.message}</Form.Control.Feedback>}
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
                            <Form.Label column="sm">Index <span className="fw-light">(optionnel)</span></Form.Label>
                            <Form.Control type="text" placeholder="Index" isInvalid={errors.adresse_index} {...register('adresse_index')} size="sm" />
                            {errors.adresse_index && <Form.Control.Feedback type="invalid">{errors.adresse_index.message}</Form.Control.Feedback>}
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="boite">
                            <Form.Label column="sm">Boite <span className="fw-light">(optionnel)</span></Form.Label>
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
                        <Form.Group controlId="fax">
                            <Form.Label column="sm">Fax <span className="fw-light">(optionnel)</span></Form.Label>
                            <Form.Control type="text" placeholder="Fax" isInvalid={errors.numero_fax} {...register('numero_fax')} size="sm" />
                            {errors.numero_fax && <Form.Control.Feedback type="invalid">{errors.numero_fax.message}</Form.Control.Feedback>}
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col>
                        <Form.Group controlId="personne_contact">
                            <Form.Label column="sm">Personne de contact</Form.Label>
                            <Form.Control type="text" placeholder="Personne de contact" isInvalid={errors.personne_contact} {...register('personne_contact')} size="sm" />
                            {errors.personne_contact && <Form.Control.Feedback type="invalid">{errors.personne_contact.message}</Form.Control.Feedback>}
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="telephone_contact">
                            <Form.Label column="sm">Téléphone</Form.Label>
                            <Form.Control type="text" placeholder="Téléphone" isInvalid={errors.telephone_contact} {...register('telephone_contact')} size="sm" />
                            {errors.telephone_contact && <Form.Control.Feedback type="invalid">{errors.telephone_contact.message}</Form.Control.Feedback>}
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
                <Row className="mb-3">
                    <Col>
                        <Form.Group controlId="numero_tva">
                            <Form.Label column="sm">Numéro de TVA</Form.Label>
                            <Form.Control type="text" placeholder="Numéro de TVA" isInvalid={errors.numero_tva} {...register('numero_tva')} size="sm" />
                            {errors.numero_tva && <Form.Control.Feedback type="invalid">{errors.numero_tva.message}</Form.Control.Feedback>}
                        </Form.Group>
                    </Col>
                </Row>
                <Row className={`${type === 'create' ? 'mb-3' : ""}`}>
                    <Col>
                        <Form.Group controlId="pourcentage_majoration">
                            <Form.Label column="sm">% majoration</Form.Label>
                            <Form.Select {...register('pourcentage_majoration')} isInvalid={errors.pourcentage_majoration} size="sm">
                                <option value="0">Aucun</option>
                                <option value="10">10 %</option>
                                <option value="50">50 %</option>
                                <option value="100">100 %</option>
                                <option value="200">200 %</option>
                            </Form.Select>
                            {errors.pourcentage_majoration && <Form.Control.Feedback type="invalid">{errors.pourcentage_majoration.message}</Form.Control.Feedback>}
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="motif_majorationId">
                            <Form.Label column="sm">Motif de la majoration</Form.Label>
                            <Form.Select {...register('motif_majorationId')} isInvalid={errors.motif_majorationId} size="sm">
                                <option value="">Aucun motif</option>
                                {motifs.map((reason: IMotif_majoration, index: number) => {
                                    return <option key={index} value={reason.id_motif}>{reason.libelle}</option>
                                })}
                            </Form.Select>
                            {errors.motif_majorationId && <Form.Control.Feedback type="invalid">{errors.motif_majorationId.message}</Form.Control.Feedback>}
                        </Form.Group>
                    </Col>
                </Row>
                {type === 'edit' && <Row className="mb-3">
                    <Col><div className="link" onClick={() => setOffensesModal(true)}>Historique des infractions</div></Col>
                </Row>}
                <Card>
                    <Card.Header as="h6">Adresse de taxation</Card.Header>
                    <Card.Body>
                        <Row className="mb-3">
                            <Col>
                                <Form.Group controlId="code_rue_taxation">
                                    <Form.Label column="sm">Code rue taxation</Form.Label>
                                    <Form.Control type="text" isInvalid={errors.code_rue_taxation} disabled={autoTaxAdress} {...register('code_rue_taxation')} size="sm" />
                                    {errors.code_rue_taxation && <Form.Control.Feedback type="invalid">{errors.code_rue_taxation.message}</Form.Control.Feedback>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="adresse_taxation">
                                    <Form.Label column="sm">Adresse taxation</Form.Label>
                                    <Form.Control type="text" placeholder="Adresse taxation" isInvalid={errors.adresse_taxation} disabled={autoTaxAdress} {...register('adresse_taxation')} size="sm" />
                                    {errors.adresse_taxation && <Form.Control.Feedback type="invalid">{errors.adresse_taxation.message}</Form.Control.Feedback>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="adresse_numero_taxation">
                                    <Form.Label column="sm">Numéro</Form.Label>
                                    <Form.Control type="text" placeholder="Numéro" isInvalid={errors.adresse_numero_taxation} disabled={autoTaxAdress} {...register('adresse_numero_taxation')} size="sm" />
                                    {errors.adresse_numero_taxation && <Form.Control.Feedback type="invalid">{errors.adresse_numero_taxation.message}</Form.Control.Feedback>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="adresse_index_taxation">
                                    <Form.Label column="sm">Index <span className="fw-light">(optionnel)</span></Form.Label>
                                    <Form.Control type="text" placeholder="Index" isInvalid={errors.adresse_index_taxation} disabled={autoTaxAdress} {...register('adresse_index_taxation')} size="sm" />
                                    {errors.adresse_index_taxation && <Form.Control.Feedback type="invalid">{errors.adresse_index_taxation.message}</Form.Control.Feedback>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="adresse_boite_taxation">
                                    <Form.Label column="sm">Boite <span className="fw-light">(optionnel)</span></Form.Label>
                                    <Form.Control type="text" placeholder="Boite" isInvalid={errors.adresse_boite_taxation} disabled={autoTaxAdress} {...register('adresse_boite_taxation')} size="sm" />
                                    {errors.adresse_boite_taxation && <Form.Control.Feedback type="invalid">{errors.adresse_boite_taxation.message}</Form.Control.Feedback>}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="adresse_code_postal_taxation">
                                    <Form.Label column="sm">Code postal</Form.Label>
                                    <Form.Control type="text" placeholder="Code postal" isInvalid={errors.adresse_code_postal_taxation} disabled={autoTaxAdress} {...register('adresse_code_postal_taxation')} size="sm" />
                                    {errors.adresse_code_postal_taxation && <Form.Control.Feedback type="invalid">{errors.adresse_code_postal_taxation.message}</Form.Control.Feedback>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="adresse_localite_taxation">
                                    <Form.Label column="sm">Localité</Form.Label>
                                    <Form.Control type="text" placeholder="Localité" isInvalid={errors.adresse_localite_taxation} disabled={autoTaxAdress} {...register('adresse_localite_taxation')} size="sm" />
                                    {errors.adresse_localite_taxation && <Form.Control.Feedback type="invalid">{errors.adresse_localite_taxation.message}</Form.Control.Feedback>}
                                </Form.Group>
                            </Col>
                            <Form.Group className="mt-3" controlId="auto_address">
                                <Form.Check type="checkbox" label="Générer automatiquement l'adresse de taxation" defaultChecked={autoTaxAdress} onClick={() => setAutoTaxAdress(!autoTaxAdress)} />
                                <Form.Text className="text-muted">
                                    Si cette case est cochée, l'adresse de taxation sera définie en fonction des panneaux publicitaires. Décochez-la pour saisir les informations manuellement.
                                </Form.Text>
                            </Form.Group>
                        </Row>
                    </Card.Body>
                </Card>
                <Row>
                    <Col>
                        <Form.Group controlId="commentaire">
                            <Form.Label column="sm">Commentaire <span className="fw-light">(optionnel)</span></Form.Label>
                            <Form.Control as="textarea" placeholder="Commentaire" isInvalid={errors.commentaire_taxation} {...register('commentaire_taxation')} size="sm" />
                            {errors.commentaire_taxation && <Form.Control.Feedback type="invalid">{errors.commentaire_taxation.message}</Form.Control.Feedback>}
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            <ManageAdvertising pubs={publicites} matricule={defaultValues.matricule_ciger} tarifs={tarifs} currentFiscalYear={currentFiscalYear} onSubmit={UpdatePubs} />
        </Container>
    </>
}