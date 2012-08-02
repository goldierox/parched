var path = require('path');
var fs = require('node-fs');
var readline = require('readline');

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

var date = new Date();
var year = date.getFullYear();
var month = date.getMonth() + 1;
var dayOfMonth = date.getDate();

var blogPath = './blog/' + year + "/" + month + "/" + dayOfMonth;
fs.exists(blogPath, function(exists) {
	if (!exists) {
		fs.mkdirSync(blogPath, 0777, true);
	}

	rl.question("Post Title: ", function(title) {
		if (title.length < 2) {
			throw new Error("Blog title must be at least 2 characters");
		}

		var filename = title.substring(0, 20).toLowerCase().split(' ').join('_');
		if (filename.charAt(filename.length - 1) === '_') {
			filename = filename.substring(0, filename.length - 1);
		}
		filename += ".markdown";

		var fullpath = path.join(blogPath, filename);
  		console.log("Creating a file at", fullpath);

  		var contents = createFileString(title);

  		fs.writeFile(fullpath, contents, function(err) {
  			if (err) throw err;
  			console.log("File saved successfully");
  		});
  		rl.close();
	});
});

var createFileString = function(title) {
	var libxmljs = require('libxmljs');
	var doc = new libxmljs.Document();
	var date = new Date();
	doc.node("root")
			.node("title", title).parent()
			.node("date", date.toString()).parent()
			.node("content").parent()
		.parent()

	return doc.toString();
}