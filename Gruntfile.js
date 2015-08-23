module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      lib: {
        src: ["lib/"]
      }
    },
    uglify: {
      options: {
        sourceMap: true,
        banner: '\n/*!\n  <%= pkg.name %> - v<%= pkg.version %>\n  origin: https://github.com/justindujardin/observable.ts\n  built: <%= grunt.template.today("yyyy-mm-dd") %>\n */\n'
      },
      build: {
        files: {
          'lib/observable.min.js': ['lib/observable.js']
        }
      }
    },
    bump: {
      options: {
        files: ['package.json'],
        updateConfigs: ['pkg'],
        commit: true,
        commitMessage: 'chore(deploy): release v%VERSION%',
        commitFiles: [
          'package.json',
          'CHANGELOG.md'
        ],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'origin',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
      }
    },
    artifacts: {
      options: {
        files: [
          'lib/observable.d.ts',
          'lib/observable.js',
          'lib/observable.js.map',
          'lib/observable.min.js',
          'lib/observable.min.map'
        ]
      }
    },
    changelog: {},
    'npm-contributors': {
      options: {
        commitMessage: 'chore(attribution): update contributors'
      }
    },

    /**
     * Code Coverage
     */
    coveralls: {
      options: {
        coverage_dir: '.coverage/',
        debug: process.env.TRAVIS ? false : true,
        dryRun: process.env.TRAVIS ? false : true,
        force: true,
        recursive: true
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.registerTask('default', ['uglify']);

  // Test Coverage
  grunt.loadNpmTasks('grunt-karma-coveralls');

  // Release a version
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-conventional-changelog');
  grunt.loadNpmTasks('grunt-npm');
  grunt.registerTask('release', 'Build, bump and tag a new release.', function (type) {
    type = type || 'patch';
    grunt.task.run([
      'npm-contributors',
      'typescript:source',
      'uglify',
      'bump:' + type + ':bump-only',
      'changelog',
      'artifacts:add',
      'bump-commit',
      'artifacts:remove'
    ]);
  });

  var exec = require('child_process').exec;
  grunt.registerTask('artifacts', 'temporarily version output libs for release tags', function (type) {
    var opts = this.options({
      files: [],
      pushTo: 'origin',
      commitAdd: "chore: add artifacts for release",
      commitRemove: "chore: remove release artifacts"
    });
    var done = this.async();
    console.log(opts.files);
    if (type === 'add') {
      exec('git add -f ' + opts.files.join(' '), function (err, stdout, stderr) {
        if (err) {
          grunt.fatal('Cannot add the release artifacts:\n  ' + stderr);
        }
        var commitMessage = opts.commitAdd;
        exec('git commit ' + opts.files.join(' ') + ' -m "' + commitMessage + '"', function (err, stdout, stderr) {
          if (err) {
            grunt.fatal('Cannot create the commit:\n  ' + stderr);
          }
          grunt.log.ok('Committed as "' + commitMessage + '"');
          done();
        });
      });
    }
    else if (type === 'remove') {
      exec('git rm -f ' + opts.files.join(' ') + ' --cached', function (err, stdout, stderr) {
        if (err) {
          grunt.fatal('Cannot remove the release artifacts:\n  ' + stderr);
        }
        var commitMessage = opts.commitRemove;
        exec('git commit -m "' + commitMessage + '"', function (err, stdout, stderr) {
          if (err) {
            grunt.fatal('Cannot create the commit:\n  ' + stderr);
          }
          grunt.log.ok('Committed as "' + commitMessage + '"');
          exec('git push ' + opts.pushTo, function (err, stdout, stderr) {
            if (err) {
              grunt.fatal('Can not push to ' + opts.pushTo + ':\n  ' + stderr);
            }
            grunt.log.ok('Pushed to ' + opts.pushTo);
            done();
          });
        });
      });
    }
    else {
      grunt.fatal('Invalid type to artifacts');
    }
  });


};
