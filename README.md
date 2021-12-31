# Software Requirement Specification

## Outline
1. [Introduction](https://github.com/andrei-deeyu/4truckLoad-client#introduction)
2. [Overall Description](https://github.com/andrei-deeyu/4truckLoad-client#overall-description)
3. [Intended Audience](https://github.com/andrei-deeyu/4truckLoad-client#intended-audience)
4. [Functionality](https://github.com/andrei-deeyu/4truckLoad-client#functionality)
5. [Platform](https://github.com/andrei-deeyu/4truckLoad-client#platform)
6. [Development Responsibilities](https://github.com/andrei-deeyu/4truckLoad-client#development-responsibilities)
7. [User Class and Characteristics](https://github.com/andrei-deeyu/4truckLoad-client#user-class-and-characteristics)
8. System Features and Requirements

	8.1. [Functional Requirements](https://github.com/andrei-deeyu/4truckLoad-client#functional-requirements)

	8.2. [User Interfaces](https://github.com/andrei-deeyu/4truckLoad-client#user-interfaces)

	8.3. [Hardware Interfaces](https://github.com/andrei-deeyu/4truckLoad-client#hardware-interfaces)

	8.4. [Performance Requirements](https://github.com/andrei-deeyu/4truckLoad-client#performance-requirements)

	8.5. [Safety Requirements](https://github.com/andrei-deeyu/4truckLoad-client#safety-requirements "Safety Requirements")

	8.6. [Security Requirements](https://github.com/andrei-deeyu/4truckLoad-client#security-requirements "Security Requirements")

9. [Software Quality Attributes](https://github.com/andrei-deeyu/4truckLoad-client#software-quality-attributes)


#### Introduction

This document details the project plan for the development of  \`4truckLoad\`.

It is intended for the developer, designer, and tester working on \`4truckLoad\`  as well as project investors. This plan will include a summary of:
* how the system will function
* the scope of the project from the development viewpoint
* the technology used to develop the project, and
* the metrics used to determine the project\`s progress

#### Overall Description
Companies need freight transport to various destinations, especially in the manufacturing industry. The problem is that most companies end up using multiple sources to find the right transporters. The biggest challenge is finding an available transporter, ready to deliver the freight before the deadline. \`4truckLoad\` will solve this problem by creating a freight exchange app, differentiating itself through in-app bids (transport offers). In this way, the clients no longer have to be called many times by the transporters, letting them to choose from a list who they want to hire.

#### Intended Audience

The customers will be manufacturing companies and small transporting businesses. It will not target the general public.

#### Functionality

* Users should be able to sign up with personal PKCE accounts.
* Users with the \`client\` role (the manufacturing companies) should be able to post transportation requests in the board. The requests should contain the freight\`s data  
* Users with the \`transporter\` role should be able to bid offers to the transportation requests
* The application should be able to handle board auto refresh (by websockets) of up to 1000 users at a time.

#### Platform

The application will be developed in Vue.JS to enable the fast creation of a single-page application

These applications will connect to a REST API built with Node.JS to store and retrieve data from a MongoDB database.

Authentication will be through existing PKCE installations (Auth0).

The web application will be hosted on Firebase for it's fast integration, auto deployment, easy globally scaling capabilities and "Pay as you go" plan to reduce costs

#### Development Responsibilities

The developer (Andrei) will be responsible for writing all the code for the application, business integration, developing the database, and managing releases.

#### User Class and Characteristics

There will be a class of users called **transporter** that will have permissions to bid offers to the transportation requests

Standard users, called **clients**, will have access just to add transportation requests in the board.

#### Functional Requirements

* Clients should be able to create transportation requests.
* Transporters should be able to bid private offers to the transportation requests.
* Past agreements should be able to be archived indefinitely in a separate tab so users can reference past contracts.
* Clients should be able to upload images to the transportation requests for reference. Them must be scaled-down for load time performance.
* External Interface Requirements (Auth0)

#### User Interfaces

* Front-end software: Vue.JS
* Back-end software: Node.JS
* Database software: MongoDB
* PKCE connection: Auth0

#### Hardware Interfaces

* Both Android and Windows operating systems through their default web browser
* Non-Functional Requirements

#### Performance Requirements

* The application should load and be usable within 3 seconds
* The application should update the interface on interaction within 2 seconds
* The database should be distributed to prevent outages

#### Safety Requirements

* Databases should use sharding to be redundant to prevent loss of data.
* Backups of the databases should be done hourly and be kept for one week.

#### Security Requirements

* Any keys used for the REST API should be stored securely.
* Only the REST API should be able to connect to the databases.
* Databases should be behind a firewall.

#### Software Quality Attributes
* Availability: Because this application is critical to business communication, I will have a goal of four nines(99.99%) availability.
* Correctness: 
	* The application should never allow anyone to read contact datas not intended for that person. 
	* The transporters must be approved before they\`re allowed to bid offers.
* Maintainability: The application should use **continuous integration** so that features and bug fixes can be deployed quickly without downtime.
* Usability: The interface should be easy to learn without a tutorial and allow users to accomplish their goals without errors.


## [Server](https://github.com/andrei-deeyu/4truckLoad-server) installation

### Project setup
```
npm install
```

### Compiles and live-reloads for development
```
npm run dev
```

### Compiles for production
```
npm run start
```

## Client installation

### Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```
