import {
    Placeholder,
    PlaceholderButton
} from 'react-bootstrap'

export const TablePlaceholder = () => {
    return <>
    <tr>
    <td colSpan={5}><Placeholder animation="glow" size="lg"/></td>
    </tr>
    <tr>
    <td colSpan={5}><Placeholder animation="glow" size="lg"/></td>
    </tr>
    <tr>
    <td colSpan={5}><Placeholder><Placeholder animation="glow" size="lg"/></Placeholder></td>
    </tr>
    <tr>
    <td colSpan={5}><Placeholder animation="glow" size="lg"/></td>
    </tr>
    <tr>
    <td colSpan={5}><Placeholder.Button xs={4} aria-hidden="true" /></td>
    </tr>
    </>
}