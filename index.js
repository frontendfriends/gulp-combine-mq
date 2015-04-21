'use strict';

var path = require('path'),
	gutil = require('gulp-util'),
	through = require('through2'),
	combineMq = require('combine-mq');


var PLUGIN_NAME = 'gulp-combine-mq';

module.exports = function(options) {

	options = options || {
		beautify: true
	};

	return through.obj(function(file, enc, cb) {
		if(file.isNull()) {
			return cb();
		}

		if(file.isStream()) {
			this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
			return cb();
		}

		if(file.isBuffer()) {
			var processed = combineMq.parseCssString(file.contents.toString(), {
				beautify: options.beautify
			});

			if(options.showLog) {
				gutil.log(PLUGIN_NAME, gutil.colors.green('✔ ') + file.relative);
			}

			file.contents = new Buffer(processed);

			this.push(file);

			return cb();
		}
	});
};
