import React, { useState, useEffect, useReducer, useCallback } from 'react';
import axios from 'axios';

import { Spinner, Alert } from 'react-bootstrap';

const dataFetchReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_START':
            return {
                ...state,
                isLoading: true,
                error: false
            };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                isLoading: false,
                error: false,
                data: action.payload
            };
        case 'FETCH_ERROR':
            const { status, statusText, data } = action.payload;
            return {
                ...state,
                isLoading: false,
                error: { status, statusText, data }
            };
        case 'SET_DATA':
            return {
                ...state,
                data: action.payload
            };
        default:
            throw new Error();
    }
};

const useDataFetcher = (initialUrl, initialData = null) => {
    const [url, setUrl] = useState(initialUrl);
    const [isforced, doForce] = useState(initialUrl);

    const [state, dispatch] = useReducer(dataFetchReducer, {
        isLoading: false,
        error: false,
        data: initialData
    });

    useEffect(() => {
        let cancel = false;

        const fetchDataFromServer = async () => {
            dispatch({ type: 'FETCH_START' });
            try {
                const result = await axios(url);
                if (!cancel) {
                    dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
                }
            } catch (error) {
                if (!cancel) {
                    dispatch({ type: 'FETCH_ERROR', payload: error.response });
                }
            }
        };

        fetchDataFromServer();
        return () => {
            cancel = true;
        }
    }, [url, isforced]);

    const setData = useCallback((data) => {
        dispatch({ type: 'SET_DATA', payload: data });
    }, []);

    const fetchData = useCallback((url, options = {}) => {
        setUrl(url);
        if (options.force) {
            doForce(Date.now());
        }
    }, []);

    return [state, { fetchData, setData }];
}

export const ErrorMessage = ({ message, error }) => {
    if (error) {
        return <Alert variant={"danger"}>{message}: {error.status} - {error.statusText}</Alert>
    }
    return null;
}

export const FetchSpinner = ({ isLoading }) => {
    return isLoading ? <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
    </Spinner> : null;
}

export default useDataFetcher;
