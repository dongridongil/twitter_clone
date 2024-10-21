import styled from 'styled-components';
import { auth, db, storage } from '../firebase';
import React, { useEffect, useState } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { collection, getDocs, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { Unsubscribe, updateProfile } from 'firebase/auth';
import { ITweet } from '../components/timeline';
import Tweet from '../components/tweet';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
`;
const AvatarUpload = styled.label`
    width: 80px;
    overflow: hidden;
    height: 80px;
    border-radius: 50%;
    background-color: #1d9bf0;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
        width: 50px;
    }
`;
const AvatarImg = styled.img`
    width: 100%;
`;
const AvatarInput = styled.input`
    display: none;
`;
const Name = styled.span`
    font-size: 22px;
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    svg {
        cursor: pointer;
        width: 16px;
        margin-left: 8px;
    }
`;

const Tweets = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
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
    border-radius: 8px;
    background-color: white;
    position: fixed;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: black;
    width: 500px;
    height: 180px;
    top: 150px;

    span {
        cursor: pointer;
        position: absolute;
        padding: 18px;
        top: 0;
        right: 0;
    }
    input {
        margin-top: 12px;
    }
`;

export default function Profile() {
    const user = auth.currentUser;
    const [avatar, setAvatar] = useState(user?.photoURL);
    const [tweets, setTweets] = useState<ITweet[]>([]);
    const [openModal, setOpenmodal] = useState(false);
    const [profileName, setProfileName] = useState(user?.displayName);
    const changeAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!user) return;
        if (files && files.length === 1) {
            const file = files[0];
            const locationRef = ref(storage, `avatars/${user?.uid}`);
            const result = await uploadBytes(locationRef, file);
            const avatarurl = await getDownloadURL(result.ref);
            setAvatar(avatarurl);
            await updateProfile(user, {
                photoURL: avatarurl,
            });
        }
    };

    useEffect(() => {
        let unsubscribe: Unsubscribe | null = null;

        const fetchTweets = async () => {
            const tweetsQuery = query(
                collection(db, 'tweets'),
                where('userId', '==', user?.uid),
                orderBy('createdAt', 'desc'),
                limit(25)
            );
            const snapshot = await getDocs(tweetsQuery);
            const tweets = snapshot.docs.map((doc) => {
                const { tweet, createdAt, userId, username, photo } = doc.data();
                return {
                    id: doc.id,
                    tweet,
                    createdAt,
                    userId,
                    username,
                    photo,
                };
            });

            setTweets(tweets);

            //(언마운트시에는 실행이 안되게 하기위해서)
            unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
                const tweets = snapshot.docs.map((doc) => {
                    const { tweet, createdAt, userId, username, photo } = doc.data();
                    return {
                        id: doc.id,
                        tweet,
                        createdAt,
                        userId,
                        username,
                        photo,
                    };
                });
                setTweets(tweets);
            });
        };

        fetchTweets();
        // useEffect 클린업코드
        return () => {
            unsubscribe && unsubscribe();
        };
    }, []);
    const nameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setProfileName(value);
    };
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (!user) return;
            await updateProfile(user, {
                displayName: profileName,
            });
            setOpenmodal(false);
        } catch (e) {
            console.log(e);
        }
    };
    return (
        <Wrapper>
            <AvatarUpload htmlFor="avatar">
                {avatar ? (
                    <AvatarImg src={avatar} />
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            fill-rule="evenodd"
                            d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                            clip-rule="evenodd"
                        />
                    </svg>
                )}
            </AvatarUpload>
            <AvatarInput onChange={changeAvatar} id="avatar" type="file" accept="image/*" />
            <Name>
                {user?.displayName ? user.displayName : 'Guest'}{' '}
                <div onClick={() => setOpenmodal(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                        <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                    </svg>
                </div>
            </Name>
            {openModal && (
                <Back>
                    <Form onSubmit={onSubmit}>
                        <span onClick={() => setOpenmodal(false)}>❌</span>
                        <Input
                            name="profile"
                            type="text"
                            value={profileName ? profileName : ''}
                            onChange={nameChange}
                            placeholder="바꾸실 프로필명을 입력하세요"
                        />
                        <Input name="submit" type="submit" value={'확인'} />
                    </Form>
                </Back>
            )}
            <Tweets>
                {tweets.map((tweet) => (
                    <Tweet key={tweet.id} {...tweet} />
                ))}
            </Tweets>
        </Wrapper>
    );
}
