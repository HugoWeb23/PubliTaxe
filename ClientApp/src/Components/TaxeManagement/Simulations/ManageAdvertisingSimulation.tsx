import { useEffect, useRef, memo, useState } from 'react'
import {
    Table,
    Button,
    OverlayTrigger,
    Tooltip,
    Alert
} from 'react-bootstrap'
import { SumTax } from '../../../Services/SumTax'
import { IExercice } from '../../../Types/IExercice'
import { IPrice } from '../../../Types/IPrice'
import { IPubliciteSimulation } from '../../../Types/IPubliciteSimulation'
import { ConfirmModal } from '../../UI/ConfirmModal'
import { Pencil } from '../../UI/Pencil'
import { PlusIcon } from '../../UI/PlusIcon'
import { Trash } from '../../UI/Trash'
import { AdvertisingModalSimulation } from './AdvertisingSimulationModal'

interface IManageAdvertisingSimulation {
    pubs: any[],
    tarifs: IPrice[],
    currentFiscalYear: IExercice,
    allFiscalYears: IExercice[],
    exos: any,
    onSubmit: (publicites: IPubliciteSimulation[]) => void
}

export const ManageAdvertisingSimulation = memo(({ pubs = [], tarifs, allFiscalYears, exos = [], onSubmit }: IManageAdvertisingSimulation) => {
    const isMounted = useRef(false)
    const [showEdit, setShowEdit] = useState<boolean>(false)
    const [type, setType] = useState<'edit' | 'create'>('edit')
    const [publicites, setPublicites] = useState<IPubliciteSimulation[]>(pubs)
    const [publicite, setPublicite] = useState<IPubliciteSimulation | null>(null)
    const [deleteModal, setDeleteModal] = useState<{ show: boolean, element: IPubliciteSimulation | null }>({ show: false, element: null })

    useEffect(() => {
        if (isMounted.current == false) {
            isMounted.current = true
        } else if (isMounted.current == true) {
            onSubmit(publicites)
        }
    }, [publicites])

    useEffect(() => {
        if (isMounted.current == false) {
            isMounted.current = true
        } else if (isMounted.current == true) {
            if (pubs.length > 0) {
                const test = [...publicites]
                setPublicites(test.map((pub: IPubliciteSimulation, index: number) => ({ ...pub, id: pubs[index].id })))
            } else {
                setPublicites([])
            }
        }

    }, [pubs])

    const handleSelectPub = (pub: IPubliciteSimulation) => {
        setPublicite(pub)
        setType('edit')
        setShowEdit(true)
    }

    const handleUnSelectPub = () => {
        setPublicite(null)
        setShowEdit(false)
        setType('edit')
    }

    const setCreateMode = () => {
        setPublicite(null)
        setType('create')
        setShowEdit(true)
    }

    const handleSubmit = async (data: any, type: 'create' | 'edit') => {
        if (type == 'edit') {
            setPublicites(publicites => publicites.map((pub: IPubliciteSimulation) => {
                if(pub.id != undefined && pub.id == publicite?.id) {
                   return data
                } else if(pub.uuid != undefined && pub.uuid == publicite?.uuid) {
                    return data
                } else {
                    return pub
                }
            }))
        } else {
            setPublicites(publicites => [...publicites, data])
        }
    }

    const closeConfirmModal = () => {
        setDeleteModal({ show: false, element: null })
    }

    const deletePub = (pub: IPubliciteSimulation) => {
        setPublicites(publicites => publicites.filter((publicite: IPubliciteSimulation) => publicite != pub))
        setDeleteModal({ show: false, element: null })
    }

    return <>
        {((type == 'edit' && publicite != null) || (type == 'create' && publicite == null)) && <AdvertisingModalSimulation
            type={type}
            show={showEdit}
            publicite={publicite}
            handleClose={handleUnSelectPub}
            onValidate={handleSubmit}
        />}
        <div className="d-flex justify-content-start align-items-center mb-2 link" onClick={setCreateMode}><PlusIcon /> Ajouter un panneau</div>
        <ConfirmModal
            show={deleteModal.show}
            element={deleteModal.element}
            onClose={closeConfirmModal}
            onConfirm={deletePub}
            bodyText="Voulez-vous vraiment supprimer ce panneau ?"
        />
        <Table>
            <thead>
                <tr>
                    <th>Code postal</th>
                    <th>Code rue</th>
                    <th>Rue</th>
                    <th>N°</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {publicites.length == 0 && <tr><td colSpan={6}>Aucun panneau</td></tr>}
                {publicites.map((publicite: IPubliciteSimulation, index: number) => {
                    return <tr key={index}>
                        <td>{publicite.rue.code_postal.cp}</td>
                        <td>{publicite.rue.code_rue}</td>
                        <td>{publicite.rue.nom_rue}</td>
                        <td>{publicite.adresse_numero}</td>
                        <td className="d-flex">
                            <OverlayTrigger
                                placement="top"
                                overlay={
                                    <Tooltip id={`tooltip-2`}>
                                        Éditer
                                    </Tooltip>
                                }
                            >
                                <Button size="sm" variant="secondary" className="me-1" onClick={() => handleSelectPub(publicite)}><Pencil /></Button>
                            </OverlayTrigger>
                            <OverlayTrigger
                                placement="top"
                                overlay={
                                    <Tooltip id={`tooltip-2`}>
                                        Supprimer
                                    </Tooltip>
                                }
                            >
                                <Button size="sm" variant="danger" onClick={() => setDeleteModal({ show: true, element: publicite })}><Trash /></Button>
                            </OverlayTrigger></td>
                    </tr>
                })}
            </tbody>
        </Table>
        {publicites.length > 0 && <Table>
            <thead>
                <tr>
                    <th>N°</th>
                    <th>Prix</th>
                    <th>Éxonérée</th>
                </tr>
            </thead>
            <tbody>
            {exos.map((e: number) => {
            const exercice = allFiscalYears.find((fisc: IExercice) => fisc.id == e)?.annee_exercice
            return <>
                <tr>
                    <td colSpan={3} className="fw-bold table-active">Exercice {exercice}</td>
                </tr>
                    {publicites.map((pub: IPubliciteSimulation, index: number) => {
                        return <tr>
                            <td>{index + 1}</td>
                            <td>{SumTax(e, pub.quantite, pub.surface, pub.face, pub.type_publicite, pub.exoneration, tarifs)} €</td>
                            <td>{pub.exoneration ? "Oui" : "Non"}</td>
                        </tr>
                    })}
                    <tr>
                        <td colSpan={3}> Total : {publicites.reduce((acc: any, curr: IPubliciteSimulation) => {
                        if (curr.exoneration) {
                            return acc
                        } else {
                            const tax: any = SumTax(e, curr.quantite, curr.surface, curr.face, curr.type_publicite, curr.exoneration, tarifs)
                            return acc + parseFloat(tax)
                        }
                    }, 0)} €</td>
                    </tr>
            </>
        })}
            </tbody>
        </Table>}
        {(publicites.length > 0 && exos.length === 0) && <Alert variant="warning">Veuillez sélectionner au moins un exercice pour afficher la simulation.</Alert>}
    </>
})