import Router from 'next/router';
import { useEffect } from 'react'
import useRequest from '../../hooks/use-request'

export default function Signout() {

    const { doRequest } = useRequest({
        url: '/users/signout',
        method: 'post',
        body: {},
        onSuccess: () => Router.push('/')
    });

    useEffect(() =>{
        doRequest();
    }, []);

    return (
        <div>
            Signing you out...
        </div>
    )
}


