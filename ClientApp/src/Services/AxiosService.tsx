import axios from 'axios'

interface IErrors {
    field: any,
    message: string
}

export class ApiErrors {
    errors: any
    constructor(errors: any) {
        this.errors = errors
    }

    get globalErrors() {
        if(this.errors.globalErrors) {
            const errors: any[] = []
            this.errors.globalErrors.forEach((error: any) => errors.push(error.message))
            return errors;
        }
        return []
    }

    get errorsPerField() {
        if(this.errors.errorsPerField) {
            const errors: any[] = [];
            Object.entries(this.errors.errorsPerField).map(([key, value]: any) => errors.push({ ['field']: key, ['message']: value[0] }));
            return errors;
        }
        return []
       
    }
}

export const AxiosService = async (endpoint: string, options = {} as any) => {
    const token = null;
    options = {
        headers: {
            Accept: 'application/json'
        },
        ...options
    }

    if (options.body !== null && !(options.body instanceof FormData)) {
        options.headers['Content-type'] = 'application/json'
    }

    const response = await axios({url: `https://localhost:5001/${endpoint}`, ...options})
    if (response.status == 204) {
        return null;
    }

    if (response.status != 200) {
        if(response.data.error) {
            throw new ApiErrors({error: response.data.error})
        }
        if (response.data.errors) {
            throw new ApiErrors({errorsPerField: response.data.errors})
        } if (response.data.globalErrors) {
            throw new ApiErrors({globalErrors: response.data.globalErrors})
        }
    }
}