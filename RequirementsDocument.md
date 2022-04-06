 #Requirements Document 

Date: 6 april 2022

Version: 0.8

 
| Version number | Change |
| ----------------- |:-----------|
| | | 


# Contents

- [Informal description](#informal-description)
- [Stakeholders](#stakeholders)
- [Context Diagram and interfaces](#context-diagram-and-interfaces)
	+ [Context Diagram](#context-diagram)
	+ [Interfaces](#interfaces) 
	
- [Stories and personas](#stories-and-personas)
- [Functional and non functional requirements](#functional-and-non-functional-requirements)
	+ [Functional Requirements](#functional-requirements)
	+ [Non functional requirements](#non-functional-requirements)
- [Use case diagram and use cases](#use-case-diagram-and-use-cases)
	+ [Use case diagram](#use-case-diagram)
	+ [Use cases](#use-cases)
    	+ [Relevant scenarios](#relevant-scenarios)
- [Glossary](#glossary)
- [System design](#system-design)
- [Deployment diagram](#deployment-diagram)

# Informal description
Medium companies and retailers need a simple application to manage the relationship with suppliers and the inventory of physical items stocked in a physical warehouse. 
The warehouse is supervised by a manager, who supervises the availability of items. When a certain item is in short supply, the manager issues an order to a supplier. In general the same item can be purchased by many suppliers. The warehouse keeps a list of possible suppliers per item. 

After some time the items ordered to a supplier are received. The items must be quality checked and stored in specific positions in the warehouse. The quality check is performed by specific roles (quality office), who apply specific tests for item (different items are tested differently). Possibly the tests are not made at all, or made randomly on some of the items received. If an item does not pass a quality test it may be rejected and sent back to the supplier. 

Storage of items in the warehouse must take into account the availability of physical space in the warehouse. Further the position of items must be traced to guide later recollection of them.

The warehouse is part of a company. Other organizational units (OU) of the company may ask for items in the warehouse. This is implemented via internal orders, received by the warehouse. Upon reception of an internal order the warehouse must collect the requested item(s), prepare them and deliver them to a pick up area. When the item is collected by the other OU the internal order is completed. 

EZWH (EaSy WareHouse) is a software application to support the management of a warehouse.



# Stakeholders


| Stakeholder name  | Description | 
| ----------------- |:-----------:|
|   Customers     |       People who buy from the retailers/company     | 
|   Suppliers    |      Companies from which items can be purchased       |
|  Warehouse manager     |    Supervises the operations and orders new items        |
|   Warehouse employee     |   Performs day by day tasks in the warehouse       |
|   Quality check department     |     Performs quality test on newly received items        |
|   OUs    |      Other organizational units, which may issue an internal request       |
|   Items DB     |  Contains persistent information about each item           |
|   Competitors     |   Providers of other warehouse management applications          |
|   Warehouse     |   Physical space where items are stored          |
|  Mail service     |   Conveys orders and inernal requests        |

# Context Diagram and interfaces

## Context Diagram
\<Define here Context diagram using UML use case diagram>

\<actors are a subset of stakeholders>

## Interfaces
\<describe here each interface in the context diagram>

\<GUIs will be described graphically in a separate document>

| Actor | Logical Interface | Physical Interface  |
| ------------- |:-------------:| -----:|
|   Warehouse employee     | GUI | Keyboard, monitor  |
|   Quality check department     | GUI | Keyboard, monitor  |
|   Warehouse manager     | GUI | Keyboard, monitor |
|   Mail server     |API  | Internet connection |
|   Items DB     | API | Internet connection/Ethernet cable |
|   Administrator     | GUI/Console/Textual interface | Keyboard, monitor |


# Stories and personas
\<A Persona is a realistic impersonation of an actor. Define here a few personas and describe in plain text how a persona interacts with the system>

\<Persona is-an-instance-of actor>
The following personas and stories are meant to cover different profiles of the Warehouse employee actor

Giuseppe is 42, hates disorganization, he is the type of person that has all meticulously
placed in every drawer, he's precise and likes to optimize physical space avoiding waste. His need is to easy locate a free space to locate an items.

Elizabeth is 37, manages internal order from the request to che choice of the pick up point, she would like to be able to do it in the fastest and most intuitive way possible.

Mark is 29, has worked for the warehouse for three months and has been assigned to the receiving area. Therefore his main interest is to access inventory to manage items quantity and to assign a place to the new supplies.

The following personas and stories are meant to cover different profiles of the Warehouse manager actor

Karim is 52, is the manager of the warehouse since he was 40, he has always done his job using Excel to keep track of all the suppliers and the related orders but the warehouse was smaller and now it is growing very fast so he can't work like this anymore. He would like to have an easy and complete way to issue orders to suppliers for a specific items in a low quantity without having to look for who sells what.


\<stories will be formalized later as scenarios in use cases>


# Functional and non functional requirements

## Functional Requirements

| ID        | Description  |
| ------------- |:-------------:| 
|  FR1     | Manage items |
|  FR1.1     | Define new item descriptor |
|  FR1.2     | Show information on an item |
|  FR1.3     | Add item to the warehouse |
|  FR1.4     | Remove item from the warehouse |
|  FR1.5     | Notify low availability of an item |
|  FR1.6     | Modify information about an item |
|  FR1.7     | Specify result of quality test on an item |
|  FR1.8     | Trace different locations of an item |
|  FR1.9     | Change location of an item |
|  FR2     | Manage users  |
|  FR2.1     | Create user account |
|  FR2.2     | Authenticate and login user |
|  FR3     | Manage suppliers  | 
|  FR3.1     | Show information on a supplier  |
|  FR3.2     | Associate a supplier to an item descriptor|
|  FR3.3     | Disassociate a supplier form an item descriptor|
|  FR3.4     | Show history of orders placed within a supplier |
|  FR4     | Manage orders to suppliers  |
|  FR4.1     | Place order for an item descriptor|
|  FR4.2     | Show history of orders for each  item descriptor|
|  FR5    | Manage locations  |
|  FR5.1     | Manage warehouse locations |
|  FR5.1.1     | Define new location |
|  FR5.1.2     | Remove location |
|  FR5.1.3     | Check availability of a location |
|  FR5.1.4     | Show which locations are available/unavailable |
|  FR5.1.5     | Check what is stored in a specific location |
|  FR5.1.6     | Show history of what was stored in a specific location |
|  FR5.2     | Manage pick up points |
|  FR5.2.1     | Define pick up point |
|  FR5.2.2     | Show status of pick up point |
|  FR5.2.3     | Remove pick up point |
|  FR5.2.4     | Show history of items staged in a pick up point |
|  FR6     | Manage internal transactions |
|  FR6.1     | Show pending internal requests |
|  FR6.2     | Select pick up point |
|  FR6.3     | Show history of internal transactions |

## Non Functional Requirements

\<Describe constraints on functional requirements>

| ID        | Type (efficiency, reliability, ..)           | Description  | Refers to |
| ------------- |:-------------:| :-----:| -----:|
|  NFR1     |   |  | |
|  NFR2     | |  | |
|  NFR3     | | | |
| NFRx .. | | | | 


# Use case diagram and use cases


## Use case diagram
\<define here UML Use case diagram UCD summarizing all use cases, and their relationships>

### Use case 1, UC1 - Create user account
| Actors Involved        | Administrator, accounts DB |
| ------------- |:-------------:| 
|  Precondition     | Account U does not exist |
|  Post condition     | Account U added in the system |
|  Nominal Scenario     | Administrator creates a new account U and populates its fields. |

### Use case 2, UC2 - Modify user account
| Actors Involved        | Administrator, accounts DB |
| ------------- |:-------------:| 
|  Precondition     | Account U exists |
|  Post condition     | - |
|  Nominal Scenario     | Administrator modifies one or more fields of an account U |

### Use case 3, UC3 - Delete user account
| Actors Involved        | Administrator, accounts DB |
| ------------- |:-------------:| 
|  Precondition     | Account U exists |
|  Post condition     | Account U deleted from the system |
|  Nominal Scenario     | Administrator deletes an existing account U |

### Use case 4, UC4 - Create location
| Actors Involved        | Administrator, accounts DB |
| ------------- |:-------------:| 
|  Precondition     | Location L does not exist |
|  Post condition     | Location L added in the system |
|  Nominal Scenario     | Administrator deletes an existing account U |

### Use case 5, UC5 - Modify location
| Actors Involved        | Administrator, accounts DB |
| ------------- |:-------------:| 
|  Precondition     | Location L exists |
|  Post condition     | - |
|  Nominal Scenario     | Administrator modifies one or more fields of an location L |

### Use case 6, UC6 - Delete location
| Actors Involved        | Administrator, accounts DB |
| ------------- |:-------------:| 
|  Precondition     | Location L exists |
|  Post condition     | Location L deleted from the system |
|  Nominal Scenario     | Administrator deletes an existing location L |

### Use case 7, UC7 - Login
| Actors Involved        | Warehouse employee, Warehouse manager, Administrator, accounts DB |
| ------------- |:-------------:| 
|  Precondition     | Account U does not exist |
|  Post condition     | Account U added in the system |
|  Nominal Scenario     | Administrator creates a new account U and populates its fields. |


### Use case 8, UC8 - Add item to warehouse
| Actors Involved        | Warehouse employee, items DB |
| ------------- |:-------------:| 
|  Precondition     | Item descriptor defined, item not already present |
|  Post condition     | Item loaded into the warehouse, items DB updated |
|  Nominal Scenario     | The item stored into the warehouse at a chosen location, the available is updated |
|  Variants     | The item needs to be tested first, it's stored in a special location and the available quantity is unchanged |
|  Exceptions     | The item descriptor is not defined, the item cannot be stored |

### Use case 9, UC9 - Change location of an item
| Actors Involved        | Warehouse employee, items DB |
| ------------- |:-------------:| 
|  Precondition     | Item present somewhere |
|  Post condition     | Item location updated, items DB updated |
|  Nominal Scenario     | The item is moved to a new location |

### Use case 10, UC10 - Test items
| Actors Involved        | Quality check department, items DB |
| ------------- |:-------------:| 
|  Precondition     | Items arrive to the quality check department |
|  Post condition     | Item loaded into the warehouse, items DB updated |
|  Nominal Scenario     | The internal order is processed by choosing a pick up point and changing the location of the items |
|  Exceptions     | The tests are not passed, the items may be rejected |

### Use case 11, UC11 - Manage internal order
| Actors Involved        | Warehouse employee, items DB |
| ------------- |:-------------:| 
|  Precondition     | Internal order available |
|  Post condition     | Items moved to the pick up point, items removed from the availability |
|  Nominal Scenario     | The internal order is processed by choosing a pick up point and changing the location of the items |
|  Exceptions     | The items is not available, the internal order can not be processed |

### Use case 12, UC12 - Issue an external order
| Actors Involved        | Warehouse manager, orders DB |
| ------------- |:-------------:| 
|  Precondition     | Item in short supply |
|  Post condition     | Item ordered from a supplier |
|  Nominal Scenario     | The manager issues an order to one of the available supplier of the needed item |

### Use case 13, UC13 - Create item descriptor
| Actors Involved        | Warehouse manager, items DB |
| ------------- |:-------------:| 
|  Precondition     | Item descriptor not defined |
|  Post condition     | Item descriptor added to the DB |
|  Nominal Scenario     | The manager creates the item descriptor and populates its fields with also the available supplier |

### Use case 14, UC14 - Modify item descriptor
| Actors Involved        | Warehouse manager, items DB |
| ------------- |:-------------:| 
|  Precondition     | Item descriptor exists |
|  Post condition     | - |
|  Nominal Scenario     | The manager modifies the item descriptor |
|  Variant  |  The manager modifies the list of possible suppliers |

### Use case 15, UC15 - Delete item descriptor
| Actors Involved        | Warehouse manager, items DB |
| ------------- |:-------------:| 
|  Precondition     | Item descriptor exists |
|  Post condition     | Item descriptor deleted from the DB |
|  Nominal Scenario     | The warehouse manager deletes an existing item descriptor |

### Use case 16, UC16 - Show inventory
| Actors Involved        | Warehouse employee, Warehouse manager, items DB |
| ------------- |:-------------:| 
|  Precondition     | - |
|  Post condition     | - |
|  Nominal Scenario     | The user see the list of all the items stored in the warehouse |
|  Variant  | Restrict to a certain location |
|  Variant  | Restrict to a certain range of availability |

##### Scenario 14.1 

| Scenario |  Item descriptor fields are wrong |
| ------------- |:-------------:| 
|  Precondition     | Item descriptor exists | 
|  Post condition     | Item descriptor fields are updated  |
| Step#        | Description  |
|  1     | WM choose an item descriptor |  
|  2     |  WM edit some field |
|  3    |  WM saves changes |
|  4    |  Item descriptor in the DB is updated |

##### Scenario 14.2 

| Scenario |  New supplier available |
| ------------- |:-------------:| 
|  Precondition     | Item descriptor exists | 
|  Post condition     | Item descriptor list of possible suppliers is updated  |
| Step#        | Description  |
|  1     | WM choose an item descriptor |  
|  2     |  WM add the new supplier to the list of possible suppliers |
|  3    |  WM saves changes |
|  4    |  Item descriptor in the DB is updated |

# Glossary

\<use UML class diagram to define important terms, or concepts in the domain of the system, and their relationships> 

\<concepts are used consistently all over the document, ex in use cases, requirements etc>

# System Design
\<describe here system design>

\<must be consistent with Context diagram>

# Deployment Diagram 

\<describe here deployment diagram >




