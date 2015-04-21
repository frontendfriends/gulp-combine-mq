'use strict';

var path = require('path'),
fs = require('graceful-fs'),
gutil = require('gulp-util'),
map = require('map-stream'),
tempWrite = require('temp-write'),
combineMq = require('combine-mq');


module.exports = function (options) {
	return map(function (file, cb) {
		if (file.isNull()) {
			return cb(null, file);
		}

		if (file.isStream()) {
			return cb(new gutil.PluginError('gulp-combine-mq', 'Streaming not supported'));
		}

		tempWrite(file.contents, path.extname(file.path), function (err, tempFile) {
			if (err) {
				return cb(new gutil.PluginError('gulp-combine-mq', err));
			}

			fs.stat(tempFile, function (err, stats) {
				if (err) {
					return cb(new gutil.PluginError('gulp-combine-mq', err));
				}

				options = options || {
					beautify: true
				};

				fs.readFile(tempFile, { encoding : 'UTF-8'}, function(err, data) {
					if (err) {
						return cb(new gutil.PluginError('gulp-combine-mq', err));
					}

					var processed = combineMq.parseCssString(data, {
						beautify: options.beautify
					});

					if (options.showLog) {
						gutil.log('gulp-combine-mq:', gutil.colors.green('✔ ') + file.relative);
					}

					file.contents = new Buffer(processed);

					cb(null, file);
				});

			});
		});
	});
};
