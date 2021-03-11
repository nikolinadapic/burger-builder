import { useState, useEffect } from 'react';

const useHttpErrorHandler = httpClient => {
    const [error, setError] = useState(null);

        //gives a warning, written instead of componentWillMount
        const reqInterceptor = httpClient.interceptors.request.use(req => {
            setError(null);
            return req;
        });
        const resInterceptor = httpClient.interceptors.response.use(res => res, err => {
            setError(err);
        });

        //written instead of componentWillUnmount
        useEffect(() => {
            return () => { //this is a cleanup (cleans up whenever interceptors change) function, runs when the component unmounts
                httpClient.interceptors.request.eject(reqInterceptor);
                httpClient.interceptors.response.eject(resInterceptor);
            }
        }, [reqInterceptor, resInterceptor, httpClient.interceptors.request, httpClient.interceptors.response]);

        const errorConfirmedHandler = () => {
            setError(null);
        }

        return [error, errorConfirmedHandler];
};
export default useHttpErrorHandler;