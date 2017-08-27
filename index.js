const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const myDb = require("./functions.js");
const Fn = require("./hashAndCheck.js");
const cookieSession = require('cookie-session');
const cookieParser = require("cookie-parser");
const multer = require('multer');
const uidSafe = require('uid-safe');
const secrets = require('./secrets.json');
const path = require('path');
const fs = require('fs');
const myUrl = require('./config.json');
const awsS3Url = "https://s3.amazonaws.com/jacobimageboard";
const server = require('http').Server(app);


const diskStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, __dirname + "/uploads");
    },
    filename: (req, file, callback) => {
        uidSafe(24).then((uid) => {
            console.log("this is the new file name " + uid + path.extname(file.originalname));
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        filesize: 20097152
    }
});

const knox = require('knox');
const client = knox.createClient({
    key: secrets.AWS_KEY,
    secret: secrets.AWS_SECRET,
    bucket: 'jacobimageboard'
});

app.use(cookieSession({
    secret: 'Cookies are cool',
    maxAge: 1000 * 60 * 60 * 24 * 14
}));

if (process.env.NODE_ENV != 'production') {
    app.use(require('./build'));
}
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));


app.post('/register-user', function(req, res) {
    Fn.hashPassword(req.body.password).then((result) => {
        myDb.insertUser(req.body, result).then((result) => {
            console.log("This is the user " + req.session.user);
            req.session.user = {
                user: true,
                email: req.body.email,
                first: req.body.first,
                last: req.body.last,
                id: result
            };
            res.redirect("/profile");

        });
    });
});

app.post('/login-user', function(req, res) {
    myDb.readUser().then((rows) => {
        rows.forEach((item) => {
            if (item.email == req.body.email) {
                Fn.checkPassword(req.body.password, item.password).then((result) => {
                    if (result) {
                        console.log("The results are " + result);
                        req.session.user = {
                            user: true,
                            email: item.email,
                            first: item.first,
                            last: item.last,
                            id: item.id
                        };
                        res.redirect("/");
                    } else {
                        res.json({
                            success: false
                        });
                    }
                });
            }
        });
    });
});

app.get('/user', function(req, res) {
    myDb.getUser(req.session.user.id).then((row) => {
        res.json(row);
    });
});

app.get('/user/:id/info', function(req, res) {
    console.log("Okay so we are working then or nah?");
    if (req.params.id == req.session.user.id) {
        res.json({
            redirect: ("/")
        });
    } else {
        myDb.getUser(req.params.id).then((row) => {
            res.json(row);
        });
    }
});

app.post('/insert-bio', function(req, res) {
    console.log("this post for bio is going through");
    myDb.insertBio(req.body.bio, req.session.user.id).then((result) => {
        console.log("bio results = " + result);
        res.json({
            bio: result
        });
    }).catch((err) => {
        console.log(err);
    });
});


app.post('/friend-requests', function(req, res) {
    console.log("people talking about people ", req.body.recId, req.session.user.id);
    myDb.getRequest(req.body.recId, req.session.user.id).then((reqStatus) => {
        if (reqStatus.length == 0) {
            res.json({
                response: 0
            });
        } else {
            console.log(reqStatus);
            res.json({
                response: reqStatus[0].status,
                recipient: reqStatus[0].rec_id
            });
        }
    }).catch((err) => {
        console.log(err);
    });
});

app.post('/request', function(req, res) {
    console.log("status is ->" + req.body.status);
    myDb.getRequest(req.body.recId, req.session.user.id).then((reqStatus) => {

        if (reqStatus.length == 0) {
            myDb.request(req.body.recId, req.session.user.id, req.body.status).then((row) => {
                console.log(row);
                res.json({
                    status: 2
                });
            }).catch((err) => {
                console.log(err);
            });
        } else {

            myDb.updateRequest(req.body.recId, req.session.user.id, req.body.status).then((row) => {
                console.log("updated!");
                console.log(row);
                res.json({
                    id: row.id,
                    status: req.body.status
                });
            }).catch((err) => {
                console.log(err);
            });
        }
    }).catch((err) => {
        console.log(err);
    });
});

app.get('/all-requests', function(req, res) {
    let friendsObject = {};
    myDb.allFriends(req.session.user.id).then((friendsArr) => {
        friendsObject.friends = friendsArr;
        myDb.allRequests(req.session.user.id).then((requestsArr) => {
            friendsObject.requests = requestsArr;
            let responseObject = {
                friends: [],
                requests: []
            };
            myDb.readUser().then((allUsers) => {
                friendsObject.friends.forEach((item) => {
                    allUsers.forEach((user) => {
                        if (user.id == item.req_id) {
                            if (item.req_id != req.session.user.id) {
                                responseObject.friends.push(user);
                            }
                        } else if (user.id == item.rec_id && item.req_id == req.session.user.id) {
                            responseObject.friends.push(user);
                        }
                    });

                });
                friendsObject.requests.forEach((item) => {
                    allUsers.forEach((user) => {
                        if (user.id == item.req_id) {
                            responseObject.requests.push(user);
                        }
                    });
                });
                res.json(responseObject);
            });

        });
    });
});


app.post('/upload', uploader.single('file'), (req, res) => {
    console.log("id = " + req.id);

    const s3Request = client.put(req.file.filename, {
        'Content-Type': req.file.mimetype,
        'Content-Length': req.file.size,
        'x-amz-acl': 'public-read'
    });

    const readStream = fs.createReadStream(req.file.path);
    readStream.pipe(s3Request);

    s3Request.on('response', (s3Response) => {
        if (s3Response.statusCode == 200) {
            myDb.insertImage(req.file.filename, req.session.user.id).then((url) => {
                res.json({
                    url: myUrl.s3Url + url
                });
                console.log(myUrl.s3Url + url);
            }).catch((err) => {
                console.log(err);
                res.json({
                    url: myUrl.s3Url + url
                });
            });
        }
    });

});


app.get('/welcome', function(req, res) {
    console.log("/welcome");
    if (req.session.user) {
        res.redirect("/profile");
    } else {
        res.sendFile(__dirname + '/index.html');
    }
});

app.get('/logout', function(req, res) {
    console.log('User logging out');
    req.session = null;
    res.redirect('/');
})

app.get('*', function(req, res) {
    if (!req.session.user) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + '/index.html');
    }
});



app.listen(process.env.PORT || 8080, function() {
    console.log("I'm listening old friend.")
});
