import { useEffect, useRef, useState } from 'react'
import {
    Table,
    Button
} from 'react-bootstrap'
import { apiFetch } from '../../Services/apiFetch'
import { IPublicite } from '../../Types/IPublicite'
import { AdvertisingModal } from './AdvertisingModal'

interface IManageAdvertising {
    pubs: IPublicite[],
    onSubmit: (publicites: IPublicite[]) => void
}

export const ManageAdvertising = ({ pubs = [], onSubmit }: IManageAdvertising) => {
    const isMounted = useRef(false)
    const [showEdit, setShowEdit] = useState<boolean>(false)
    const [type, setType] = useState<'edit' | 'create'>('edit')
    const [publicites, setPublicites] = useState<IPublicite[]>(pubs)
    const [publicite, setPublicite] = useState<IPublicite | null>(null)


    useEffect(() => {
        if(isMounted.current == false) {
            isMounted.current = true
        } else if(isMounted.current == true) {
           onSubmit(publicites)
        }
    }, [publicites])

    const handleSelectPub = (pub: IPublicite) => {
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

    const handleSubmit = async(data: any, type: 'create' | 'edit') => {
        if(type == 'edit') {
            setPublicites(publicites => publicites.map((pub: IPublicite) => publicite?.numero_panneau == pub.numero_panneau ? data : pub))
        } else {
            setPublicites(publicites => [...publicites, data])
        }
    }

    return <>
        {((type == 'edit' && publicite != null) || (type == 'create' && publicite == null)) && <AdvertisingModal type={type} show={showEdit} publicite={publicite} handleClose={handleUnSelectPub} onValidate={handleSubmit}/>}
        <div className="d-flex justify-content-start mb-2"><Button variant="primary" onClick={setCreateMode}>Créer un panneau</Button></div>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Exercice</th>
                    <th>Code postal</th>
                    <th>N° rue</th>
                    <th>Rue</th>
                    <th>N°</th>
                </tr>
            </thead>
            <tbody>
                {publicites.length == 0 && <tr><td colSpan={5}>Aucune publicité</td></tr> }
                {publicites.map((publicite: IPublicite, index: number) => {
                    return <tr key={index} onClick={() => handleSelectPub(publicite)} style={{cursor: 'pointer'}}>
                        <td>{publicite.exercice_courant}</td>
                        <td>{publicite.rue.code_postal.cp}</td>
                        <td>{publicite.rue.code_rue}</td>
                        <td>{publicite.rue.nom_rue}</td>
                        <td>{publicite.adresse_numero}</td>
                    </tr>
                })}
            </tbody>
        </Table>
    </>
}