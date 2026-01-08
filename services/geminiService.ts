import { SearchResult, VideoMetadata } from "../types";

// We use noembed.com as a CORS-friendly proxy for YouTube oEmbed data
const OEMBED_ENDPOINT = "https://noembed.com/embed?url=";

const getYouTubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export const analyzeShortsUrl = async (url: string): Promise<SearchResult> => {
  try {
    // 1. Extract Video ID and force standard URL format
    // oEmbed services handle 'watch?v=' much better than 'shorts/' URLs
    const videoId = getYouTubeId(url);
    
    let fetchUrl = url;
    if (videoId) {
      fetchUrl = `https://www.youtube.com/watch?v=${videoId}`;
    }

    const response = await fetch(`${OEMBED_ENDPOINT}${encodeURIComponent(fetchUrl)}`);
    const data = await response.json();

    if (data.error) {
       // Fallback: If oEmbed fails, we construct basic data using the ID
       return {
         metadata: {
           title: "YouTube Short",
           channel: "Unknown Channel",
           thumbnailUrl: videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : undefined
         },
         groundingSources: []
       };
    }

    const metadata: VideoMetadata = {
      title: data.title || "YouTube Short",
      channel: data.author_name || "Unknown Channel",
      // Prefer high-res thumbnail if available via ID, otherwise use provider's
      thumbnailUrl: videoId 
        ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` 
        : data.thumbnail_url,
    };

    return {
      metadata,
      groundingSources: []
    };

  } catch (error) {
    console.error("Metadata Fetch Error:", error);
    
    // Last resort fallback
    const videoId = getYouTubeId(url);
    return {
      metadata: {
        title: "YouTube Short",
        channel: "Unknown Channel",
        thumbnailUrl: videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : undefined
      },
      groundingSources: []
    };
  }
};