import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { db } from '../firebase';
import Tweet from './tweet';
import { Unsubscribe } from 'firebase/auth';

export interface ITweet {
    id: string;
    photo?: string;
    tweet: string;
    userId: string;
    username: string;
    createdAt: number;
}
const Wrapper = styled.div`
    display: flex;
    gap: 10px;
    flex-direction: column;
    overflow-y: scroll;
`;

export default function Timeline() {
    /** 트윗 인터페이스 타입 지정 */
    const [tweets, setTweet] = useState<ITweet[]>([]);
    /** firebase 에 tweets 데이터 불러오는 쿼리 */

    /** 브라우저 렌더링시 트윗 데이터가져옴 */
    useEffect(() => {
        let unsubscribe: Unsubscribe | null = null;
        const fetchTweets = async () => {
            /** firebase db 의 tweets 컬렉션 연결 쿼리문 */
            const tweetsQuery = query(collection(db, 'tweets'), orderBy('createdAt', 'desc'), limit(25));
            /** 쿼리에 해당하는 문서 가져오기 */
            // const snapshot = await getDocs(tweetsQuery);
            // /** tweets 컬렉션을 map 을 이용해 하나씩 data들을 뽑아내서 tweets 에 저장 */
            // const tweets = snapshot.docs.map((doc) => {
            //     const { tweet, createdAt, userId, username, photo } = doc.data();
            //     return {
            //         id: doc.id,
            //         tweet,
            //         createdAt,
            //         userId,
            //         username,
            //         photo,
            //     };
            // });

            /** 실시간 트윗 데이터 받아와서 보여주는코드 */
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
                setTweet(tweets);
            });
        };
        fetchTweets();
        return () => {
            unsubscribe && unsubscribe();
        };
    }, []);
    return (
        <>
            <Wrapper>
                {tweets.map((tweet) => (
                    <Tweet key={tweet.id} {...tweet} />
                ))}
            </Wrapper>
        </>
    );
}
