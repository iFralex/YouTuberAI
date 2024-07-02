"use client"

import { useEffect, useState } from 'react';
import { reteriveTranscript, getVideosIds } from './transcript';
import { useRouter } from 'next/navigation';

const TextInputWithButton = ({defaultValue = ""}) => {
    const [inputValue, setInputValue] = useState(defaultValue);
    const router = useRouter()

    const handleInputChange = (e) => {
        setInputValue(e.target.value)
    };

    const handleSubmit = () => {
        if (inputValue)
            router.push("/results/" + inputValue);
    };

    return (
        <div>
            <input style={{color: "black"}} type="text" value={inputValue} onChange={handleInputChange} />
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

const Results = ({ channelId }) => {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            let videosIds = await getVideosIds(channelId);
            let videos = await reteriveTranscript(videosIds);
            setVideos(videos);
        };

        fetchData();
    }, [channelId]);

    return (
        <div>
            {videos.map((video) => (
                <div key={video.data.id}>
                    <h1>{video.data.title}</h1>
                    <p>
                        {video.transcript.map((line, index) => (
                            <span key={index}>{line}</span>
                        ))}
                    </p>
                    <div style={{ margin: '30px 0' }}></div>
                    <div>
                        <h2>Descrizione</h2>
                        <p>{video.data.description}</p>
                    </div>
                    <div>
                        <h2>KeyWords</h2>
                        <p>{video.data.keywords.join(', ')}</p>
                    </div>
                    <div style={{ margin: '50px 0' }}></div>
                </div>
            ))}
        </div>
    );
};


export default TextInputWithButton;



const Reslts = async channelId => {
    let videosIds = await getVideosIds("UCHi6Q3Z-5oJUC691WLlSntA")
    let videos = await reteriveTranscript(videosIds)
    return (
        <div>
            {videos.map(video =>
            (<div>
                <h1>{video.data.title}</h1>
                <p>{video.transcript.map(line =>
                    <>{line}</>
                )}</p>
                <div style={{ margin: "30px 0" }}></div>
                <div>
                    <h2>Descrizione</h2>
                    {video.data.description}
                </div>
                <div>
                    <h2>KeyWords</h2>
                    {video.data.keywords}
                </div>
                <div style={{ margin: "50px 0" }}></div>
            </div>))}
        </div>
    );
}

