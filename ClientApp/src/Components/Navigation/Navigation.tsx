import {
    Navbar,
    Nav,
    NavDropdown
} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap';

export const Navigation = () => {
    return <Navbar expand bg="dark" variant="dark" className="px-2">
    <Navbar.Brand href="#home">PubliTaxe</Navbar.Brand>
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
    <Nav className="me-auto">
    <LinkContainer to="/"><Nav.Link>Gestion</Nav.Link></LinkContainer>
      <Nav.Link href="#features">Outils</Nav.Link>
    </Nav>
    <Nav>
    <NavDropdown title={"Hugo Hourriez"} id="collasible-nav-dropdown" align="end">
        <NavDropdown.Item href="#action/3.1">Gestion du compte</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="#action/3.4">Déconnexion</NavDropdown.Item>
      </NavDropdown>
    </Nav>
    </Navbar.Collapse>
  </Navbar>
}