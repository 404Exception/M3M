/**
 * Utility helper to parse and format video URLs (YouTube, Vimeo, and direct video uploads).
 */

export interface ParsedVideo {
  isValid: boolean;
  type: 'youtube' | 'vimeo' | 'direct' | 'unknown';
  embedUrl?: string;
  sourceUrl?: string;
}

export function parseVideoUrl(url?: string | null): ParsedVideo {
  if (!url || typeof url !== 'string') {
    return { isValid: false, type: 'unknown' };
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return { isValid: false, type: 'unknown' };
  }

  // 1. YouTube detection & ID extraction
  // Matches: youtube.com/watch?v=..., youtu.be/..., youtube.com/embed/..., youtube.com/shorts/...
  const ytMatch = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      isValid: true,
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`,
      sourceUrl: trimmed,
    };
  }

  // 2. Vimeo detection & ID extraction
  // Matches: vimeo.com/123456789, player.vimeo.com/video/123456789
  const vimeoMatch = trimmed.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    return {
      isValid: true,
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0`,
      sourceUrl: trimmed,
    };
  }

  // 3. Direct Video File (Uploaded /uploads/video-... or .mp4, .webm, .mov, .ogg)
  const isDirectFile =
    trimmed.startsWith('/uploads/') ||
    /\.(mp4|webm|mov|ogg|m4v|mkv)(\?.*)?$/i.test(trimmed);

  if (isDirectFile) {
    return {
      isValid: true,
      type: 'direct',
      sourceUrl: trimmed,
    };
  }

  // 4. Fallback: if it's a URL starting with http/https, attempt direct video play or embed
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return {
      isValid: true,
      type: 'direct',
      sourceUrl: trimmed,
    };
  }

  return { isValid: false, type: 'unknown' };
}
