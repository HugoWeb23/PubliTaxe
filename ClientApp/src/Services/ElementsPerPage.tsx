import Form from 'react-bootstrap/Form'

interface IElementsPerPage {
    elementsPerPage: number,
    onChange: (elements: number) => void
}

export const ElementsPerPage = ({ elementsPerPage, onChange }: IElementsPerPage) => {
    return <Form>
        <div className="d-flex align-items-center">
            <Form.Label className="me-1" htmlFor="numberofresults" column="sm">
                Afficher
            </Form.Label>
            <Form.Select id="numberofresults" size="sm" onChange={(e) => onChange(parseInt(e.target.value, 10))}>
                {[2, 5, 10, 15, 25, 50].map((n: number, index: number) => {
                    return <option key={index} value={n} selected={elementsPerPage == n}>{`${n} éléments`}</option>
                })}
            </Form.Select>
        </div>
    </Form>
}