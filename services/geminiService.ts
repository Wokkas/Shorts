import { SearchResult, VideoMetadata } from "../types";

// We use noembed.com as a CORS-friendly proxy for YouTube oEmbed data
const OEMBED_ENDPOINT = "https://noembed.com/embed?url=";

export const analyzeShortsUrl = async (url: string): Promise<SearchResult> => {
  try {
    const response = await fetch(`${OEMBED_ENDPOINT}${encodeURIComponent(url)}`);
    const data = await response.json();

    if (data.error) {
       // Fallback if video is private or not found, but we can still try to download via ID
       return {
         metadata: {
           title: "YouTube Short",
           channel: "Unknown Channel",
           thumbnailUrl: undefined
         },
         groundingSources: []
       };
    }

    const metadata: VideoMetadata = {
      title: data.title || "YouTube Short",
      channel: data.author_name || "Unknown Channel",
      thumbnailUrl: data.thumbnail_url,
    };

    return {
      metadata,
      groundingSources: []
    };

  } catch (error) {
    console.error("Metadata Fetch Error:", error);
    // Return minimal data to allow download even if metadata fails
    return {
      metadata: {
        title: "YouTube Short",
        channel: "Unknown Channel"
      },
      groundingSources: []
    };
  }
};