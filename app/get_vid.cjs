const https = require('https');
https.get('https://pixabay.com/videos/rocket-missile-launch-fire-smoke-344996/', {
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
}, (res) => { 
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => console.log(data.match(/https:\/\/[^\"]+\.mp4/g)));
}).on('error', console.error);
