const https = require('https');
https.get('https://svs.gsfc.nasa.gov/11264', (res) => { // SWOT launch or something
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const matches = data.match(/https:\/\/[^"']*\.mp4/g);
        console.log(matches ? matches[0] : "Not found");
    });
});
