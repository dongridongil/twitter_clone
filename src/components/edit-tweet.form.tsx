import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from '../firebase';
import styled from 'styled-components';

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const TextArea = styled.textarea`
    border: 2px solid white;
    padding: 20px;
    border-radius: 20px;
    font-size: 16px;
    color: white;
    background-color: black;
    width: 100%;
    resize: none;
    &::placeholder {
        font-size: 16px;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
            'Open Sans', 'Helvetica Neue', sans-serif;
    }
    &:focus {
        outline: none;
        border-color: #1d9bf0;
    }
`;

const AttachFilebutton = styled.label`
    padding: 10px 0px;
    color: #1d9bf0;
    text-align: center;
    border-radius: 20px;
    border: 1px solid #1d9bf0;
    cursor: pointer;
    font-size: 14px;
`;
const AttachFileInput = styled.input`
    display: none;
`;

const SubmitButton = styled.input`
    background-color: #1d9bf0;
    color: white;
    border: none;
    padding: 10px 0px;
    border-radius: 20px;
    font-size: 14px;
    cursor: pointer;
    &:hover,
    &:active {
        opacity: 0.8;
    }
`;

export interface ITweet {
    id: string;
    photo?: string;
    tweet: string;
    setEdit: (edit: boolean) => void;
}

export default function EditTweetForm({ photo, tweet, id, setEdit }: ITweet) {
    const user = auth.currentUser;
    const [isLoading] = useState(false);
    const [editTweet, setEditTweet] = useState(tweet);
    const [editFile, setFile] = useState<File | null>(null);

    const onEditTweet = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const changetweet = e.target.value;
        setEditTweet(changetweet);
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const ok = confirm('정말 수정 하시겠습니까?');
        if (editTweet.length > 500) return alert('글자수초과');
        if (ok && editTweet.length < 500) {
            const updateRef = doc(db, 'tweets', id);
            await updateDoc(updateRef, {
                tweet: editTweet,
            });

            if (editFile) {
                if (photo) {
                    const photoRef = ref(storage, `tweets/${user?.uid}/${id}`);
                    await deleteObject(photoRef);
                }
                const locationRef = ref(storage, `tweets/${user?.uid}/${id}`);
                const result = await uploadBytes(locationRef, editFile);
                const url = await getDownloadURL(result.ref);

                await updateDoc(updateRef, {
                    photo: url,
                });
            }
            setFile(null);
            setEdit(false);
        } else {
            setEditTweet(tweet);
            setEdit(false);
        }
    };
    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (files && files.length === 1 && files?.[0].size < 1048576) {
            setFile(files[0]);
        }

        if (files && files.length > 0 && files[0].size > 1048576) {
            alert('에러');
        }
    };
    return (
        <Form onSubmit={onSubmit}>
            <TextArea
                rows={5}
                maxLength={200}
                onChange={onEditTweet}
                value={editTweet}
                placeholder="수정할 문자를 입력하세요"
                required
            />
            <AttachFilebutton htmlFor="editfile">{editFile ? 'Photo FIXED ✅' : 'Change photo'}</AttachFilebutton>
            <AttachFileInput onChange={onFileChange} type="file" id="editfile" accept="image/*" />
            <SubmitButton type="submit" value={isLoading ? '수정중...' : '수정하기'} />
        </Form>
    );
}
