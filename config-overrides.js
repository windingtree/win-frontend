
module.exports = function override(config, env) {

    if (!config.plugins) {
        config.plugins = [];
    }

    //const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

    //config.plugins.push(new NodePolyfillPlugin());

    return config
};
