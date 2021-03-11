import React from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Auxiliary from '../Auxiliary/Auxiliary';
import useHttpErrorHandler from '../../hooks/http-error-handler';

const withErrorHandler = (WrappedComponent, axios) => {
    return props => {
        const [error, clearError] = useHttpErrorHandler(axios); //axios is an argument for httpClient that the custom hook expects

        return (
            <Auxiliary>
            <Modal show={error} modalClosed={clearError}>
                {error ? error.message : null}
            </Modal>
            <WrappedComponent {...props} />
        </Auxiliary>
        );
    }
}

export default withErrorHandler;