import config from '../config.js';

var AppUrl = {
    url: function(urlTemplate, args = {}, full = true) {
        let path = urlTemplate.replace(/:([^\/]+)/g, function(m, capturedGroup) {
            return args[capturedGroup];
        });

        let base = document.head.querySelector('meta[name="apibaseurl"]');
        if (full && base) {
            return base.content.replace(/\/$/, '') + '/' + path.replace(/^\//, '');
        }

        return path;
    }
};

export default AppUrl;