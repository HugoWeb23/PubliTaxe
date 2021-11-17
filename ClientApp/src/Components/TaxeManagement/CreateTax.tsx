import { TaxeForm } from "./TaxeForm"

export const CreateTax = () => {
    const handleCreate = (data: any) => {
        console.log(data)
    }
    return <TaxeForm type="create" onFormSubmit={handleCreate}/>
}