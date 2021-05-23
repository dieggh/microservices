const env = '/api';

const fetchAux = (endpoint, data, method = 'GET') => {

    if(method === 'GET'){
        return fetch(`${env}/${endpoint}`, {
            method: method            
        })
    }else{
        return fetch(`${env}/${endpoint}`, {
            method: method,
            body: JSON.stringify(data),
            headers:{
                'Content-Type': 'application/json'
            }     
        })
    }    
}

export { fetchAux };