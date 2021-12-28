import settings from '../../settings.json'
interface IErrors {
    field: any,
    message: string
}

export class ApiErrors {
    errors: any
    constructor(errors: any) {
        this.errors = errors
    }

    get singleError() {
        return {error : this.errors.singleError};
    }

    get errorsPerField() {
        if (this.errors.errorsPerField) {
            const errors: any[] = [];
            Object.entries(this.errors.errorsPerField).map(([key, value]: any) => errors.push({ ['field']: key, ['message']: value[0] }));
            return errors;
        }
        return []
    }
}

export const apiFetch = async (endpoint: string, options = {} as any) => {
    const token = null;
    options = {
        headers: {
            Accept: 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        ...options
    }

    if (options.body !== null && !(options.body instanceof FormData)) {
        options.headers['Content-type'] = 'application/json'
    }


    const response = await fetch(`${process.env.NODE_ENV === 'development' ? settings.Development_url : settings.Production_url}/api${endpoint}`, options)

    if (response.status == 204) {
        return null;
    }

    const responseData = await response.json();
    if (response.ok) {
        return responseData
    } else {
        if (responseData.errors) {
            throw new ApiErrors({ errorsPerField: responseData.errors })
        } if (responseData.error) {
            throw new ApiErrors({ singleError: responseData.error})
        }
    }

}