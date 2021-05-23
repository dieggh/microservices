import { useState } from 'react'
import { fetchAux } from '../helpers/fetchAux';

const UseRequest = ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState(null);

    const doRequest = async () => {

        try {
            
            setErrors(null);

            const resp = await fetchAux(url, body, method);
            const data = await resp.json();

            if (data.errors) {
                setErrors(
                
                <div className="alert alert-danger">
                    <h4>Ooops...</h4>
                    <ul className="my-0">
                        {
                            data.errors.map(error => <li key={error.field}> {error.message} </li>)
                        }
                    </ul>
                </div>

                );
            }else{
                onSuccess(data);
            }
        } catch (error) {
            setErrors(
            <div className="alert alert-danger">
                <h4>Ooops...</h4>
                <ul className="my-0">
                    {
                       <li key={"all"}> Server Error </li>
                    }
                </ul>
            </div>
        )
        }

    };

    return {
        doRequest,
        errors
    }
}

export default UseRequest;