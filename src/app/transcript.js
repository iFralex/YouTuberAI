export async function reteriveTranscript(videoIds) {
    let parsedTranscripts = []
    const YT_INITIAL_PLAYER_RESPONSE_RE = /ytInitialPlayerResponse\s*=\s*({.+?})\s*;\s*(?:var\s+(?:meta|head)|<\/script|\n)/;
    for (let videoId of videoIds) {
        console.log(videoId)
        let response = await fetch('https://www.youtube.com/watch?v=' + videoId)
        let body = await response.text();
        const playerResponse = body.match(YT_INITIAL_PLAYER_RESPONSE_RE);
        if (!playerResponse) {
            console.warn('Unable to parse playerResponse');
            return;
        }
        let player = JSON.parse(playerResponse[1]);
        console.log(player.videoDetails)
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
        console.log('EXTRACTED_TRANSCRIPT');
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


export const getVideosIds = async channelId => {
    console.log("channelId:", channelId)
    let ids = await fetch("https://www.googleapis.com/youtube/v3/search?key=AIzaSyA4SxhPobYVbiNpM6To9xXFmfs8Pz-YuPE&channelId=" + channelId + "&part=id&order=date&maxResults=50")
    if (!ids.ok)
        return []
    ids = await ids.json()
    console.log(ids)
    return ids.items.map(v => v.id.videoId)
}