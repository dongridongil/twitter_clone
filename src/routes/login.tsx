import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Error, Form, Input, Switcher, Title, Wrapper } from '../components/auth-component';
import GithubButton from '../components/github-btn';
import PasswordReset from '../components/password-reset';

export default function Login() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { name, value },
        } = e;
        if (name === 'email') {
            setEmail(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    };
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        if (isLoading || email === '' || password === '') return;
        try {
            setIsLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (e) {
            if (e instanceof FirebaseError) {
                setError(e.message);
            }
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <Wrapper>
            <Title>LOGIN X</Title>
            <Form onSubmit={onSubmit}>
                <Input name="email" onChange={onChange} value={email} placeholder="Email" type="email" required />
                <Input
                    name="password"
                    onChange={onChange}
                    value={password}
                    placeholder="password"
                    type="password"
                    required
                />
                <Input name="submit" type="submit" placeholder="생성" value={isLoading ? 'Loading...' : '로그인'} />
            </Form>
            {error !== '' ? <Error>{error}</Error> : null}
            <Switcher>
                계정이 없으세요? <Link to="/create-account">계정생성 &rarr;</Link>
            </Switcher>
            <GithubButton />
            <PasswordReset />
        </Wrapper>
    );
}
