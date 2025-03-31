import config from '../config.js';

var AppUrl = {
    url: function(urlTemplate, args = {}, full = true) {
        let path = urlTemplate.replace(/:([^\/]+)/g, function(m, capturedGroup) {
            return args[capturedGroup];
        });

        if (full) {
            return config.origin.replace(/\/$/, '') + '/' + path;
        }

        return path;
    }
};

export default AppUrl;