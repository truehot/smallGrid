module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-contrib-qunit');

	grunt.initConfig({
		qunit: {
			all: ['tests/index.html']
		}
	});
	grunt.registerTask('test', ['qunit']);

	grunt.registerTask('travis', 'test');
};