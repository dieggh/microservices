const env = '/api';

const fetchAux = (endpoint, data, method = 'GET', ctx) => {
    
    let url = `${env}${endpoint}`;
    const headers = new Headers();
    let reqHeaders = null;

    if(typeof window === 'undefined'){
        'ingress-nginx-controller'
        url = `http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api${endpoint}`;
        headers.append('Host', 'ticketing.dev')
        reqHeaders = ctx.req.headers;
    }
    
    if(method === 'GET'){
        return fetch(url, {
            method: method,
            headers: reqHeaders === null ? headers : reqHeaders
        })
    }else{
        headers.append('Content-Type', 'application/json');

        return fetch(url, {
            method: method,
            body: JSON.stringify(data),
            headers: reqHeaders === null ? headers : reqHeaders
        })
    }    
}

export { fetchAux };