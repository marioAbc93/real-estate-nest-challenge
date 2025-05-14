## Description

<p>
this is a simple demonstration of an api developed with nest js where you create two get methods, one to get all properties and one to get a particular property by its id
</p>

Project setup

```bash
$ npm install
```

## Folder structure

<p>The project follows a modular structure within the `src/` directory. The main organization is described below:</p>

```bash
src/
├── database/
│   └── properties.json        
└── properties/
├── properties.controller.ts 
├── properties.module.ts  
└── properties.service.ts  
```

## Routes

```bash
/properties
```

```bash
/properties?page={pagenumber}
```

```bash
/properties/:id
```

## Compile and run the project

```bash

# node version
$ 18.18.2

# development
$ npm run start

# watch mode
$ npm run start:dev


