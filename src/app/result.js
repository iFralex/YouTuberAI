import { reteriveTranscript, getVideosIds } from "@/app/transcript"

export default async function Result({ _params }) {
    console.log("param", _params)
    let videosIds = await getVideosIds(_params.id)
    let videos = await reteriveTranscript(videosIds)
    return (
        <div style={{ padding: "20px" }}>
            {videos.map(video =>
            (<div style={{color: "hite"}}>
                <div>
                    <h1>{video.data.title}</h1>
                    {video.transcript.map(line =>
                        <p>{line}</p>
                    )}
                </div>
                <div style={{ margin: "30px 0" }}></div>
                <div>
                    <h2>Descrizione</h2>
                    {video.data.description}
                </div>
                <div>
                    <h2>KeyWords</h2>
                    {video.data.keywords.map(word => <span style={{paddingRight: 10}}>{word}</span>)}
                </div>
                <div style={{ margin: "50px 0" }}></div>
            </div>))}
        </div>
    );
}