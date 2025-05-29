const axios = require('axios');

var dispatcher = function() {
    return {
        get: function(path, params = null) {
            return axios({
                headers: { "X-Requested-With": "XMLHttpRequest" },
                method: 'get',
                url: path,
                params: params
            });
        },
        post: function(path, data = null) {
            return axios({
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "Content-Type": "multipart/form-data"
                },
                method: 'post',
                url: path,
                data: data
                // headers: { 'content-type': 'application/x-www-form-urlencoded' },
            });
        },
        put: function(path, data = null) {
            if (data instanceof FormData) {
                data.append("_method", 'put');
            } else if (data instanceof Object) {
                data = Object.assign(data, { _method: 'put' });
            }

            return axios({
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                method: 'post',
                url: path,
                data: data
                // headers: { 'content-type': 'application/x-www-form-urlencoded' },
            });
        },
        delete: function(path, data = null) {
            if (data instanceof FormData) {
                data.append("_method", 'delete');
            } else if (data instanceof Object) {
                data = Object.assign(data, { _method: 'delete' });
            }

            return axios({
                headers: { "X-Requested-With": "XMLHttpRequest" },
                method: 'delete',
                url: path,
                data: data
            });
        },
    };
};

export default dispatcher;