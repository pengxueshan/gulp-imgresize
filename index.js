var path = require('path')
var through = require('through')
var gutil = require('gulp-util')
var lwip = require('node-lwip')

function image_resize(options){
	var ratio = (options && options.ratio) || 0.5
	
	function resize_index(file){
		var basename = path.basename(file.path)

		if(basename.indexOf('@2x') < 0){
			return
		}else{
			var dirname = path.dirname(file.path)
			var output = dirname + '\\' + basename.replace(/@2x/g, '')

			lwip.open(file.path, function(err, image){
				image.batch()
				.scale(ratio)
				.writeFile(output, function(err){
					if(err){
						gutil.log(gutil.colors.red(err))
					}
				})
				gutil.log(gutil.colors.green(basename + '---resize ratio ' + ratio +'---' + path.basename(output)))
			})
		}
	}
	function streamEnd(){
		this.emit('end')
	}
	
	return through(resize_index,streamEnd)
}

module.exports = image_resize