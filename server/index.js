var express = require('express');
var fs = require('fs');
var open = require('open');
var request = require("request");

var RestaurantRecord = require('./model').Restaurant;
var MemoryStorage = require('./storage').Memory;

var API_URL = '/api/restaurant';
var API_URL_ID = API_URL + '/:id';
var API_URL_ORDER = '/api/order';
var API_URL_POST = '/api/post';
var API_URL_POST_ID = API_URL_POST + '/:id';

var removeMenuItems = function(restaurant) {
    var clone = {};

    Object.getOwnPropertyNames(restaurant).forEach(function(key) {
        if (key !== 'menuItems') {
            clone[key] = restaurant[key];
        }
    });

    return clone;
};


exports.start = function(PORT, STATIC_DIR, DATA_FILE, TEST_DIR) {
    var app = express();
    var storage = new MemoryStorage();
    // log requests
    app.use(express.logger('dev'));
    // serve static files for demo client
    app.use(express.static(STATIC_DIR));
    // parse body into req.body
    app.use(express.bodyParser());
    // API
    app.get(API_URL, function(req, res, next) {
        res.send(200, storage.getAll().map(removeMenuItems));
    });
    // POST
    app.get(API_URL_POST, function(req, res, next) {

        var redis = require("redis"),
                client = redis.createClient();
        client.on("error", function(err) {
            console.log("Error " + err);
        });

        var redis_posts = client.lrange('posts', 0, -1, function(err, data) {
            if (data.length) {
                var result = [];
                var i = 0;
                data.forEach(function(entry) {
                    client.hgetall("post:id:" + entry, function(err, reply) {
                        i++;
                        result.push(reply);
                        if ((data.length - 1) === i) {
                            client.quit();
                            res.send(200, result);
                        }

                    });
                });
            }
            else {

                var url = "http://www.source.vn/api/post";
                request({
                    url: url,
                    json: true
                }, function(error, response, body) {

                    if (!error && response.statusCode === 200) {

                        body.forEach(function(entry) {
                            client.lpush('posts', entry.id);
                            client.hset("post:id:" + entry.id, "id", entry.id);
                            client.hset("post:id:" + entry.id, "title", entry.title);
                            client.hset("post:id:" + entry.id, "image", entry.image);
                            client.hset("post:id:" + entry.id, "width", entry.picture.width);
                            client.hset("post:id:" + entry.id, "height", entry.picture.height);
                            client.hset("post:id:" + entry.id, "thumb", entry.picture.thumb);
                        });
                        //set expire 2 hours
                        client.expire('posts',7200);
                        client.quit();
                        res.send(200, body);
                    }
                });
            }
        });
    });
    app.get(API_URL_POST_ID, function(req, res, next) {

        var redis = require("redis"),
                client = redis.createClient();
        client.on("error", function(err) {
            console.log("Error " + err);
        });

        var redis_posts = client.lrange('pictures:post:' + req.params.id, 0, -1, function(err, data) {
            if (data.length) {
                var result = [];
                var i = 0;
                data.forEach(function(entry) {
                    client.hgetall("post_detail:id:" + entry, function(err, reply) {
                        i++;
                        result.push(reply);
                        if ((data.length - 1) === i) {
                            client.quit();
                            res.send(200, {pictures: result});
                        }
                    });
                });
            }
            else {
                var url = "http://www.source.vn/api/post/id/" + req.params.id;
                request({
                    url: url,
                    json: true
                }, function(error, response, body) {
                    if (!error && response.statusCode === 200) {
                        body.pictures.forEach(function(entry) {
                            client.lpush('pictures:post:' + req.params.id, entry.id);
                            client.hset("post_detail:id:" + entry.id, "id", entry.id);
                            client.hset("post_detail:id:" + entry.id, "url", entry.url);
                        });
                        client.quit();
                        res.send(200, body);
                    }
                });
            }


        });

    });
    app.post(API_URL, function(req, res, next) {
        var restaurant = new RestaurantRecord(req.body);
        var errors = [];
        if (restaurant.validate(errors)) {
            storage.add(restaurant);
            return res.send(201, restaurant);
        }

        return res.send(400, {error: errors});
    });
    app.post(API_URL_ORDER, function(req, res, next) {
        console.log(req.body)
        return res.send(201, {orderId: Date.now()});
    });
    app.get(API_URL_ID, function(req, res, next) {
        var restaurant = storage.getById(req.params.id);
        if (restaurant) {
            return res.send(200, restaurant);
        }

        return res.send(400, {error: 'No restaurant with id "' + req.params.id + '"!'});
    });
    app.put(API_URL_ID, function(req, res, next) {
        var restaurant = storage.getById(req.params.id);
        var errors = [];
        if (restaurant) {
            restaurant.update(req.body);
            return res.send(200, restaurant);
        }

        restaurant = new RestaurantRecord(req.body);
        if (restaurant.validate(errors)) {
            storage.add(restaurant);
            return res.send(201, restaurant);
        }

        return res.send(400, {error: errors});
    });
    app.del(API_URL_ID, function(req, res, next) {
        if (storage.deleteById(req.params.id)) {
            return res.send(204, null);
        }

        return res.send(400, {error: 'No restaurant with id "' + req.params.id + '"!'});
    });
    // only for running e2e tests
    app.use('/test/', express.static(TEST_DIR));
    // start the server
    // read the data from json and start the server
    fs.readFile(DATA_FILE, function(err, data) {
        JSON.parse(data).forEach(function(restaurant) {
            storage.add(new RestaurantRecord(restaurant));
        });
        app.listen(PORT, function() {
            open('http://localhost:' + PORT + '/');
            // console.log('Go to http://localhost:' + PORT + '/');
        });
    });
    // Windows and Node.js before 0.8.9 would crash
    // https://github.com/joyent/node/issues/1553
    try {
        process.on('SIGINT', function() {
            // save the storage back to the json file
            fs.writeFile(DATA_FILE, JSON.stringify(storage.getAll()), function() {
                process.exit(0);
            });
        });
    } catch (e) {
    }

};
