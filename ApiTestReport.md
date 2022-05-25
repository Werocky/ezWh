# Integration and API Test Report

Date:

Version:

# Contents

- [Dependency graph](#dependency graph)

- [Integration approach](#integration)

- [Tests](#tests)

- [Scenarios](#scenarios)

- [Coverage of scenarios and FR](#scenario-coverage)
- [Coverage of non-functional requirements](#nfr-coverage)



# Dependency graph 

![Dependency graph ](/DependencyGraph.PNG)
     
# Integration approach

    The integration approach used is Bottom Up.

Step 1: DB classes tested, which are the interfaces to DB
Step 2: API class tested using multiple classes test units
    


#  Integration Tests

   <define below a table for each integration step. For each integration step report the group of classes under test, and the names of
     Jest test cases applied to them, and the mock ups used, if any> Jest test cases should be here code/server/unit_test

## Step 1
| Classes  | mock up used |Jest test cases |
|--|--|--|
||||

## Step 2
| Classes |Jest test cases |
|--|--|
|InternalOrderAPI, InternalOrderDB|All the methods in testAcceptanceInternalOrders.js|
|PositionAPI, PositionDB|All the methods in testManagePositions.js|
|RestockOrderAPI, RestockOrdersDB|All the methods in testRestockOrders.js|
|ReturnOrderAPI, ReturnOrderDB|All the methods in testReturnOrders.js|
|SKUItemAPI, SKUItemsDB, TestDescriptorAPI, TestDescriptorDB|All the methods in testTestingSKUItems.js|
|SKUAPI, SKUsDB|All the methods in testSKUScenario.js|
|UserAPI, UsersDB|All the methods in testManageUsers.js and in testLogin.js|
|TestDescriptorAPI, TestDescriptorDB|All the methods in testManaTestDescriptors.js|
|ItemAPI, ItemDB|All the methods in testManageItems.js|



# API testing - Scenarios

# Coverage of Scenarios and FR


<Report in the following table the coverage of  scenarios (from official requirements and from above) vs FR. 
Report also for each of the scenarios the (one or more) API Mocha tests that cover it. >  Mocha test cases should be here code/server/test




| Scenario ID | Functional Requirements covered | Mocha  Test(s) | 
| ----------- | ------------------------------- | ----------- | 
|  1.1         | FR2.1                             |   newSKU()          |             
|  1.2         | FR2.1, FR3.1.1                   |   placeSKU()          |             
| 1.3         |      FR2.1, FR3.1.1                           |     modifySKUWeightAndVolume()        |             
| 2.1         |     FR3.1.1                            |    createPosition()         |             
| 2.2         |          FR3.1.1     |             |    changePositionID()         
| 2.3         |         FR3.1.4                        |     modifyPosition()        | 
|   2.5           |    FR3.1.2          |     deletePosition()         | 
|    3.1          |    FR5.1          |     issueRestockOrder()         |            
|    3.2          |   FR5.1           |     issueRestockOrder()         |            
|     4.1         |     FR1.1         |      createUser()        |            
|     4.2         |      FR1.5        |    changeUserRights()          |            
|     4.3         |     FR1.2         |    deleteUser()          |            
|     5.1.1         |     FR5.1, FR5.2, FR5.3, FR5.7, FR5.8, FR5.8.1         |   recordRestockOrderArrival()           |            
|     5.2         |     FR5.8.2         |    allPositiveResults(), somePositiveSomeNegative()          |            
|     6.1         |      FR5.9, FR5.10, FR5.11        |   returnFailedItems()           |            
|      6.2        |      FR5.9, FR5.10, FR5.11         |   returnWrongOrder()           |            
|      7.1        |     FR1.5         |     login()         |            
|      7.2        |      FR1.5        |      logout()        |            
|      9.1        |     FR6.1, FR6.2, FR6.3, FR6.5, FR6.6, FR6.7         |       acceptInternalOrder()       |            
|      9.2        |     FR6.1, FR6.2, FR6.3, FR6.5, FR6.6, FR6.7         |      rejectInternalOrder()        |            
|     9.3         |      FR6.1, FR6.2, FR6.3, FR6.5, FR6.6, FR6.7        |    cancelInternalOrder()          |            
|      10.1        |      FR6.1, FR6.2, FR6.3, FR6.5, FR6.6, FR6.7, FR6.8        |    deliverInternalOrder()          |            
|       11.1       |      FR7
        |     createItem()         |            
|      11.2        |       FR7
       |      modifyDescriptionAndPrice()        |            
|      12.1        |      FR3.2, FR3.2.1, FR3.2.2        |      createTestDescriptor()        |            
|      12.2        |       FR3.2, FR3.2.1, FR3.2.2       |     updateTestDescriptor()         |            
|      12.3        |      FR3.2, FR3.2.1, FR3.2.2        |      deleteTestDescriptor()        |            



# Coverage of Non Functional Requirements


<Report in the following table the coverage of the Non Functional Requirements of the application - only those that can be tested with automated testing frameworks.>


### 

| Non Functional Requirement | Test name |
| -------------------------- | --------- |
|   NFR2                         |    All       |
| NFR4 | testManagePositions.js |
| NFR5 | testManageSKU.js |
| NFR6 | testManageItems.js |
| NFR9 | All including date |


