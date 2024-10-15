import { GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import styled from 'styled-components';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Button = styled.span`
    background-color: white;
    margin-top: 50px;
    font-weight: 500;
    padding: 10px 20px;
    border-radius: 50px;
    border: 0;
    display: flex;
    gap: 5px;
    justify-content: center;
    align-items: center;
    width: 100%;
    color: black;
    cursor: pointer;
`;

const Logo = styled.img`
    height: 25px;
`;

export default function GithubButton() {
    const navigate = useNavigate();
    const onClick = async () => {
        try {
            const provider = new GithubAuthProvider();
            await signInWithPopup(auth, provider);
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <Button onClick={onClick}>
            <Logo src="/github-mark.svg" />
            깃허브로 시작하기
        </Button>
    );
}
