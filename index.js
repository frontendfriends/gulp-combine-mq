'use strict';

var path = require('path'),
	through = require('through2'),
	combineMq = require('combine-mq'),
	log = require('fancy-log'),
	colors = require('ansi-colors'),
	PluginError = require('plugin-error');


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
			this.emit('error', new PluginError(PLUGIN_NAME, 'Streaming not supported'));
			return cb();
		}

		if(file.isBuffer()) {
			var processed = combineMq.parseCssString(file.contents.toString(), {
				beautify: options.beautify
			});

			if(options.showLog) {
				log(PLUGIN_NAME, colors.green('✔ ') + file.relative);
			}

			file.contents = new Buffer(processed);

			this.push(file);

			return cb();
		}
	});
};
