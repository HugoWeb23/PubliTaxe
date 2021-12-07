export interface IPrintData {
    deadline: string,
    print_date: string,
    contact_person: string,
    phone: string,
    mail: string,
    options: {
        print_letter: boolean,
        print_declaration: boolean,
        print_form: boolean
    }

}