
var config = require('../config');

exports.index = function(req, res){
  var options;
  var walk = require('walk');
  var walker = walk.walk('blog');
  var md = require('markdown');
  var fs = require('fs');

  var files = [];
  walker.on("file", function(root,file,next){
    var f = root + "/" + file['name'];

    var extension = getExtension(f)
    if (extension.toLowerCase() === 'markdown') {
      files.push(f);
    }
    next();
  });
  walker.on("end", function() {
    var libxmljs = require('libxmljs');
    var moment = require('moment');
    var date, post, posts = [];
    for (var i = 0; i < files.length; i++) {
      var xml = fs.readFileSync(files[i], 'utf8');

      var xmlDoc = libxmljs.parseXmlString(xml);

      post = {};
      try {
        date = moment(xmlDoc.get('//date').text());

        post.title = xmlDoc.get('//title').text();
        post.date = date.format("YYYY-MM-DD");
        post.displayDate = date.format("MMMM Do, YYYY");
        post.content = md.markdown.toHTML(xmlDoc.get('//content').text().trim());
      }
      catch (err) {
        console.error("Error parsing blog post for file '" + files[i] + "' - " + err);
        posts = {};
      }

      posts.push(post);
    }

    res.render('index', {
      title: config.site.title,
      entries: posts
    });
  });
};

function getExtension(filename) {
  var path = require('path');
  var ext = path.extname(filename||'').split('.');
  return ext[ext.length - 1];
}