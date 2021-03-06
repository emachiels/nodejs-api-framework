const Server = require("./http/server/Server");
const express = require('express');
const Router = require('./routing/Router');
const PluginManager = require('./plugins/PluginManager');
const ConfigManager = require('./config/ConfigManager');
const DatabaseManager = require('./database/DatabaseManager');

class Application {

    /**
     * @type {Application}
     */
    static instance;

    /**
     * @type {Server}
     */
    server;

    /**
     * @type {express}
     */
    express;

    /**
     * @type {Router}
     */
    router;

    /**
     * @type {PluginManager}
     */
    pluginManager;

    /**
     * @type {ConfigManager}
     */
    config;

    /**
     * @type {DatabaseManager}
     */
    databaseManager;

    constructor() {
        //Expose the application to the global node project
        global.application = this;

        this.express = express();
        this.router = new Router(this.express);
        this.server = Server.getInstance();
        this.pluginManager = new PluginManager();
        this.config = new ConfigManager();
        this.databaseManager = new DatabaseManager();

        this.init();
    }

    /**
     * Singleton instance of Application
     *
     * @returns {Application}
     */
    static getInstance() {
        if (!Application.instance) {
            Application.instance = new Application();
        }

        return Application.instance;
    }

    /**
     * Initialize the application
     */
    init() {
        this.loadRoutes();

        this.getPluginManager().on('plugins_loaded', count => {
            console.log(`PluginManager: loaded ${count} plugins`);
        });

        this.getPluginManager().loadPlugins();

        return this;
    }

    /**
     * Loads all routes in the express app
     *
     * @returns {void}
     */
    loadRoutes() {
        this.router.loadRoutes();
    }

    /**
     * Serve the application
     *
     * @returns {void}
     */
    serve() {
        this.getServer().create(this.express).serve(3000);
    }

    /**
     * Returns the server
     *
     * @returns {Server}
     */
    getServer() {
        return this.server;
    }

    getPluginManager() {
        return this.pluginManager;
    }

    /**
     * Returns the connection
     *
     * @returns {mysql.Connection}
     */
    getConnection() {
        return this.databaseManager.getConnection();
    }

}

module.exports = Application;