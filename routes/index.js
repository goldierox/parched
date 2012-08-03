
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
    if (extension.toLowerCase() === 'json') {
      files.push(f);
    }
    next();
  });
  walker.on("end", function() {
    var moment = require('moment');
    var posts = [];
    for (var i = 0; i < files.length; i++) {
      var filename = files[i];
      try {
        var metaFile = fs.readFileSync(filename, 'utf8');
        var metaJSON = JSON.parse(metaFile);

        var markdownFile = filename.substr(0, filename.lastIndexOf('.')) + ".markdown";
        var content = fs.readFileSync(markdownFile, 'utf8').trim();

        var date = moment(metaJSON.date);

        var post = {
          'title': metaJSON.title,
          'date': date.format("YYYY-MM-DD"),
          'displayDate': date.format("MMMM Do, YYYY"),
          'content': md.markdown.toHTML(content)
        }
      }
      catch (err) {
        console.error("Error parsing blog post for file '" + files[i] + "' - " + err);
        post = {};
      }

      posts.push(post);
    }

    res.render('index', {
      title: config.site.title,
      entries: posts,
      isProd: false
    });
  });
};

function getExtension(filename) {
  var path = require('path');
  var ext = path.extname(filename||'').split('.');
  return ext[ext.length - 1];
}