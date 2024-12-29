"use server"

export async function reteriveTranscript(videoIds) {
    let parsedTranscripts = []
    const YT_INITIAL_PLAYER_RESPONSE_RE = /ytInitialPlayerResponse\s*=\s*({.+?})\s*;\s*(?:var\s+(?:meta|head)|<\/script|\n)/;
    for (let videoId of videoIds) {

        let response = await fetch('https://www.youtube.com/watch?v=' + videoId)
        let body = await response.text();
        const playerResponse = body.match(YT_INITIAL_PLAYER_RESPONSE_RE);
        if (!playerResponse) {
            console.warn('Unable to parse playerResponse');
            return;
        }
        let player = JSON.parse(playerResponse[1]);

        if (parseInt(player.videoDetails.lengthSeconds) < 150)
            continue
        const metadata = {
            title: player.videoDetails.title,
            description: player.videoDetails.shortDescription,
            keywords: player.videoDetails.keywords,
        };

        // Get the tracks and sort them by priority
        const tracks = player.captions.playerCaptionsTracklistRenderer.captionTracks;
        tracks.sort(compareTracks);

        // Get the transcript
        response = await fetch(tracks[0].baseUrl + '&fmt=json3')
        let transcript = await response.json();

        const parsedTranscript = transcript.events
            // Remove invalid segments
            .filter(function (x) {
                return x.segs;
            })

            // Concatenate into single long string
            .map(function (x) {
                return x.segs
                    .map(function (y) {
                        return y.utf8;
                    })
                    .join(' ')
                    .replace(/[\u200B-\u200D\uFEFF]/g, '');
            })

        // Use 'result' here as needed

        parsedTranscripts.push({ transcript: parsedTranscript, data: metadata })
    }
    return parsedTranscripts
}

function compareTracks(track1, track2) {
    const langCode1 = track1.languageCode;
    const langCode2 = track2.languageCode;

    if (langCode1 === 'en' && langCode2 !== 'en') {
        return -1; // English comes first
    } else if (langCode1 !== 'en' && langCode2 === 'en') {
        return 1; // English comes first
    } else if (track1.kind !== 'asr' && track2.kind === 'asr') {
        return -1; // Non-ASR comes first
    } else if (track1.kind === 'asr' && track2.kind !== 'asr') {
        return 1; // Non-ASR comes first
    }

    return 0; // Preserve order if both have same priority
}


export const getVideosIds = async (channelId, videosCount) => {
    let ids = await fetch("https://www.googleapis.com/youtube/v3/search?key=" + process.env.YOUTUBE_API_KEY + "&channelId=" + channelId + "&part=id&order=date&maxResults=" + videosCount)
    console.log(ids.statusText, ids.status)
    if (!ids.ok)
        return { error: { code: ids.status, message: "Failled to get videos ids: " + ids.statusText } }
    ids = await ids.json()
    return ids.items.map(v => v.id.videoId)
}

export const getRawTranscripts = async (channelId, videosCount) => {
    try {
        let videoIds = await getVideosIds(channelId, videosCount)
        if (!videoIds.length)
            return videoIds
        console.log("videoIds", videoIds)
        let result = await reteriveTranscript(videoIds)
        if (!result.length)
            return result

        return result
    } catch (e) {
        console.log(e)
        return { message: "Failled: " + e }
    }
}

export const getChannelData = async channelId => {
    try {
        let data = await fetch("https://www.googleapis.com/youtube/v3/channels?part=snippet&id=" + channelId + "&fields=items%2Fsnippet%2Fthumbnails%2Fmedium,items%2Fsnippet%2Ftitle&key=" + process.env.YOUTUBE_API_KEY)
        if (!data.ok)
            return { error: { code: data.status, message: "Failled to get channel data: " + data.statusText } }
        data = await data.json()
        data = data.items[0].snippet
        return { id: channelId, youtuber: data.title, image: data.thumbnails.medium }
    } catch (e) {
        return { error: { code: "1", message: "Something wrong: " + e.message } }
    }
}

export const getChannelIdFromUsername = async username => {
    try {
        let data = await fetch("https://youtube.googleapis.com/youtube/v3/search?part=id&maxResults=1&fields=items(id(channelId))&q=" + username + "&type=channel&key=" + process.env.YOUTUBE_API_KEY)
        console.log(data)
        if (!data.ok)
            return { error: { code: data.status, message: "Failled to get channel id: " + data.statusText } }
        data = await data.json()
        console.log(data.items.forEach(i => console.log(i)), username)
        return data.items[0].id.channelId
    } catch (e) {
        return { error: { code: "1", message: "Something wrong: " + e.message } }
    }
}

export async function getGeneratedTranscript({ theme, description, minutesNumber, sources, rawTranscripts }) {
    try {
        const videoDetails = rawTranscripts.map(video => {
            const { title, keywords, description: videoDescription } = video.data;
            const transcriptText = video.transcript.join(' '); // Unisce tutte le frasi in un singolo blocco di testo

            return `### Video: ${title}\nKeywords: ${keywords.join(', ')}\nDescription: ${videoDescription}\nTranscript: ${transcriptText}`;
        }).join('\n\n');

        return await fetch("/api/ai", {
            method: "POST",
            body: {
                cache: {
                    contents: [
                        {
                            text: `### Video Analysis:\n${videoDetails}\n\n`,
                            description: ""
                        },
                        {
                            text: `### Sources:\n${sources.map((s, i) => "Source " + (i + 1) + ": \n" + s).join('\n\n---------\n\n')}\n\n=======\n`,
                            description: ""
                        },
                    ]
                },
                systemPrompt: `You are an expert YouTube scriptwriter. Your task is to create an original script based on the following specifications:

CONTENT:
- Main topic: ${theme}
- Description: ${description}
- Reference sources: [provided]
- Target duration: ${minutesNumber}

STYLE AND TONE:
- Analyze these elements in the provided reference transcripts:
  • Recurring narrative structure
  • Characteristic linguistic patterns
  • Narrative rhythm and dynamics
  • Typical transition elements
  • Characteristic opening/closing formulas

TECHNICAL REQUIREMENTS:
- Indicate main editing points
- Suggest moments for graphics/b-roll
- Specify timing for each section
- Highlight keywords for SEO

DELIVERABLE:
The script must include:
1. Initial hook
2. Segmented main body
3. Call-to-action
4. YouTube-optimized description
5. Suggested timestamps

Please maintain the distinctive elements of the reference style while creating original and unique content.`
            }
        })
    } catch (err) {
        return { error: err }
    }
}

export const editTranscript = async (cacheName, prompt) => {
    try {
        return await fetch("/api/ai", {
            method: "POST",
            body: {
                promptInput: prompt,
                cache: {
                    name: cacheName
                },
            }
        })
    } catch (err) {
        return { error: err }
    }
}