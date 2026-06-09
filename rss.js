// Netlify Function: proxy RSS feeds, bypass CORS
exports.handler = async (event) => {
  const url = event.queryStringParameters?.url;
  if (!url) return { statusCode: 400, body: 'Missing url param' };

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RSSReader/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      },
      redirect: 'follow',
    });

    const text = await res.text();
    return {
      statusCode: res.status,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300', // cache 5 phút
      },
      body: text,
    };
  } catch (e) {
    return { statusCode: 500, body: `Error: ${e.message}` };
  }
};
