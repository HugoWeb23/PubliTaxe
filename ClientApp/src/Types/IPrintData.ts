import { IInformation } from "./IInformations";

export interface IPrintData extends IInformation {
    date_echeance: string,
    date_impression: string,
    personne_contact: string,
    telephone_contact: string,
    mail_contact: string,
    date_proces_verbal: string,
    options: {
        print_letter: boolean,
        print_declaration: boolean,
        print_form: boolean,
        print_minutes: boolean
    }

}