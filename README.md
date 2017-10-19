# cta-flowcontrol [ ![build status](https://git.sami.int.thomsonreuters.com/compass/cta-flowcontrol/badges/master/build.svg)](https://git.sami.int.thomsonreuters.com/compass/cta-flowcontrol/commits/master) [![coverage report](https://git.sami.int.thomsonreuters.com/compass/cta-flowcontrol/badges/master/coverage.svg)](https://git.sami.int.thomsonreuters.com/compass/cta-flowcontrol/commits/master)

Flow Control Modules for Compass Test Automation, One of Libraries in CTA-OSS Framework

## General Overview

cta-flowcontrol is one of the most important libraries in CTA-OSS Framework. It controls how the application operate.

### Overview

There are 3 modules in this library.

* Cement

* CementHelper

* Context

## Guidelines

We aim to give you brief guidelines here.

1. [Cement](#1-cement)
1. [CementHelper](#2-cementhelper)
1. [Context](#3-context)
1. [Examples](#4-examples)

```javascript
'use strict';

const FlowControl = require('cta-flowcontrol');
```

### 1. Cement

Cement aims to construct, initialize, and start bricks with tools using Cement's [**_Constructor_**](#1-1-constructor) and [**_Configuration_**](#1-2-configuration).

#### 1.1 Constructor
```javascript
class Cement {
  constructor(configuration, basedir) {
    ...
  }
}
```

How to use it..

```javascript
const Cement = FlowControl.Cement;
const config = require('./path/to/config');
const cement = new Cement(config);
```

When we use the **new Cement(**_config_**)**, it will construct, initialize, and start **bricks**.

#### 1.2 Configuration
```javascript
const config = {
  name: string,
  bricks: array,
  tools: array,
  properties: object,
};
```

* __name__ defines the _name_ of **application**
* __bricks__ provides the _array_ of **bricks**, [see example](#4-1-brick-example)
* __tools__ provides the _array_ of **tools**, [see example](#4-2-tool-example)
* __properties__ provides _application_'s **properties**

```javascript
// Example of Cement's Configuration
const b1 = require("brick1");
const b2 = require("brick2");
const b3 = require("brick3");

const t1 = require("tool1");
const t2 = require("tool2");
const t3 = require("tool3");

const config = {
  name: 'SampleApplication',
  bricks: [b1, b2, b3],
  tools: [t1, t2, t3],
  properties: {
    title: "sample title",
    url: "http://192.0.0.1:8081",
  },
};
```

[back to top](#guidelines)

### 2. CementHelper

CementHelper provides the supportive functionalities within the **Brick**.

#### 2.1 require(path)

```javascript
class SampleBrick extends Brick {
  process(context) {
    const sampleModule = this.cementHelper.require("sample-module");
    ...
  }
}
```

CementHelper's **require()** is equivalent to _require()_. It loads a module.

#### 2.2 createContext(data, events)

```javascript
class SampleBrick extends Brick {
  process(context) {
    const data = {
      nature: {
        type: 'type',
        quality: 'quality',
      },
      payload: { }
    };
    
    const otherContext = this.cementHelper.createContext(data, ['operate', 'error']);
    ...
  }
}
```

CementHelper's **createContext()** provides a functionality to _create **context**_ by providing **data** and **events**.
* __data__ defines the provided **data** within _context_, [see example](#4-3-data-as-context-creation-example)
  * __nature__ consists of **type** and **quality**
  * __payload__ contains **anything** as _payload_
* __events__ provides the _array_ of authorized **events** names that are used via _context_

#### 2.3 publish(context)

```javascript
class SampleBrick extends Brick {
  process(context) {
    ...
    this.cementHelper.publish(otherContext);
    ...
  }
}
```

CementHelper's **publish()** provides a functionality to _publish **context**_.
* __data__ defines the provided **data** within _context_
* __events__ provides the _array_ of authorized **events** names that are used via _context_


[back to top](#guidelines)

### 3. Context

Context contains information about **nature** and **payload**.

#### 3.1 publish()

```javascript
class SampleBrick extends Brick {
  process(context) {
    const data = {
      nature: {
        type: 'type',
        quality: 'quality',
      },
      payload: { }
    };

    const otherContext = this.cementHelper.createContext(data, ['operate', 'error']);
    
    otherContext.publish(); // equivalent to this.cementHelper.publish(otherContext);
    ...
  }
}
```

Context's **publish()** is equivalent to _CementHelper's **publish(context)**_. It publishes the context.

[back to top](#guidelines)

### 4. Examples

#### 4.1 Brick Example

```javascript
const brick = {
  name: 'sample brick',
  module: './lib/bricks/cta-sample-brick',
  properties: {},
  publish: [
    {
      topic: 'cta.execution',
      data: [
        {
          nature: {
            type: 'executions',
            quality: 'commandLine',
          },
        },
        {
          nature: {
            type: 'executions',
            quality: 'cancel',
          },
        },
      ],
    },
    {
      topic: 'cta.execution.result',
      data: [
        {
          nature: {
            type: 'results',
            quality: 'execute',
          },
        },
      ],
    },
    {
      topic: 'cta.execution.state',
      data: [
        {
          nature: {
            type: 'states',
            quality: 'create',
          },
        },
      ],
    },
  ],
  subscribe: [
    {
      topic: 'cta.execution',
      data: [
        {
          nature: {
            type: 'executions',
            quality: 'run',
          },
        },
        {
          nature: {
            type: 'executions',
            quality: 'cancel',
          },
        },
        {
          nature: {
            type: 'executions',
            quality: 'process',
          },
        },
      ],
    },
  ],
};
```

#### 4.2 Tool Example

```javascript
const tool = {
  name: 'logger',
  module: 'cta-logger',
  properties: {
    level: 'verbose',
  },
  scope: 'all',
  order: 1,
};
```

#### 4.3 Data as Context Creation Example

```javascript
const data = {
  nature: {
    type: 'executions',
    quality: 'commandLine',
  },
  payload: {
    executionId: execution.id,
  },
};

const otherContext = this.cementHelper.createContext(data, ['operate', 'error']);
```

[back to top](#guidelines)

------

## To Do
