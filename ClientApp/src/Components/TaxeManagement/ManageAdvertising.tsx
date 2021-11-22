import { useState } from 'react'
import {
    Table
} from 'react-bootstrap'
import { apiFetch } from '../../Services/apiFetch'
import { IPublicite } from '../../Types/IPublicite'
import { EditAdvertising } from './EditAdvertising'

interface IManageAdvertising {
    pubs: IPublicite[],
    handleCreate: () => void
}

export const ManageAdvertising = ({ pubs = [], handleCreate }: IManageAdvertising) => {
    const [showEdit, setShowEdit] = useState<boolean>(false)
    const [publicites, setPublicites] = useState<IPublicite[]>(pubs)
    const [publicite, setPublicite] = useState<IPublicite | null>(null)

    const handleSelectPub = (pub: IPublicite) => {
        setPublicite(pub)
        setShowEdit(true)
    }

    const handleUnSelectPub = () => {
        setPublicite(null)
        setShowEdit(false)
    }

    const handleSubmit = async(data: any) => {
        console.log(data)
       setPublicites(publicites => publicites.map((pub: IPublicite) => publicite?.matricule_ciger == pub.matricule_ciger ? data : publicite))
    }

    return <>
        {publicite != null && <EditAdvertising show={showEdit} publicite={publicite} handleClose={handleUnSelectPub} onValidate={handleSubmit}/>}
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