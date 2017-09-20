'use strict';

const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');
const fs = require('fs');
const spsync = require('gulp-spsync-creds').sync;
const sppkgDeploy = require('node-sppkg-deploy');
let settings = require('./setting.json');

build.task('update-manifest', {
    execute: (config) => {
        return new Promise((resolve, reject) => {
            const cdnPath = config.args['cdnpath'] || `https://${settings.tenant}.sharepoint.com/${settings.cdnSite}/${envirsettings.cdnLib}`;
            let json = JSON.parse(fs.readFileSync('./config/write-manifests.json'));
            json.cdnBasePath = cdnPath;
            fs.writeFileSync('./config/write-manifests.json', JSON.stringify(json));
            resolve();
        });
    }
});

build.task('upload-to-sharepoint', {
    execute: (config) => {
        settings.username = config.args['username'] || settings.username;
        settings.password = config.args['password'] || settings.password;
        settings.tenant = config.args['tenant'] || settings.tenant;
        settings.cdnSite = config.args['cdnsite'] || settings.cdnSite;
        settings.cdnLib = config.args['cdnlib'] || settings.cdnLib;

        return new Promise((resolve, reject) => {
            const deployFolder = require('./config/copy-assets.json');
            const folderLocation = `./${deployFolder.deployCdnPath}/**/*.js`;

            return gulp.src(folderLocation)
                .pipe(spsync({
                    'username': settings.username,
                    'password': settings.password,
                    'site': `https://${settings.tenant}.sharepoint.com/${settings.cdnSite}`,
                    'libraryPath': settings.cdnLib,
                    'publish': true
                }))
                .on('finish', (arg0, arg1) => {
                    resolve();
                });
        });
    }
});


build.task('upload-app-pkg', {
    execute: (config) => {
        settings.username = config.args['username'] || settings.username;
        settings.password = config.args['password'] || settings.password;
        settings.tenant = config.args['tenant'] || settings.tenant;
        settings.catalogSite = config.args['catalogsite'] || settings.catalogSite;

        return new Promise((resolve, reject) => {
            const pkgFile = require('./config/package-solution.json');
            const folderLocation = `./sharepoint/${pkgFile.paths.zippedPackage}`;

            return gulp.src(folderLocation)
                .pipe(spsync({
                    'username': settings.username,
                    'password': settings.password,
                    'site': `https://${settings.tenant}.sharepoint.com/${settings.catalogSite}`,
                    'libraryPath': 'AppCatalog',
                    'publish': true
                }))
                .on('finish', resolve);
        });
    }
});

build.task('deploy-sppkg', {
    execute: (config) => {
        settings.username = config.args['username'] || settings.username;
        settings.password = config.args['password'] || settings.password;
        settings.tenant = config.args['tenant'] || settings.tenant;
        settings.catalogSite = config.args['catalogsite'] || settings.catalogSite;

        const pkgFile = require('./config/package-solution.json');
        if (pkgFile) {
            // Retrieve the filename from the package solution config file
            let filename = pkgFile.paths.zippedPackage;
            // Remove the solution path from the filename
            filename = filename.split('/').pop();
            // Retrieve the skip feature deployment setting from the package solution config file
            const skipFeatureDeployment = pkgFile.solution.skipFeatureDeployment ? pkgFile.solution.skipFeatureDeployment : false;
            // Deploy the SharePoint package
            return sppkgDeploy.deploy({
                username: settings.username,
                password: settings.password,
                tenant: settings.tenant,
                site: settings.catalogSite,
                filename: filename,
                skipFeatureDeployment: skipFeatureDeployment,
                verbose: true
            });
        }
    }
});

build.initialize(gulp);