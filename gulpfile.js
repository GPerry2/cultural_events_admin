/*
 The gulpfile for WCM-embedded WRP web apps using the core library combined with bower and gulp.
 You shouldn't have to change this file much, but you could if you wanted.
 Note that this file uses es6 syntax.
 http://gulpjs.com/
 */

const gulp = require('gulp');
const core = require('./bower_components/core/gulp_helper');
const pkg = require('./package.json');

//You should pass options to the createTasks method below
let options = {
  pkg, //pass in the contents of package.json
  embedArea: 'full',
  preprocessorContext: {
    local: {
      ROOT_ENV: 'https://was-intra-sit.toronto.ca'
    },
    dev: {
      ROOT_ENV: 'https://was-intra-sit.toronto.ca'
    },
    qa: {
      ROOT_ENV: 'https://was-intra-qa.toronto.ca'
    },
    prod: {
      ROOT_ENV: 'https://insideto-secure.toronto.ca'
    },
  },
  environmentOverride: null,
  deploymentPath: null
};

core.embeddedApp.createTasks(gulp, options);


//Note that you can override any task that createTasks added, by redefining it after the call to createTasks
//ex:
// gulp.task('deploy:dev', ['_deploy_prep'], () => {
//   ...do some custom deploy code...
// });

//FAKING DATA AND CONFIG FILES:
//Some apps will load data and configurations from 'data' files, usually JSON.
//The location of these files in Dev, QA, and Prod may vary:
//- Could be in the S3 data bucket
//- Could be in a custom Wordpress post
//To 'fake' this when running your app locally, do the following:
// 1. Put some sample data/config files into /src/data folder in the project
// 2. Overwrite the _data gulp task here to copy your data files into a file path that mimics the one on your web server:
// gulp.task('_data', () => {
//   let myDataPath = '/data'; //On S3, this will be something like /data/division/my_app
//                             //On WP, this will be something different
//   return gulp.src(['src/data/**/*']).pipe(gulp.dest('dist' + myDataPath));
// });
