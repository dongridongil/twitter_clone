import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import React, { useState } from 'react';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { Error, Form, Input, Switcher, Title, Wrapper } from '../components/auth-component';
import GithubButton from '../components/github-btn';
import PasswordReset from '../components/password-reset';

export default function CreateAccount() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { name, value },
        } = e;

        if (name === 'name') {
            setName(value);
        } else if (name === 'email') {
            setEmail(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    };
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        if (isLoading || name === '' || email === '' || password === '') return;
        try {
            setIsLoading(true);
            const credentials = await createUserWithEmailAndPassword(auth, email, password);
            console.log(credentials);
            await updateProfile(credentials.user, {
                displayName: name,
            });
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
            <Title>JOIN X</Title>
            <Form onSubmit={onSubmit}>
                <Input name="name" onChange={onChange} value={name} placeholder="Name" type="text" required />
                <Input name="email" onChange={onChange} value={email} placeholder="Email" type="email" required />
                <Input
                    name="password"
                    onChange={onChange}
                    value={password}
                    placeholder="password"
                    type="password"
                    required
                />
                <Input
                    name="submit"
                    type="submit"
                    placeholder="생성"
                    value={isLoading ? 'Loading...' : 'Create Account'}
                />
            </Form>
            {error !== '' ? <Error>{error}</Error> : null}
            <Switcher>
                이미 계정이 있으세요? <Link to="/login">로그인 하러 가기 &rarr;</Link>
            </Switcher>
            <GithubButton />
            <PasswordReset />
        </Wrapper>
    );
}
