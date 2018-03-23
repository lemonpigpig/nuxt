// Use memory-cache as our way to store responses:
const LRU = require('lru-cache');

// Export our middleware:
module.exports = function (options = {}) {
    const cache = new LRU(options)
    // No options are used in this version. It's there as a placeholder.
    return function (req, res, next) {
        console.log(req.originalUrl)
        // Save end and write, they will be overwritten below:
        const _end = res.end;
        const _write = res.write;
        // Create a chunk list to rebuild body at the end:
        let chunks = [];

        // Don't utilize this middleware if url has query or is not a GET:
        // if (req.path !== req.originalUrl || req.method.toUpperCase() !== 'GET') return next();

        // Check to see if response has been cached, if so use it:
        const prevResponse = cache.get(req.originalUrl);

        // console.log(`process cache middleware path: ${req.path}, originalUrl: ${req.originalUrl}`)

        if (prevResponse) {
            // console.log(`hit cache, url: ${req.path}`)
            // This path is cached, so send it:
            Object.keys(prevResponse.headers).forEach(h => res.setHeader(h, prevResponse.headers[h]));
            // res.set(prevResponse.headers); // Set headers
            res.write(prevResponse.body); // Send body
            res.end();
            return;
        }

        function processChunk(chunk, encoding) {
            // Check if chunk is not null:
            if (chunk) {
                // Coerce chunk into a buffer:
                if (!Buffer.isBuffer(chunk) && encoding !== 'buffer') {
                    chunk = Buffer.from(chunk, encoding);
                }
                // Add chunk to chunk list:
                chunks.push(chunk);
            }
        }

        // Overwrite write to grab chunk:
        res.write = function (chunk, encoding) {
            // Intercept chunk:
            processChunk(chunk, encoding);
            // Send chunk:
            _write.apply(res, arguments);
            // console.log('res write')
        };

        // Overwrite end to cache body:
        res.end = function (chunk, encoding) {
            // Get final chunk of body:
            processChunk(chunk, encoding);
            // Send body before caching to make use of async io:
            _end.apply(res, arguments);
            // console.log(`res end`)
            // Cache response if 200:
            if (res.statusCode === 200) {
                // console.log(`set cache ${req.path}`)
                cache.set(req.originalUrl, {
                    body: Buffer.concat(chunks), // Merge chunks
                    // Store headers that were set:
                    headers: Object.keys(res._headers).reduce((headers, name) => {
                        // Resolve HeaderName: value
                        headers[res._headerNames[name]] = res._headers[name];
                        return headers;
                    }, {})
                });
            }
        };

        // Go to next middleware:
        if (typeof next === 'function')
            next();
    };
};
