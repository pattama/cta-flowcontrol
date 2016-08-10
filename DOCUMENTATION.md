## Modules

<dl>
<dt><a href="#module_flowcontrol">flowcontrol</a></dt>
<dd><p>Flow Control module</p>
</dd>
</dl>

## Classes

<dl>
<dt><a href="#Cement">Cement</a></dt>
<dd><p>Cement class</p>
</dd>
<dt><a href="#CementHelper">CementHelper</a></dt>
<dd><p>CementHelper class</p>
</dd>
<dt><a href="#Channel">Channel</a></dt>
<dd><p>Channel class</p>
</dd>
<dt><a href="#Context">Context</a></dt>
<dd><p>Context class</p>
</dd>
<dt><a href="#SmartEventEmitter">SmartEventEmitter</a></dt>
<dd><p>SmartEventEmitter class</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#CementBrick">CementBrick</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#JobDefinition">JobDefinition</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#CementConfig">CementConfig</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#BrickConfig">BrickConfig</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Contract">Contract</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#LinkConfig">LinkConfig</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Client">Client</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Job">Job</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="module_flowcontrol"></a>

## flowcontrol
Flow Control module

<a name="Cement"></a>

## Cement
Cement class

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| bricks | <code>[Map.&lt;CementBrick&gt;](#CementBrick)</code> | Map of a CementBrick |


* [Cement](#Cement)
    * [new Cement(configuration, dirname)](#new_Cement_new)
    * [.require(path)](#Cement+require) ⇒ <code>Module</code>
    * [.bootstrap()](#Cement+bootstrap)
    * [.start()](#Cement+start)
    * [.validate(configuration)](#Cement+validate)
    * [.getDestinations(name, [data])](#Cement+getDestinations) ⇒ <code>[Array.&lt;Channel&gt;](#Channel)</code>
    * [.publish(context)](#Cement+publish)

<a name="new_Cement_new"></a>

### new Cement(configuration, dirname)
Creates a new Cement instance


| Param | Type | Description |
| --- | --- | --- |
| configuration | <code>[CementConfig](#CementConfig)</code> | configuration object for instantiating a new Cement |
| dirname | <code>String</code> | the path of the directory to use for the wrapped require() |

<a name="Cement+require"></a>

### cement.require(path) ⇒ <code>Module</code>
Wraps NodeJS require() method and returns the loaded ModuleIf path is a relative path ("./*"), prefix the require() arg with the dirname

**Kind**: instance method of <code>[Cement](#Cement)</code>  

| Param |
| --- |
| path | 

<a name="Cement+bootstrap"></a>

### cement.bootstrap()
Bootstraps the cement,should be called after all bricks are initialized

**Kind**: instance method of <code>[Cement](#Cement)</code>  
<a name="Cement+start"></a>

### cement.start()
Start bricks, to use cement featuresShould be called after the cement is bootstrapped

**Kind**: instance method of <code>[Cement](#Cement)</code>  
<a name="Cement+validate"></a>

### cement.validate(configuration)
Validate all the configuration properties

**Kind**: instance method of <code>[Cement](#Cement)</code>  

| Param | Type | Description |
| --- | --- | --- |
| configuration | <code>[CementConfig](#CementConfig)</code> | configuration object for instantiating a new Cement |

<a name="Cement+getDestinations"></a>

### cement.getDestinations(name, [data]) ⇒ <code>[Array.&lt;Channel&gt;](#Channel)</code>
Get publishing channels of a brickIf data is provided, get only channels where data contract is fulfilled

**Kind**: instance method of <code>[Cement](#Cement)</code>  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | name of the brick |
| [data] | <code>Object</code> | data to be published |

<a name="Cement+publish"></a>

### cement.publish(context)
Publish a Context using channels

**Kind**: instance method of <code>[Cement](#Cement)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>[Context](#Context)</code> | the context to publish |

<a name="CementHelper"></a>

## CementHelper
CementHelper class

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| cement | <code>[Cement](#Cement)</code> | the Cement instance |
| brickName | <code>String</code> | the name of the Brick |


* [CementHelper](#CementHelper)
    * [new CementHelper(cement, brickName, dependencies)](#new_CementHelper_new)
    * [.require(path)](#CementHelper+require) ⇒ <code>Module</code>
    * [.createContext(data, [events])](#CementHelper+createContext) ⇒ <code>[Context](#Context)</code>
    * [.publish(context)](#CementHelper+publish)

<a name="new_CementHelper_new"></a>

### new CementHelper(cement, brickName, dependencies)
Creates a new CementHelper


| Param | Type | Description |
| --- | --- | --- |
| cement | <code>[Cement](#Cement)</code> | the Cement instance |
| brickName | <code>String</code> | the name of the Brick |
| dependencies | <code>object</code> | brick modules dependencies |

<a name="CementHelper+require"></a>

### cementHelper.require(path) ⇒ <code>Module</code>
Returns module loaded by the  Cement wrapped require method

**Kind**: instance method of <code>[CementHelper](#CementHelper)</code>  

| Param |
| --- |
| path | 

<a name="CementHelper+createContext"></a>

### cementHelper.createContext(data, [events]) ⇒ <code>[Context](#Context)</code>
Returns a new Context

**Kind**: instance method of <code>[CementHelper](#CementHelper)</code>  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>[Job](#Job)</code> | the data to publish |
| [events] | <code>Array.&lt;String&gt;</code> | additionnal events to authorize |

<a name="CementHelper+publish"></a>

### cementHelper.publish(context)
Publish a Context

**Kind**: instance method of <code>[CementHelper](#CementHelper)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>[Context](#Context)</code> | the context to publish |

<a name="Channel"></a>

## Channel
Channel class

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| topic | <code>String</code> | the topic (e.g. name) of the channel |
| publishers | <code>[Map.&lt;Client&gt;](#Client)</code> | Map of the expected publishers (data contract and brick instance) |
| subscribers | <code>[Map.&lt;Client&gt;](#Client)</code> | Map of the expected subscribers (data contract and brick instance) |


* [Channel](#Channel)
    * [new Channel()](#new_Channel_new)
    * [.addPublisher()](#Channel+addPublisher)
    * [.canPublish()](#Channel+canPublish)
    * [.addSubscriber()](#Channel+addSubscriber)
    * [.canConsume()](#Channel+canConsume) ⇒ <code>Boolean</code>
    * [.getSubscribers()](#Channel+getSubscribers) ⇒ <code>Array.&lt;String&gt;</code>
    * [.publish()](#Channel+publish)

<a name="new_Channel_new"></a>

### new Channel()
Creates a new Channel

<a name="Channel+addPublisher"></a>

### channel.addPublisher()
Adds a publisher and its data contractsIf already exists, retrieves the publisher and adds the new contracts

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | name of the publisher |
| data | <code>Array.&lt;Object&gt;</code> | Array of data contracts |
| brick | <code>Object</code> | Brick instance |

<a name="Channel+canPublish"></a>

### channel.canPublish()
Checks if a publisher can publish some data on this channel

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | name of the publisher |
| data | <code>Object</code> | data to publish |

<a name="Channel+addSubscriber"></a>

### channel.addSubscriber()
Adds a subscriber and its data contractsIf already exists, retrieves the subscriber and adds the new contracts

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | name of the subscriber |
| data | <code>Array.&lt;Object&gt;</code> | Array of data contracts |
| brick | <code>Object</code> | Brick instance |

<a name="Channel+canConsume"></a>

### channel.canConsume() ⇒ <code>Boolean</code>
Checks if a subscriber can consume some data on this channel

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | name of the subscriber |
| data | <code>Object</code> | data to consume |

<a name="Channel+getSubscribers"></a>

### channel.getSubscribers() ⇒ <code>Array.&lt;String&gt;</code>
Gets names of subscribers that can consume specified data on this channel

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | name of the subscriber |
| data | <code>Object</code> | data to consume |

<a name="Channel+publish"></a>

### channel.publish()
Publishes a message on this channel and make subscribers consume it

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| context | <code>[Context](#Context)</code> | Context to publish |

<a name="Context"></a>

## Context
Context class

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| cementHelper | <code>[CementHelper](#CementHelper)</code> |  |
| from | <code>String</code> | the name of the brick which created this Context |
| data | <code>[Job](#Job)</code> | the data to publish |
| authorizedEvents | <code>Set.&lt;String&gt;</code> | events for which listeners can be added |


* [Context](#Context)
    * [new Context(cementHelper, data, [events])](#new_Context_new)
    * [.publish()](#Context+publish)

<a name="new_Context_new"></a>

### new Context(cementHelper, data, [events])
Creates a new Context


| Param | Type | Description |
| --- | --- | --- |
| cementHelper | <code>[CementHelper](#CementHelper)</code> |  |
| data | <code>[Job](#Job)</code> | the data to publish |
| [events] | <code>Array.&lt;String&gt;</code> | additionnal events to authorize |

<a name="Context+publish"></a>

### context.publish()
Publish this Context

**Kind**: instance method of <code>[Context](#Context)</code>  
<a name="SmartEventEmitter"></a>

## SmartEventEmitter
SmartEventEmitter class

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| authorizedEvents | <code>Set.&lt;String&gt;</code> | Set of authorized events |


* [SmartEventEmitter](#SmartEventEmitter)
    * [new SmartEventEmitter()](#new_SmartEventEmitter_new)
    * [.setAuthorizedEvents(authorizedEvents)](#SmartEventEmitter+setAuthorizedEvents)

<a name="new_SmartEventEmitter_new"></a>

### new SmartEventEmitter()
Creates a SmartEventEmitter instance

<a name="SmartEventEmitter+setAuthorizedEvents"></a>

### smartEventEmitter.setAuthorizedEvents(authorizedEvents)
Add events to the authorizedEvents Set

**Kind**: instance method of <code>[SmartEventEmitter](#SmartEventEmitter)</code>  

| Param | Type | Description |
| --- | --- | --- |
| authorizedEvents | <code>Array.&lt;String&gt;</code> | Array of authorized events |

<a name="CementBrick"></a>

## CementBrick : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| configuration | <code>[BrickConfig](#BrickConfig)</code> | the configuration data of the Brick |
| cementHelper | <code>[CementHelper](#CementHelper)</code> | the instance of CementHelper related to the Brick |
| instance | <code>Brick</code> | the instance of the Brick |

<a name="JobDefinition"></a>

## JobDefinition : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | <code>String</code> | type of Jobs that should be permitted |
| quality | <code>String</code> | quality of Jobs that should be permitted |
| except | <code>Boolean</code> | if true, deny Jobs instead of permitting. Permit everything else. |

<a name="CementConfig"></a>

## CementConfig : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| bricks | <code>[Array.&lt;BrickConfig&gt;](#BrickConfig)</code> | array of brick configurations |

<a name="BrickConfig"></a>

## BrickConfig : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | name of the brick instance (should be unique) |
| module | <code>String</code> | path or name of the brick module |
| properties | <code>Object</code> | properties to instantiate the brick (see the module definition) |
| publish | <code>[Array.&lt;Contract&gt;](#Contract)</code> | Array of Contract for publishing data |
| subscribe | <code>[Array.&lt;Contract&gt;](#Contract)</code> | Array of Contract for subscribing to data |

<a name="Contract"></a>

## Contract : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| topic | <code>String</code> | the topic of the data (e.g. channel) |
| data | <code>Array.&lt;Object&gt;</code> | Array of data definition |

<a name="LinkConfig"></a>

## LinkConfig : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | name of the brick instance to link (a BrickConfig defining it should exist) |
| jobs | <code>[Array.&lt;JobDefinition&gt;](#JobDefinition)</code> | array of definitions of Jobs (e.g. nature) permitted or denied to be sent. If empty or undefined, all data will be permitted. |

<a name="Client"></a>

## Client : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | name of the brick |
| value | <code>Object</code> |  |
| value.data | <code>Array.&lt;Object&gt;</code> | Array of data contracts |
| value.instance | <code>Object</code> | instance of brick |

<a name="Job"></a>

## Job : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | id of the job |
| nature | <code>Object</code> | nature description of the job |
| nature.quality | <code>String</code> | quality of the job |
| nature.type | <code>String</code> | type of the job |
| payload | <code>Object</code> | payload of the job |

