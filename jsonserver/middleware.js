module.exports = function(req, res, next) {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
        req.method = 'GET' // GETに偽装
        // req.url += '_post' // アクセス先をPOST用に変更
    }

    // if (req.url == '/store-issue-title' || req.url == '/update-issue-title') {
    // }

    next()
}