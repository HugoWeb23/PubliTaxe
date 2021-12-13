export interface IPrintData {
    date_echeance: string,
    date_impression: string,
    personne_contact: string,
    telephone_contact: string,
    mail_contact: string,
    options: {
        print_letter: boolean,
        print_declaration: boolean,
        print_form: boolean
    }

}