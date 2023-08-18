let esbuild = require('esbuild');
let globalExternals = require('@fal-works/esbuild-plugin-global-externals');
globalExternals = globalExternals.globalExternals

esbuild.build({
    entryPoints: ['index.user.js'],
    outfile: 'dist/DYJJHelper.user.js',
    bundle: true,
    platform: 'browser',
    format: 'iife',
    loader: {
        '.html': 'text',
        '.css': 'text',
    },
    keepNames: true,
    plugins: [
        globalExternals({
            'jquery': '$'
        }),
    ],
    banner: {
        js: `// ==UserScript==
// @name         DYJJHelper
// @namespace    https://github.com/qisumi
// @version      0.2.0
// @description  Dao Yuan Jie Jie !
// @author       Qisumi
// @match        https://ywgl.seu.edu.cn/*
// @connect      ywgl.seu.edu.cn
// @match        https://infoplus.seu.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net.cn
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @run-at document-idle
// ==/UserScript==`
    }
})