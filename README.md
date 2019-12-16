# Mock API Response
Mock Responses for your APIs

# Usage
## Import
```
var mockApiResponse = require('mock-api-response');
```

## Initialize
Configuration options for initializing the Server
```
options = {
    port: <port-number>,
    headers: {}, 
    cors: {
        enabled: true,
        origin: '*',
        methods: 'POST, GET, DELETE, PUT, PATCH, OPTIONS',
        headers: 'Authorization, Content-Type'
    }
}
```

- `port` Port on which the Server will listen for incoming calls. Default is 5200
- `headers` Map of global HTTP Headers that will be a part of every Response sent by the Server
- `cors` CORS configuration
    - `enabled` If enabled, Server will respond with CORS Headers to OPTIONS call on every Endpoint. Default true
    - `origin` Allowed origins (Comma-Separated). Default *
    - `methods` Allowed Methods (Comma-Separated). Default 'POST, GET, DELETE, PUT, OPTIONS'
    - `headers` Allowed headers (Comma-Separated). Default 'Authorization, Content-Type'


Initialize the Server like this
```
mockApiResponse.init(options);
```

## Mock
To mock an API, just provide its `path` from the context-root, the `request method`, and its `scenarios`.

The `mock()` method can be called multiple times to mock multiple APIs.

### scenarios
The `scenarios` are an array of the different responses for an API. They are syntactically similar to `OpenAPI Documentation JSON` with a few differences.

For each `scenario` you must specify the following properties

#### name
A name describing what you are mocking. This will be useful for logging purposes

#### parameters
A list of parameters that will be used to match an incoming request. If all parameters in an inconing call match the ones specified here, the Server will respond with the respone specified in the `response` property. 

If no matching scenario is found, the Server will respond with `404 - Not Found`.

Each parameter can be defined with the following properties
- `in` Where the Server will look for this request parameter
    - `query` For query strings
    - `body` For request body (to be implemented)
    - `path` For path parameters (to be implemented)
- `name` Name of the Parameter
- `value` Expected value of the Parameter

#### response
- `statusCode` The Response StatusCode to respond with
- `headers` This is an map of header names and their values. 
- `body` The Response Body. This can be any JSON format


## Example

```
// Import
const mockApiResponse = require('mock-api-response');

// Initialize
mockApiResponse.init({ 
    port: process.env.PORT || 5200,
    headers: {
        'x-app-id': '787234923'
    }
});

// Mock
mockApiResponse.mock('/api/product', 'GET', [
    {
        name: 'get-products-by-category_Electronics',

        parameters: [
            { in: 'query', name: 'category', value: 'Electronics' }
        ],

        response: {
            statusCode: 200,

            headers: {
                'x-category-id': 'GHNBSF2424VN'
            },

            body: {
                "category": "Electronics",
                "products": [
                    {
                        "name": "Cell-Phone-A",
                        "cost": 1334.53,
                        "inStock": true
                    },
                    {
                        "name": "Tablet",
                        "cost": 242.17,
                        "inStock": false
                    }
                ]
            }
        }
    },

    {
        name: 'get-products-by-category_Home',

        parameters: [
            { in: 'query', name: 'category', value: 'Home' }
        ],

        response: {
            statusCode: 200,

            headers: {
                'x-category-id': 'HGFG6834356'
            },

            body: {
                "category": "Home",
                "products": [
                    {
                        "name": "Food Processor",
                        "cost": 433,
                        "inStock": true
                    },
                    {
                        "name": "Lamp",
                        "cost": 29,
                        "inStock": true
                    }
                ]
            }
        }
    }]
);
```

### Request

`GET http://www.mock-server.com/api/product?category=Electronics`

##### Response

```
HTTP/1.1 200 OK

x-app-id': 787234923
x-category-id: GHNBSF2424VN

{
    "category": "Electronics",
    "products": [
        {
            "name": "Cell-Phone-A",
            "cost": 1334.53,
            "inStock": true
        },
        {
            "name": "Tablet",
            "cost": 242.17,
            "inStock": false
        }
    ]
}
```

### Request

`GET http://www.mock-server.com/api/product?category=Home`

##### Response

```
HTTP/1.1 200 OK

x-app-id': 787234923
x-category-id: HGFG6834356

{
    "category": "Home",
    "products": [
        {
            "name": "Food Processor",
            "cost": 433,
            "inStock": true
        },
        {
            "name": "Lamp",
            "cost": 29,
            "inStock": true
        }
    ]
}
```

### All other Requests
```
HTTP/1.1 404 Not Found

x-app-id': 787234923
```
