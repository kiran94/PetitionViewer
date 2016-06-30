module.exports = function(grunt)
{
    grunt.initConfig(
        {
            less: 
            {
                development: 
                {
                    options: 
                    {
                        //paths: ['public_html/styles/'],
                        compress: true
                    },
                    files: 
                    {
                        'css/site.css': 'css/site.less'
                    }
                }
            },
            uglify: 
            {
                my_target: 
                {
                    files: 
                    {
                        'js/site.min.js': ['js/site.js']
                    }
                }
            },
            watch: 
            {
                css: 
                {
                    files: ['**/*.less'],
                    tasks: ['css'],
                    options: {
                    spawn: false,
                    },
                },
            },
    }); 

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('css', ['less']); 
    grunt.registerTask('js', ['uglify']);
    grunt.registerTask('watchcss', ['watch:css']); 
};
