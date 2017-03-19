const request=require('request');
const qhttp = require('qhttp');

module.exports = {

	reqHttp(opts, data, sucFn, errFn) {

		const method = (opts.method || 'GET').toUpperCase();
		const postDataStr = qhttp.http_build_query(data);
		if (method === 'GET' && typeof data === 'object') {
            url = url + (url.indexOf('?') > 0 ? '&' : '?') + postDataStr;
        }

        request({

	        headers: {
	            'Connection': 'close',
	            'Content-Type': 'application/x-www-form-urlencoded',
	            'Content-Length': postDataStr.length
	        },
	        url: opts.url,
	        method: method,
	        json: opts.json,
	        body: postData

	    }, function (error, response, data) {
	        console.log('=== end ===');

	        if (!error && response.statusCode == 200) {
	            sucFn && sucFn(data);
	        } else {
	            console.log(`错误：${err}`);
	        }

	    });

	}
};