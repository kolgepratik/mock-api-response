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
config = {
    port: 5200,     // Port (default = 5200) on which the Server will listen for incoming calls
    headers: {      // Global HTTP Headers that will be a part of every Response sent by the Server
        'x-app-id': '787234923' 
    }, 
    cors: {         // CORS Configuration
        enabled: true,  // If enabled (default = true), Server will respond with CORS Headers to OPTIONS call on every Endpoint
        origin: '*',    // Allowed Origins
        methods: 'POST, GET, DELETE, PUT, PATCH, OPTIONS',  // Allowed Methods as CSV
        headers: 'Authorization, Content-Type'  // Allowed Headers as CSV
    }
}
```

Then, initialize the Server like this
```
mockApiResponse.init({
    port: process.env.PORT || 5200
});
```

## Mock
To mock an API, just provide its `path` from the context-root, the `request method`, and its `scenarios`. 

The `scenarios` are as close to `OpenAPI Documentation JSON` as they can be with a few differences.

For each `scenario` you must specify the following properties 
### name
A name describing what you are mocking. This will be useful for logging purposes

### parameters
A list of parameters that will be used to match an incoming request. If all parameters in an inconing call match the ones specified here, the Server will respond with the respone specified in the `response` property

#### parameter
Each parameter can be defined with the following properties
- `in` Where the Server will look for this request parameter
- `name` Name of the Parameter
- `value` Expected value of the Parameter

### response
#### statusCode
The `Response StatusCode` to respond with

#### body
The `Response Body`. This can be any JSON format

##### headers
The 


```
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