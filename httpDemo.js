const http = require('http');
const qhttp = require('qhttp');

module.exports = {

	 get: function (url, data, sucFn, errFn) {

        if (typeof data === 'object') {
            url = url + (url.indexOf('?') > 0 ? '&' : '?') + qhttp.http_build_query(data);
        }

        console.log('== http get url ==' + url);
        http.get(url, res => {
            let statusCode = res.statusCode;

            let error;
            if (statusCode !== 200) {
                errFn && errFn(e.message);

                console.log(error.message);
                res.resume();
                return;
            }

            res.setEncoding('utf8');
            var rawData = '';
            res.on('data', chunk => {

            	console.log(`BODY: ${chunk}`);
                if (typeof chunk === 'object') {
                    chunk = JSON.stringify(chunk);
                }
                rawData += chunk;

            });
            res.on('end', () => {
                try {
                    let parsedData = JSON.parse(rawData);
                    if (parsedData.errno === 0) {
                        sucFn && sucFn(parsedData);
                    } else {
                        errFn && errFn('服务端返回错误');
                        console.log('== 服务端返回错误 ==');
                    }
                } catch (e) {
                    errFn && errFn(e.message);
                    console.log('获取数据结果出错：', e.message);
                }
            });
        }).on('error', e => {
            console.log(`Got error: ${e.message}`);
        });

    },

    post(opts, data, sucFn, errFn, type) {

        var postDataStr = JSON.stringify(data);
        console.log('=== postDataStr ===', postDataStr);

        var optsPost = {
            hostname: opts.host,
            port: opts.port ? opts.port : 80,
            path: opts.path,
            method: (type || 'POST'),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postDataStr.length
            },
            body: postDataStr
        };
        console.log(optsPost);

        let reqPost = http.request(optsPost, function (resPost) {
            resPost.setEncoding('utf8');
            let rawData = '';

            resPost.on('data', chunk => {
                console.log(`BODY: ${chunk}`);
                if (typeof chunk === 'object') {
                    chunk = JSON.stringify(chunk);
                }
                rawData += chunk;
            });
            resPost.on('end', () => {

                console.log('== rawData ==', rawData);

                try {
                    rawData = (typeof rawData === 'string') ? JSON.parse(rawData) : rawData;
                    if (rawData.status === 0 || rawData.errno === 0 || rawData.code === 1000) {
                        sucFn && sucFn(rawData.data);
                    } else {
                        errFn && errFn('操作失败');
                    }
                } catch (e) {
                    errFn && errFn('结果返回错误');
                }

                console.log('No more data in response.');
            });
        });

        reqPost.on('error', function (e) {

            errFn && errFn(e);
            console.log(`problem with request: ${e.message}`);

        });

        // 发送REST请求时传入JSON数据
        reqPost.write(postDataStr);
        reqPost.end();

    },

    delete(opts, data, sucFn, errFn) {
        this.post(opts, data, sucFn, errFn, 'DELETE');
    }
};