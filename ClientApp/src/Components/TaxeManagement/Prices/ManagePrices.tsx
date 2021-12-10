import { useEffect, useState } from "react"
import { usePrices } from "../../Hooks/PricesHook"
import {
    Container,
    Table,
    Button
} from 'react-bootstrap'
import { PlusIcon } from "../../UI/PlusIcon"
import { Pencil } from "../../UI/Pencil"
import { toast } from 'react-toastify';
import { IPrice } from "../../../Types/IPrice"
import { PriceModal } from "./PriceModal"

export const ManagePrices = () => {
    const {prices, getAll} = usePrices()
    const [selectedPrice, setSelectedPrice] = useState<{price: IPrice, show: boolean, type: string}>({price: {} as IPrice, show: false, type: 'create'})
    const [loader, setLoader] = useState<boolean>(true)

    useEffect(() => {
        (async () => {
            await getAll()
            setLoader(false)
        })()
    }, [])

    const handleSubmit = async({type, data}: any) => {
       console.log(type, data)
    }

    return <>
        <PriceModal element={selectedPrice} handleClose={() => setSelectedPrice(price => ({...price, show: false, type: 'create'}))} onSubmit={handleSubmit}/>
        <Container fluid="sm">
            <div className="d-flex justify-content-between align-items-center">
            <h2 className="mt-2 mb-3">Gestion des exercices </h2>
            <div className="link"><PlusIcon/> Nouvel exercice</div>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Prix unitaire enseigne non lumineuse</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {loader == false && prices.map((price: IPrice, index: number) => {
                        return <tr>
                            <td>{price.prix_unitaire_enseigne_non_lumineuse}</td>
                            <td><Button size="sm" onClick={() => setSelectedPrice({price: price, show: true, type: 'edit'})}><Pencil/></Button></td>
                        </tr>
                    })}
                </tbody>
            </Table>
        </Container>
    </>
}