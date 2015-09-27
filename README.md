RESTful API for finding the name of a state's governor and senators.


# Installation

Clone repo:

```
https://github.com/jrrembert/elected-official-rest-api.git
```

The site only serves content over HTTPS so you will need to generate a self-signed certificate. Instructions use openssl, but other methods work as well.

1. Generate a private key
```
openssl genrsa -des3 -out server.key 1024
```
2. Generate a Certificate Signing Request
```
openssl req -new -key server.key -out server.csr
```
3. Generate Self-Signed Cert
```
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
```
4. (Optional) Remove Passphrase from Key
```
openssl rsa -in server.key -out new_server.key && mv new_server.key server.key
```
# Run server

```
$ node ./src/app.js
```

# Usage

The API exposes a single endpoint and accepts an optional ```state``` query parameter. The state's full name or abbreviation are both valid query parameters.

# Examples

Get elected officials for all states.

```
GET https://localhost:3000/myapi

Response Body:

{
  Iowa: {
    governor: "Terry Branstad",
    senators: [
      "Charles Grassley",
      "Tom Harkin"
    ]
  },
  New Mexico: {
    governor: "Susana Martinez",
    senators: [
      "Martin Heinrich",
      "Tom Udall"
    ]
  },
...
}
```

Get elected officials for South Carolina (using full state name).

```
GET https://localhost:3000/myapi?state=South Carolina

Response Body:
{
  governor: "Nikki Haley",
  senators: [
    "Lindsey Graham",
    "Tim Scott"
  ]
}
```

Get elected officials for South Carolina (using state abbreviation).

```
GET https://localhost:3000/myapi?state=sc

Response Body:
{
  governor: "Nikki Haley",
  senators: [
    "Lindsey Graham",
    "Tim Scott"
  ]
}
```
