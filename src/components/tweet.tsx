import styled from 'styled-components';
import { ITweet } from './timeline';
import { auth, db, storage } from '../firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { useState } from 'react';
import EditTweetForm from './edit-tweet.form';

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: 3fr 1fr;
    padding: 20px;
    border: 2px solid rgba(255, 255, 255, 0.5);
    border-radius: 15px;
    margin: 20px;
`;

const Column = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;
const Photo = styled.img`
    margin-left: 10px;
    width: 100px;
    height: 100px;
    border-radius: 15px;
`;
const Username = styled.span`
    font-weight: 600;
    font-size: 15px;
`;
const Payload = styled.p`
    word-break: break-all;
    margin: 10px 0px;
    font-size: 14px;
`;
const Btn = styled.div`
    margin-top: auto;
`;
const DeleteBtn = styled.button`
    background-color: tomato;
    color: white;
    font-weight: 600;
    border: none;
    font-size: 12px;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
`;

const EditBtn = styled.button`
    background-color: #1d9bf0;
    color: white;
    font-weight: 600;
    border: 0;
    font-size: 12px;
    padding: 5px 10px;
    text-transform: uppercase;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 5px;
`;

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
    const user = auth.currentUser;
    const [edit, setEdit] = useState(false);
    const onDelete = async () => {
        const ok = confirm('정말 삭제하시겠습니까?');
        if (!ok || user?.uid != userId) return;
        try {
            await deleteDoc(doc(db, 'tweets', id));
            if (photo) {
                const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
                await deleteObject(photoRef);
            }
        } catch (e) {
            console.log(e);
        }
    };
    const onEdit = async () => {
        if (user?.uid != userId) return;
        setEdit(true);
    };

    return (
        <Wrapper>
            {!edit ? (
                <Column>
                    <Username>{username}</Username>
                    <Payload>{tweet}</Payload>
                    <Btn>
                        {user?.uid === userId ? <DeleteBtn onClick={onDelete}>삭제</DeleteBtn> : null}
                        {user?.uid === userId ? <EditBtn onClick={onEdit}>수정</EditBtn> : null}
                    </Btn>
                </Column>
            ) : (
                <Column>
                    <EditTweetForm tweet={tweet} photo={photo} id={id} setEdit={setEdit} />
                </Column>
            )}

            <Column>{photo ? <Photo src={photo} /> : null}</Column>
        </Wrapper>
    );
}
