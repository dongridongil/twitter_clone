import { sendPasswordResetEmail } from 'firebase/auth';
import styled from 'styled-components';
import { auth } from '../firebase';
import { useState } from 'react';

const Button = styled.span`
    margin-top: 4px;
    font-weight: 500;
    padding: 10px 20px;
    display: flex;
    gap: 5px;
    justify-content: center;
    align-items: center;
    width: 100%;
    color: black;
    cursor: pointer;
`;

const Text = styled.span`
    font-size: 14px;
    color: red;
`;

const Input = styled.input`
    padding: 10px 20px;
    border-radius: 50px;
    border: none;
    width: 80%;
    font-size: 16px;
    &[type='submit'] {
        cursor: pointer;
        width: 15%;
        &:hover {
            opacity: 0.8;
        }
    }
`;

const Form = styled.form`
    border-radius: 10px;
    background-color: white;
    position: fixed;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: black;

    width: 500px;
    height: 160px;
    top: 150px;

    span {
        cursor: pointer;
        display: flex;
        margin-left: auto;
        padding: 12px;
    }
    input {
        margin-top: auto;
        margin-bottom: 15px;
    }
`;
const Back = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 100;
`;

export default function PasswordReset() {
    const [email, setEmail] = useState('');
    const [openModal, setOpenModal] = useState(false);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        if (name === 'email') {
            setEmail(value);
        }
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await sendPasswordResetEmail(auth, email);
            alert('제출이 완료되었습니다.');
            setOpenModal(false);
        } catch (e) {
            console.log(e);
        } finally {
        }
    };
    return (
        <>
            <Button onClick={() => setOpenModal(true)}>
                <Text>GITHUB 비밀번호를 잊어버리셨나요?</Text>
            </Button>
            {openModal && (
                <Back>
                    <Form onSubmit={onSubmit}>
                        <span onClick={() => setOpenModal(false)}>❌</span>

                        <Input
                            name="email"
                            onChange={onChange}
                            type="email"
                            value={email}
                            placeholder="이메일 입력시 비밀번호 초기화 메일 발송"
                        />
                        <Input name="submit" type="submit" value={'확인'} />
                    </Form>
                </Back>
            )}
        </>
    );
}
