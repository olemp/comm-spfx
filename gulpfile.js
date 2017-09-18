'use strict';

const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');
const fs = require('fs');
const spsync = require('gulp-spsync-creds').sync;
const sppkgDeploy = require('node-sppkg-deploy');


const environmentInfo = {
    'username': 'olemp@olemp.onmicrosoft.com',
    'password': '[&8j]EQYbBEakv5G',
    'tenant': 'olemp',
    'cdnSite': 'sites/comm_spfx_cdn',
    'cdnLib': 'SiteAssets',
    'catalogSite': 'sites/app_catalog'
};

build.task('update-manifest', {
    execute: (config) => {
        return new Promise((resolve, reject) => {
            const cdnPath = config.args['cdnpath'] || `https://${environmentInfo.tenant}.sharepoint.com/${environmentInfo.cdnSite}/${envirenvironmentInfo.cdnLib}`;
            let json = JSON.parse(fs.readFileSync('./config/write-manifests.json'));
            json.cdnBasePath = cdnPath;
            fs.writeFileSync('./config/write-manifests.json', JSON.stringify(json));
            resolve();
        });
    }
});

build.task('upload-to-sharepoint', {
    execute: (config) => {
        environmentInfo.username = config.args['username'] || environmentInfo.username;
        environmentInfo.password = config.args['password'] || environmentInfo.password;
        environmentInfo.tenant = config.args['tenant'] || environmentInfo.tenant;
        environmentInfo.cdnSite = config.args['cdnsite'] || environmentInfo.cdnSite;
        environmentInfo.cdnLib = config.args['cdnlib'] || environmentInfo.cdnLib;

        return new Promise((resolve, reject) => {
            const deployFolder = require('./config/copy-assets.json');
            const folderLocation = `./${deployFolder.deployCdnPath}/**/*.js`;

            return gulp.src(folderLocation)
                .pipe(spsync({
                    'username': environmentInfo.username,
                    'password': environmentInfo.password,
                    'site': `https://${environmentInfo.tenant}.sharepoint.com/${environmentInfo.cdnSite}`,
                    'libraryPath': environmentInfo.cdnLib,
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
        environmentInfo.username = config.args['username'] || environmentInfo.username;
        environmentInfo.password = config.args['password'] || environmentInfo.password;
        environmentInfo.tenant = config.args['tenant'] || environmentInfo.tenant;
        environmentInfo.catalogSite = config.args['catalogsite'] || environmentInfo.catalogSite;

        return new Promise((resolve, reject) => {
            const pkgFile = require('./config/package-solution.json');
            const folderLocation = `./sharepoint/${pkgFile.paths.zippedPackage}`;

            return gulp.src(folderLocation)
                .pipe(spsync({
                    'username': environmentInfo.username,
                    'password': environmentInfo.password,
                    'site': `https://${environmentInfo.tenant}.sharepoint.com/${environmentInfo.catalogSite}`,
                    'libraryPath': 'AppCatalog',
                    'publish': true
                }))
                .on('finish', resolve);
        });
    }
});

build.task('deploy-sppkg', {
    execute: (config) => {
        environmentInfo.username = config.args['username'] || environmentInfo.username;
        environmentInfo.password = config.args['password'] || environmentInfo.password;
        environmentInfo.tenant = config.args['tenant'] || environmentInfo.tenant;
        environmentInfo.catalogSite = config.args['catalogsite'] || environmentInfo.catalogSite;

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
                username: environmentInfo.username,
                password: environmentInfo.password,
                tenant: environmentInfo.tenant,
                site: environmentInfo.catalogSite,
                filename: filename,
                skipFeatureDeployment: skipFeatureDeployment,
                verbose: true
            });
        }
    }
});

build.initialize(gulp);