const request = require("request");

/**
    HTTP (POST requests) Client for ViciAuth, sends requests with viciauth app key and api key in header
    @param uri{string} - API paths of ViciAuth.com
    @param params{Object} - Body of the request
    @param callback{function}, called with (err,ViciAuthUser)
*/
const httpClientFactory = (API_KEY, APP_KEY, OPTS) => (uri, params, callback) => {
    console.log("[INFO] [ViciAuth] Calling uri %s",uri);

    params = params || {};

    if (!callback) {
        throw "[ERROR] call method must be provided with callback function!"
    }

    if (!APP_KEY) {
        console.log("[WARNING] [ViciAuth] No app key");
    }

    if (!API_KEY) {
        console.log("[WARNING] [ViciAuth] No api key");
    }

    var requestOptions = {
        headers : OPTS.headers || {}
    };

    requestOptions.url = OPTS.protocol + "://" + OPTS.host + ":" + OPTS.port + uri;
    requestOptions.headers['x-auth-viciauth-app-key'] = APP_KEY;
    requestOptions.headers['x-auth-viciauth-api-key'] = API_KEY;
    requestOptions.headers['x-auth-viciauth-token'] = params.token
    requestOptions.form = params; //{ token : params.token };

    request.post(requestOptions, (err, response, body) => {
        if (err) {
            try {
                err = JSON.parse(err);
            } catch(e) {
                console.error(err);
            }
            return callback({status:502,err:err});
        }

        if (body) {
            try {
                body = JSON.parse(body);
            } catch(err) {
                console.error("[ERROR] ViciAuthSDK : Something went wrong");
                console.error(err);
                body = {};

                return callback(err);
            }
        } else {
            body = {};
        }

        if (response.statusCode !== 200) {
            return callback({
                status: response.statusCode,
                err: body
            });
        }

        return callback(null, body);
    });
};

module.exports = httpClientFactory;
