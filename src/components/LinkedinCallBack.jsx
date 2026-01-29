import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from './common/useAuth';
import { useNavigate } from 'react-router-dom';

const LinkedinCallbackHandler = () => {
    const [message, setMessage] = useState('Connecting to LinkedIn...');
    const [status, setStatus] = useState(null);
    const { apiurl } = useAuth();
    const requestSentRef = useRef(false); // 👈 flag to ensure only one request
    const navigate = useNavigate();

    useEffect(() => {
        // Prevent duplicate API calls
        if (requestSentRef.current) return;
        requestSentRef.current = true;

        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const state = params.get('state');
        const error = params.get('error');

        if (error) {
            setMessage('Authorization denied. Please try again.');
            setStatus('error');
            return;
        }

        if (!code || !state) {
            setMessage('Invalid callback parameters.');
            setStatus('error');
            return;
        }

        fetch(`${apiurl}/api/linkedin/callback/?code=${code}&state=${state}`, {
            method: 'GET',
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === true) {
                    setMessage('LinkedIn account successfully connected and verified ✅');
                    setStatus('success');
                } else if (data.reason === 'NO_PAGE') {
                    setMessage('Connected account does not manage any LinkedIn Page.');
                    setStatus('warning');
                } else {
                    setMessage(data.message || 'LinkedIn connection failed.');
                    setStatus('error');
                }
            })
            .catch((err) => {
                console.error(err);
                setMessage('Something went wrong while connecting. Please try again.');
                setStatus('error');
            });
    }, [apiurl]);

    return (
        <div style={{ textAlign: 'center', paddingTop: '50px' }}>
            <h2>{message}</h2>
            {status === 'success' && <p style={{ color: 'green' }}>You may now return to your dashboard.
                <button onClick={() => navigate('')}>
                    Home
                </button>
            </p>}
            {status === 'error' && <p style={{ color: 'red' }}>If the problem persists, contact support.</p>}
            {status === 'warning' && <p style={{ color: 'orange' }}>Please connect an account that manages a Page.</p>}
        </div>
    );
};

export default LinkedinCallbackHandler;
