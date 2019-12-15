var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var config = {
    port: 5200,
    headers: {},
    cors: {
        enabled: true,
        origin: '*',
        methods: 'POST, GET, DELETE, PUT, PATCH, OPTIONS',
        headers: 'Authorization, Content-Type'
    }
};

module.exports = {
    init: function (options) {
        // parse application/x-www-form-urlencoded
        app.use(bodyParser.urlencoded({ extended: true }));

        // parse application/json
        app.use(bodyParser.json());

        Object.assign(config, options);

        app.listen(config.port);

        if (config.cors.enabled)
            this.enableCors();

        console.log(`mock: server listening on port: ${config.port}`);
    },

    enableCors: function () {
        console.log(`mock: enabling global cors`)
        app.options('/*', function (request, response) {
            console.log(`mock: responding to pre-flight OPTIONS call`)

            response.set(getCorsHeaders());

            response.status(200).send();
        });
    },

    mock: function (path, method, scenarios) {
        if (method == 'GET') {
            app.get(path, function (request, response) {
                console.log(`mock: setting up ${path}.GET`)
                mockScenarios(request, response, scenarios);
            });
        } else if (method == 'POST') {
            app.post(path, function (request, response) {
                console.log(`mock: setting up ${path}.POST`)
                mockScenarios(request, response, scenarios);
            });
        } else if (method == 'DELETE') {
            app.delete(path, function (request, response) {
                console.log(`mock: setting up ${path}.DELETE`)
                mockScenarios(request, response, scenarios);
            });
        } else if (method == 'PUT') {
            app.put(path, function (request, response) {
                console.log(`mock: setting up ${path}.PUT`)
                mockScenarios(request, response, scenarios);
            });
        }
    }
};

function mockScenarios(request, response, scenarios) {
    console.log(`mock: checking request object`)
    console.dir(request.body)

    for (const scenario of scenarios) {
        console.log(`mock: checking scenario ${scenario.name}`)

        if (matchParameters(scenario, request)) {
            console.log(`mock: matched`)

            setStatus(scenario, response);

            setHeaders(scenario, response);

            response.send(scenario.response.body);

            return;
        }
    }

    console.log(`mock: not-matched`)
    sendNotFound(response);
}

function matchParameters(scenario, request) {
    console.log(`mock: checking ${scenario.parameters.length || 0} parameters`)

    var matchingPathParameters = scenario.parameters.filter((parameter) => {
        return parameter.in == 'path';
    }).filter((parameter) => {
        console.log(`mock: matching path parameter: ${parameter.name}`);
        console.log(`mock: parameter expected: ${parameter.value}, actual: ${request.params[parameter.name]}`);

        return request.params[parameter.name] == parameter.value;
    }).length || 0;

    var matchingQueryParameters = scenario.parameters.filter((parameter) => {
        return parameter.in == 'query';
    }).filter((parameter) => {
        console.log(`mock: matching query parameter: ${parameter.name}`);
        console.log(`mock: parameter expected: ${parameter.value}, actual: ${request.query[parameter.name]}`);

        return request.query[parameter.name] == parameter.value;
    }).length || 0;

    var matchingBodyParameters = scenario.parameters.filter((parameter) => {
        return parameter.in == 'body';
    }).filter((parameter) => {
        console.log(`mock: matching body parameter: ${parameter.name}`);
        console.log(`mock: parameter expected: ${parameter.value}, actual: ${request.body[parameter.name]}`);

        return request.body[parameter.name] == parameter.value;
    }).length || 0;

    console.log(`matchingPathParameters: ${matchingPathParameters}, matchingQueryParameters: ${matchingQueryParameters}, matchingBodyParameters: ${matchingBodyParameters}`)

    return scenario.parameters.length == (matchingPathParameters + matchingQueryParameters + matchingBodyParameters);
}

function setStatus(scenario, response) {
    var mockResponse = scenario.response;

    response.statusCode = mockResponse.statusCode;
    response.statusMessage = mockResponse.description;
}

function setHeaders(scenario, response) {
    var mockResponse = scenario.response;

    let responseHeaders = Object.assign({}, config.headers, getCorsHeaders(), mockResponse.headers);

    response.set(responseHeaders);
}

function sendNotFound(response) {
    let responseHeaders = Object.assign({}, config.headers, getCorsHeaders());
    response.set(responseHeaders);
    response.sendStatus(404);
}

function getCorsHeaders(response) {
    return config.cors.enabled ?
        {
            'Access-Control-Allow-Origin': config.cors.origin,
            'Access-Control-Request-Methods': config.cors.methods,
            'Access-Control-Allow-Headers': config.cors.headers
        } : {};
}