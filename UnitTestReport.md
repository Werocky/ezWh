# Unit Testing Report

Date:

Version:

# Contents

- [Black Box Unit Tests](#black-box-unit-tests)




- [White Box Unit Tests](#white-box-unit-tests)


# Black Box Unit Tests

    <Define here criteria, predicates and the combination of predicates for each function of each class.
    Define test cases to cover all equivalence classes and boundary conditions.
    In the table, report the description of the black box test case and (traceability) the correspondence with the Jest test case writing the 
    class and method name that contains the test case>
    <Jest tests  must be in code/server/unit_test  >

 
 

 ### **Class *InternalOrderDB* - method *createItternalOrder***



**Criteria for method *createItternalOrder*:**
	

 - Issue Date
 - Products
 - Customer ID
 - Order State



**Predicates for method *createItternalOrder*:**


| Criteria | Predicate |
| -------- | --------- |
|     Issue Date     |     WF      |
|     Products     |     WF      |
|     Customer ID     |     c >= 0      |
|     Order State     |      WF      |




**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     Issue Date     |        WF         |
|          |        not WF         |
|     Products     |        WF         |
|          |        not WF         |
|     Customer ID     |        c >= 0         |
|          |        c < 0         |
|     Order State     |        WF         |
|          |        not WF         |



**Combination of predicates**:


| Issue Date | Products | Customer ID | Order State | Valid/Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|
| WF | WF | c >= 0 | WF | Valid | T1("2021/11/29 09:33",WF,2,"Completed";Internal Order Created) |  |
|    |    |        | not WF | Invalid | T2("2021/11/29 09:33",WF,2,1;error) |  |
|    |    | c < 0 | WF | Invalid | T3("2021/11/29 09:33",WF,-2,"Completed";error) |  |
|    |    |        | not WF | Invalid | T4("2021/11/29 09:33",WF,-2,1;error) |  |
|    | not WF | c >= 0 | WF | Invalid | T5("2021/11/29 09:33",not WF,2,"Completed";error) |  |
|    |    |        | not WF | Invalid | T6("2021/11/29 09:33",not WF,-2,1;error) |  |
|    |    | c < 0 | WF | Invalid | T7("2021/11/29 09:33",not WF,2,"Completed";error) |  |
|    |    |        | not WF | Invalid | T8("2021/11/29 09:33",not WF,-2,1;error) |  |
| not WF | WF | c >= 0 | WF | Valid | T9("2021-11-29 09:33",WF,2,"Completed";error) |  |
|    |    |        | not WF | Invalid | T10("2021-11-29 09:33",WF,2,1;error) |  |
|    |    | c < 0 | WF | Invalid | T11("2021-11-29 09:33",WF,-2,"Completed";error) |  |
|    |    |        | not WF | Invalid | T12("2021-11-29 09:33",WF,-2,1;error) |  |
|    | not WF | c >= 0 | WF | Invalid | T13("2021-11-29 09:33",not WF,2,"Completed";error) |  |
|    |    |        | not WF | Invalid | T14("2021-11-29 09:33",not WF,2,1;error) |  |
|    |    | c < 0 | WF | Invalid | T15("2021-11-29 09:33",not WF,-2,"Completed";error) |  |
|    |    |        | not WF | Invalid | T16("2021-11-29 09:33",not WF,-2,1;error) |  |




  ### **Class *InternalOrderDB* - method *getInternalOrder***



**Criteria for method *getInternalOrder*:**
	

 - Internal Order ID



**Predicates for method *getInternalOrder*:**


| Criteria | Predicate |
| -------- | --------- |
|     Internal Order ID     |     i >= 0      |




**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     Internal Order ID     |        i >= 0         |
|          |        i < 0         |



**Combination of predicates**:


| Internal Order ID | Valid/Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| i >= 0 | Valid | T1("1111";Internal Order Returned) |  |
| i < 0 | Invalid | T2(-1111;error) |  |




 ### **Class *InternalOrderDB* - method *changeState***



**Criteria for method *changeState*:**
	

 - Internal Order ID
 - New State



**Predicates for method *changeState*:**


| Criteria | Predicate |
| -------- | --------- |
|     Internal Order ID     |     i >= 0      |
|     New State     |      WF      |




**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     Internal Order ID     |        i >= 0         |
|          |        i < 0         |
|     New State     |        WF         |
|          |        not WF         |



**Combination of predicates**:


| Internal Order ID | New State | Valid/Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
| i >= 0 | WF | Valid | T1(1111;State Changed) |  |
|        | not WF | Invalid | T2(1111;error) |  |
| i < 0 | WF | Invalid | T3(-1111;error) |  |
|       | not WF | Invalid | T4(1111;error) |  |




 ### **Class *InternalOrderDB* - method *deleteInternalOrder***



**Criteria for method *deleteInternalOrder*:**
	

 - Internal Order ID



**Predicates for method *deleteInternalOrder*:**


| Criteria | Predicate |
| -------- | --------- |
|     Internal Order ID     |     i >= 0      |




**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     Internal Order ID     |        i >= 0         |
|          |        i < 0         |



**Combination of predicates**:


| Internal Order ID | Valid/Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| i >= 0 | Valid | T1(1111;Internal Order Deleted) |  |
| i < 0 | Invalid | T2(-1111;error) |  |



  
  ### **Class *ItemDB* - method *getItemById***



**Criteria for method *getItemById*:**
	

 - Range of ID



**Predicates for method *getItemById*:**


| Criteria | Predicate |
| -------- | --------- |
|     Range of ID     |     i >= 0      |




**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     Range of ID     |        i >= 0         |
|          |        i < 0         |



**Combination of predicates**:


| Range of ID | Valid/Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| i >= 0 | Valid | T1(1111;Item Returned) |
| i < 0 | Invalid | T2(-1111;error) |




### **Class *ItemDB* - method *createItem***



**Criteria for method *createItem*:**
	

 - ID Range
 - Item Description
 - Price Range
 - SKU ID Range
 - Supplier ID Range



**Predicates for method *createItem*:**


| Criteria | Predicate |
| -------- | --------- |
|     ID Range     |     i >= 0      |
|     Item Description     |     WF      |
|     Price Range     |     p >= 0      |
|     SKU ID Range     |     k >= 0      |
|     Supplier ID Range     |     s >= 0      |




**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     ID Range     |        i >= 0         |
|          |        i < 0         |
|     Item Description     |        WF         |
|          |        not WF         |
|     Price Range     |        p >= 0         |
|          |        p < 0         |
|     SKU ID Range     |        k >= 0         |
|          |        k < 0         |
|     Supplier ID Range     |        s >= 0         |
|          |        s < 0         |



**Combination of predicates**:


| ID Range | Item Description | Price Range | SKU ID Range | Supplier ID Range | Valid/Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|-------|
| i >= 0 | WF | p >= 0 | k >= 0 | s >= 0 | Valid | T1(11,"des",4.4,2,33;Item Created) |  |
|        |    |        |        | s < 0 | Invalid | T2(11,"des",4.4,2,-33;error) |  |
|        |    |        | k < 0 | s >= 0 | Invalid | T3(11,"des",4.4,-2,33;error) |  |
|        |    |        |        | s < 0 | Invalid | T4(11,"des",4.4,-2,-33;error) |  |
|        |    | p < 0 | k >= 0 | s >= 0 | Invalid | T5(11,"des",-4.4,2,33;error) |  |
|        |    |        |        | s < 0 | Invalid | T6(11,"des",-4.4,2,-33;error) |  |
|        |    |        | k < 0 | s >= 0 | Invalid | T7(11,"des",-4.4,-2,33;error) |  |
|        |    |        |        | s < 0 | Invalid | T8(11,"des",-4.4,-2,-33;error) |  |
|        | not WF | p >= 0 | k >= 0 | s >= 0 | Invalid | T9(11,4.4,2,33;Item Created) |  |
|        |    |        |        | s < 0 | Invalid | T10(11,4.4,2,-33;error) |  |
|        |    |        | k < 0 | s >= 0 | Invalid | T11(11,4.4,-2,33;error) |  |
|        |    |        |        | s < 0 | Invalid | T12(11,4.4,-2,-33;error) |  |
|        |    | p < 0 | k >= 0 | s >= 0 | Invalid | T13(11,-4.4,2,33;error) |  |
|        |    |        |        | s < 0 | Invalid | T14(11,-4.4,2,-33;error) |  |
|        |    |        | k < 0 | s >= 0 | Invalid | T15(11,-4.4,-2,33;error) |  |
|        |    |        |        | s < 0 | Invalid | T16(11,-4.4,-2,-33;error) |  |
| i < 0 | WF | p >= 0 | k >= 0 | s >= 0 | Invalid | T17(-11,4.4,2,33;error) |  |
|        |    |        |        | s < 0 | Invalid | T18(-11,"des",4.4,2,-33;error) |  |
|        |    |        | k < 0 | s >= 0 | Invalid | T19(-11,"des",4.4,-2,33;error) |  |
|        |    |        |        | s < 0 | Invalid | T20(-11,"des",4.4,-2,-33;error) |  |
|        |    | p < 0 | k >= 0 | s >= 0 | Invalid | T21(-11,"des",-4.4,2,33;error) |  |
|        |    |        |        | s < 0 | Invalid | T22(-11,"des",-4.4,2,-33;error) |  |
|        |    |        | k < 0 | s >= 0 | Invalid | T23(-11,"des",-4.4,-2,33;error) |  |
|        |    |        |        | s < 0 | Invalid | T24(-11,"des",-4.4,-2,-33;error) |  |
|        | not WF | p >= 0 | k >= 0 | s >= 0 | Invalid | T25(-11,22,4.4,2,33;error) |  |
|        |    |        |        | s < 0 | Invalid | T26(-11,22,4.4,2,-33;error) |  |
|        |    |        | k < 0 | s >= 0 | Invalid | T27(-11,22,4.4,-2,33;error) |  |
|        |    |        |        | s < 0 | Invalid | T28(-11,22,4.4,-2,-33;error) |  |
|        |    | p < 0 | k >= 0 | s >= 0 | Invalid | T29(-11,22,-4.4,2,33;error) |  |
|        |    |        |        | s < 0 | Invalid | T30(-11,22,-4.4,2,-33;error) |  |
|        |    |        | k < 0 | s >= 0 | Invalid | T31(-11,22,-4.4,-2,33;error) |  |
|        |    |        |        | s < 0 | Invalid | T32(-11,22,-4.4,-2,-33;error) |  |



 
 ### **Class *ItemDB* - method *changeItem***



**Criteria for method *changeItem*:**
	

 - ID Range
 - Old ID Range
 - Item Description
 - Price Range
 - SKU ID Range
 - Supplier ID Range




**Predicates for method *changeItem*:**


| Criteria | Predicate |
| -------- | --------- |
|     ID Range     |     i >= 0      |
|     Old ID Range     |     i >= 0      |
|     Item Description     |     WF      |
|     Price Range     |     p >= 0      |
|     SKU ID Range     |     k >= 0      |
|     Supplier ID Range     |     s >= 0      |





**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     ID Range     |        i >= 0         |
|          |        i < 0         |
|     Old ID Range     |        i >= 0         |
|          |        i < 0         |
|     Item Description     |        WF         |
|          |        not WF         |
|     Price Range     |        p >= 0         |
|          |        p < 0         |
|     SKU ID Range     |        k >= 0         |
|          |        k < 0         |
|     Supplier ID Range     |        s >= 0         |
|          |        s < 0         |




**Combination of predicates**:


| ID Range | Old ID Range | Item Description | Price Range | SKU ID Range | Supplier ID Range | Valid/Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|-------|-------|
| i >= 0 | o >= 0 | WF | p >= 0 | k >= 0 | s >= 0 | Valid | T1(11,2,"des",4.4,2,33;Item Created) |  |
|        |        |    |        |        | s < 0 | Invalid | T2(11,2,"des",4.4,2,-33;error) |  |
|        |        |    |        | k < 0 | s >= 0 | Invalid | T3(11,2,"des",4.4,-2,33;error) |  |
|        |        |    |        |        | s < 0 | Invalid | T4(11,2,"des",4.4,-2,-33;error) |  |
|        |        |    | p < 0 | k >= 0 | s >= 0 | Invalid | T5(11,2,"des",-4.4,2,33;error) |  |
|        |        |    |        |        | s < 0 | Invalid | T6(11,2,"des",-4.4,2,-33;error) |  |
|        |        |    |        | k < 0 | s >= 0 | Invalid | T7(11,2,"des",-4.4,-2,33;error) |  |
|        |        |    |        |        | s < 0 | Invalid | T8(11,2,"des",-4.4,-2,-33;error) |  |
|        |        | not WF | p >= 0 | k >= 0 | s >= 0 | Invalid | T1(11,2,22,4.4,2,33;Item Created) |  |
|        |        |    |        |        | s < 0 | Invalid | T2(11,2,22,4.4,2,-33;error) |  |
|        |        |    |        | k < 0 | s >= 0 | Invalid | T3(11,2,22,4.4,-2,33;error) |  |
|        |        |    |        |        | s < 0 | Invalid | T4(11,2,22,2,22,4.4,-2,-33;error) |  |
|        |        |    | p < 0 | k >= 0 | s >= 0 | Invalid | T5(11,2,22,-4.4,2,33;error) |  |
|        |        |    |        |        | s < 0 | Invalid | T6(11,2,22,-4.4,2,-33;error) |  |
|        |        |    |        | k < 0 | s >= 0 | Invalid | T7(11,2,22,-4.4,-2,33;error) |  |
|        |        |    |        |        | s < 0 | Invalid | T8(11,2,22,-4.4,-2,-33;error) |  |
|        | o < 0 | WF | p >= 0 | k >= 0 | s >= 0 | Valid | T1(11,-2,"des",4.4,2,33;Item Created) |  |
|        |        |    |        |        | s < 0 | Invalid | T2(11,-2,"des",4.4,2,-33;error) |  |
|        |        |    |        | k < 0 | s >= 0 | Invalid | T3(11,-2,"des",4.4,-2,33;error) |  |
|        |        |    |        |        | s < 0 | Invalid | T4(11,-2,"des",4.4,-2,-33;error) |  |
|        |        |    | p < 0 | k >= 0 | s >= 0 | Invalid | T5(11,-2,"des",-4.4,2,33;error) |  |
|        |        |    |        |        | s < 0 | Invalid | T6(11,-2,"des",-4.4,2,-33;error) |  |
|        |        |    |        | k < 0 | s >= 0 | Invalid | T7(11,-2,"des",-4.4,-2,33;error) |  |
|        |        |    |        |        | s < 0 | Invalid | T8(11,-2,"des",-4.4,-2,-33;error) |  |
|        |        | not WF | p >= 0 | k >= 0 | s >= 0 | Invalid | T1(11,-2,"des",4.4,2,33;Item Created) |  |
|        |        |    |        |        | s < 0 | Invalid | T2(11,-2,"des",4.4,2,-33;error) |  |
|        |        |    |        | k < 0 | s >= 0 | Invalid | T3(11,-2,"des",4.4,-2,33;error) |  |
|        |        |    |        |        | s < 0 | Invalid | T4(11,-2,"des",4.4,-2,-33;error) |  |
|        |        |    | p < 0 | k >= 0 | s >= 0 | Invalid | T5(11,-2,"des",-4.4,2,33;error) |  |
|        |        |    |        |        | s < 0 | Invalid | T6(11,-2,"des",-4.4,2,-33;error) |  |
|        |        |    |        | k < 0 | s >= 0 | Invalid | T7(11,-2,"des",-4.4,-2,33;error) |  |
|        |        |    |        |        | s < 0 | Invalid | T8(11,-2,"des",-4.4,-2,-33;error) |  |
| i < 0 | o >= 0 | WF | p >= 0 | k >= 0 | s >= 0 | Valid | T1(-11,2,"des",4.4,2,33;Item Created) |  |
|        |        |    |        |        | s < 0 | Invalid | T2(-11,2,"des",4.4,2,-33;error) |  |
|        |        |    |        | k < 0 | s >= 0 | Invalid | T3(-11,2,"des",4.4,-2,33;error) |  |
|        |        |    |        |        | s < 0 | Invalid | T4(-11,2,"des",4.4,-2,-33;error) |  |
|        |        |    | p < 0 | k >= 0 | s >= 0 | Invalid | T5(-11,2,"des",-4.4,2,33;error) |  |
|        |        |    |        |        | s < 0 | Invalid | T6(-11,2,"des",-4.4,2,-33;error) |  |
|        |        |    |        | k < 0 | s >= 0 | Invalid | T7(-11,2,"des",-4.4,-2,33;error) |  |
|        |        |    |        |        | s < 0 | Invalid | T8(-11,2,"des",-4.4,-2,-33;error) |  |
|        |        | not WF | p >= 0 | k >= 0 | s >= 0 | Invalid | T1(-11,2,22,4.4,2,33;Item Created) |  |
|        |        |    |        |        | s < 0 | Invalid | T2(-11,2,22,4.4,2,-33;error) |  |
|        |        |    |        | k < 0 | s >= 0 | Invalid | T3(-11,2,22,4.4,-2,33;error) |  |
|        |        |    |        |        | s < 0 | Invalid | T4(-11,2,22,2,22,4.4,-2,-33;error) |  |
|        |        |    | p < 0 | k >= 0 | s >= 0 | Invalid | T5(-11,2,22,-4.4,2,33;error) |  |
|        |        |    |        |        | s < 0 | Invalid | T6(-11,2,22,-4.4,2,-33;error) |  |
|        |        |    |        | k < 0 | s >= 0 | Invalid | T7(-11,2,22,-4.4,-2,33;error) |  |
|        |        |    |        |        | s < 0 | Invalid | T8(-11,2,22,-4.4,-2,-33;error) |  |
|        | o < 0 | WF | p >= 0 | k >= 0 | s >= 0 | Valid | T1(-11,-2,"des",4.4,2,33;Item Created) |  |
|        |        |    |        |        | s < 0 | Invalid | T2(-11,-2,"des",4.4,2,-33;error) |  |
|        |        |    |        | k < 0 | s >= 0 | Invalid | T3(-11,-2,"des",4.4,-2,33;error) |  |
|        |        |    |        |        | s < 0 | Invalid | T4(-11,-2,"des",4.4,-2,-33;error) |  |
|        |        |    | p < 0 | k >= 0 | s >= 0 | Invalid | T5(-11,-2,"des",-4.4,2,33;error) |  |
|        |        |    |        |        | s < 0 | Invalid | T6(-11,-2,"des",-4.4,2,-33;error) |  |
|        |        |    |        | k < 0 | s >= 0 | Invalid | T7(-11,-2,"des",-4.4,-2,33;error) |  |
|        |        |    |        |        | s < 0 | Invalid | T8(-11,-2,"des",-4.4,-2,-33;error) |  |
|        |        | not WF | p >= 0 | k >= 0 | s >= 0 | Invalid | T1(-11,-2,"des",4.4,2,33;Item Created) |  |
|        |        |    |        |        | s < 0 | Invalid | T2(-11,-2,"des",4.4,2,-33;error) |  |
|        |        |    |        | k < 0 | s >= 0 | Invalid | T3(-11,-2,"des",4.4,-2,33;error) |  |
|        |        |    |        |        | s < 0 | Invalid | T4(-11,-2,"des",4.4,-2,-33;error) |  |
|        |        |    | p < 0 | k >= 0 | s >= 0 | Invalid | T5(-11,-2,"des",-4.4,2,33;error) |  |
|        |        |    |        |        | s < 0 | Invalid | T6(-11,-2,"des",-4.4,2,-33;error) |  |
|        |        |    |        | k < 0 | s >= 0 | Invalid | T7(-11,-2,"des",-4.4,-2,33;error) |  |
|        |        |    |        |        | s < 0 | Invalid | T8(-11,-2,"des",-4.4,-2,-33;error) |  |
 
 
 
 ### **Class *ItemDB* - method *deleteItem***



**Criteria for method *deleteItem*:**
	

 - Range of ID



**Predicates for method *deleteItem*:**


| Criteria | Predicate |
| -------- | --------- |
|     Range of ID     |     i >= 0      |




**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     Range of ID     |        i >= 0         |
|          |        i < 0         |



**Combination of predicates**:


| Range of ID | Valid/Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| i >= 0 | Valid | T1("1111";Item Deleted) |
| i < 0 | Invalid | T2(-1111;error) |
 
 
  

 ### **Class *PositionDB* - method *getPosition***



**Criteria for method *getPosition*:**

 - Position ID Length




**Predicates for method *getPosition*:**


| Criteria | Predicate |
| -------- | --------- |
|     Position ID Length     |     p = 12      |



**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     Position ID Length     |        p = 12         |
|          |        p != 12         |



**Combination of predicates**:


| ID Length | Valid/Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| i = 12 | Valid | T3("111122223333";"1111","2222","3333","maxWeight","maxVolume","occupiedWeight","occupiedVolume",) |
| i != 12 | Invalid | T1("1111222233334";error) |



 ### **Class *PositionDB* - method *createPosition***



**Criteria for method *createPosition*:**
	

 - aisle ID Length
 - row Length
 - col Length
 - Max. Weight
 - Max. Volume




**Predicates for method *createPosition*:**


| Criteria | Predicate |
| -------- | --------- |
|     aisleID Length     |     a = 4      |
|     row Length     |     r = 4      |
|     col Length     |     c = 4      |
|     Max. Weight     |     w > 0      |
|     Max. Volume     |     v > 0      |




**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
| aisleID Length | a != 4 |
|          |        a = 4         |
| row Length |        r != 4         |
|          |        r = 4        |
| col Length |        c != 4         |
|          |        c = 4         |
|     Max. Weight     |     w > 0      |
|          |     w <= 0      |
|     Max. Volume     |     v > 0      |
|          |     v <= 0      |



**Combination of predicates**:


| aisleID Length | row | col | maxWeight | maxVol | Valid/Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|-------|
| a = 4 | r = 4 | c = 4 | w <= 0 | v <= 0 | Invalid | T1("1111","2222","3333";error) |       |
|       |       |       |        | v > 0 | Invalid | T1("1111","2222","3333";error) |       |
|       |       |       | w > 0 | v <= 0 | Invalid | T1("1111","2222","3333";error) |       |
|       |       |       |        | v > 0 | Valid | T1("1111","2222","3333";"111122223333",maxWeight,maxVolume) ) |       |
|       |       | c != 4 | w <= 0 | v <= 0 | Invalid | T1("1111","2222","33334";error) |       |
|       |       |       |        | v > 0 | Invalid | T1("1111","2222","33334";error) |       |
|       |       |       | w > 0 | v <= 0 | Invalid | T1("1111","2222","333";error) |       |
|       |       |       |        | v > 0 | Invalid | T1("1111","2222","333";error) |       |
|       | r != 4 | c = 4 | w <= 0 | v <= 0 | Invalid | T1("1111","2223","3333";error) |       |
|       |       |       |        | v > 0 | Invalid | T1("1111","222","3333";error) |       |
|       |       |       | w > 0 | v <= 0 | Invalid | T1("1111","22223","3333";error) |       |
|       |       |       |        | v > 0 | Invalid | T1("1111","222","3333";error) |       |
|       |       | c != 4 | w <= 0 | v <= 0 | Invalid | T1("1111","22223","33334";error) |       |
|       |       |       |        | v > 0 | Invalid | T1("1111","222","33334";error) |       |
|       |       |       | w > 0 | v <= 0 | Invalid | T1("1111","22223","333";error) |       |
|       |       |       |        | v > 0 | Invalid | T1("1111","222","333";error) |       |
| a != 4 | r = 4 | c = 4 | w <= 0 | v <= 0 | Invalid | T1("11112","2222","3333";error) |       |
|       |       |       |        | v > 0 | Invalid | T1("111","2222","3333";error) |       |
|       |       |       | w > 0 | v <= 0 | Invalid | T1("11112","2222","3333";error) |       |
|       |       |       |        | v > 0 | Invalid | T1("111","2222","3333";"111122223333",maxWeight,maxVolume) ) |       |
|       |       | c != 4 | w <= 0 | v <= 0 | Invalid | T1("11112","2222","33334";error) |       |
|       |       |       |        | v > 0 | Invalid | T1("111","2222","33334";error) |       |
|       |       |       | w > 0 | v <= 0 | Invalid | T1("11112","2222","333";error) |       |
|       |       |       |        | v > 0 | Invalid | T1("111","2222","333";error) |       |
|       | r != 4 | c = 4 | w <= 0 | v <= 0 | Invalid | T1("11112","2223","3333";error) |       |
|       |       |       |        | v > 0 | Invalid | T1("111","222","3333";error) |       |
|       |       |       | w > 0 | v <= 0 | Invalid | T1("11112","22223","3333";error) |       |
|       |       |       |        | v > 0 | Invalid | T1("111","222","3333";error) |       |
|       |       | c != 4 | w <= 0 | v <= 0 | Invalid | T1("11112","22223","33334";error) |       |
|       |       |       |        | v > 0 | Invalid | T1("111","222","33334";error) |       |
|       |       |       | w > 0 | v <= 0 | Invalid | T1("11112","22223","333";error) |       |
|       |       |       |        | v > 0 | Invalid | T1("1111","222","333";error) |       |



 ### **Class *PositionDB* - method *changePosition***



**Criteria for method *changePosition*:**
	

 - position ID Length
 - aisle ID Length
 - row Length
 - col Length
 - Max. Weight
 - Max. Volume





**Predicates for method *changePosition*:**


| Criteria | Predicate |
| -------- | --------- |
|     positionID Length     |     p = 12      |
|     aisleID Length     |     a = 4      |
|     row Length     |     r = 4      |
|     col Length     |     c = 4      |
|     Max. Weight     |     w > 0      |
|     Max. Volume     |     v > 0      |





**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
| positionID Length | p != 12 |
|          |        p = 12         |
| aisleID Length | a != 4 |
|          |        a = 4         |
| row Length |        r != 4         |
|          |        r = 4        |
| col Length |        c != 4         |
|          |        c = 4         |
| Max. Weight | p != 12 |
|          |        p = 12         |
| Max. Volume | a != 4 |
|          |        a = 4         |



**Combination of predicates**:


| positionID | aisleID Length | row | col | Max. Weight | Max. Volume | Valid/Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|-------|-------|
| p != 12 | a != 4 | r != 4 | c != 4 | w > 0 | v > 0 | Invalid | T1("1111222233334","11111,"22222","33333";error) |       |
||        |        |        |        | v <= 0 | Invalid | T2("1111222233334","11111,"22222","33333";error) |       |
||         |        |        | w <= 0 | v > 0 | Invalid | T3("1111222233334","11111,"22222","33333";error) |       |
||         |        |        |        | v <= 0 | Invalid | T4("1111222233334","11111,"22222","33333";error) |       |
||         |       | c = 4 | w > 0 | v > 0 | Invalid | T5("1111222233334","11111","22222","3333";error) |       |
||         |       |       |       | v <= 0 | Invalid | T6("1111222233334","11111","22222","3333";error) |       |
||        |        |        | w <= 0 | v > 0 | Invalid | T7("1111222233334","11111,"22222","3333";error) |       |
||        |        |        |        | v <= 0 | Invalid | T8("1111222233334","11111,"22222","3333";error) |       |
||        | r = 4 | c != 4 | w > 0 | v > 0 | Invalid | T9("1111222233334","11112,"2222","33333";error) |       |
||        |       |        | w > 0 | v <= 0 | Invalid | T10("1111222233334","11111,"2222","33333";error) |       |
||         |        |        | w <= 0 | v > 0 | Invalid | T11("1111222233334","11111,"2222","33333";error) |       |
||         |        |        | w <= 0 | v <= 0 | Invalid | T11("1111222233334","11111,"2222","33333";error) |       |
||         |       | c = 4 | w > 0 | v > 0 | Invalid | T13("1111222233334","11111","2222","3333";error) |       |
||         |       |       |       | v <= 0 | Invalid | T14("1111222233334","11111","2222","3333";error) |       |
||        |        |        | w <= 0 | v > 0 | Invalid | T15("1111222233334","11111,"2222","3333";error) |       |
||        |        |        |        | v <= 0 | Invalid | T16("1111222233334","11111,"2222","3333";error) |       |
|| a = 4 | r != 4 | c != 4 | w > 0 | v > 0 | Invalid | T17("1111222233334","1111,"22222","33333";error") |       |
||        |        |        |        | v <= 0 | Invalid | T18("1111222233334","1111,"22222","33333";error) |       |
||         |        |        | w <= 0 | v > 0 | Invalid | T19("1111222233334","1111,"22222","33333";error) |       |
||         |        |        |        | v <= 0 | Invalid | T20("1111222233334","1111,"22222","33333";error) |       |
||         |       | c = 4 | w > 0 | v > 0 | Invalid | T21("1111222233334","1111","22222","3333";error) |       |
||         |       |       |       | v <= 0 | Invalid | T22("1111222233334","1111","22222","3333";error) |       |
||        |        |        | w <= 0 | v > 0 | Invalid | T23("1111222233334","1111,"22222","3333";error) |       |
||        |        |        |        | v <= 0 | Invalid | T24("1111222233334","1111,"22222","3333";error) |       |
||        | r = 4 | c != 4 | w > 0 | v > 0 | Invalid | T25("1111222233334","1111,"2222","33333";error) |       |
||        |       |        | w > 0 | v <= 0 | Invalid | T26("1111222233334","1111,"2222","33333";error) |       |
||         |        |        | w <= 0 | v > 0 | Invalid | T27("1111222233334","1111,"2222","33333";error) |       |
||         |        |        | w <= 0 | v <= 0 | Invalid | T28("1111222233334","1111,"2222","33333";error) |       |
||         |       | c = 4 | w > 0 | v > 0 | Invalid | T29("1111222233334","1111","2222","3333";error) |       |
||         |       |       |       | v <= 0 | Invalid | T30("1111222233334","1111","2222","3333";error) |       |
||        |        |        | w <= 0 | v > 0 | Invalid | T31("1111222233334","1111,"2222","3333";error) |       |
||        |        |        |        | v <= 0 | Invalid | T32("1111222233334","1111,"2222","3333";error) |       |
| p = 12 | a != 4 | r != 4 | c != 4 | w > 0 | v > 0 | Invalid | T33("111122223333","11112,"22223","33334";error) |       |
||        |        |        |        | v <= 0 | Invalid | T34("111122223333","11112,"22223","33334";error) |       |
||         |        |        | w <= 0 | v > 0 | Invalid | T35("111122223333","11112,"22223","33334";error) |       |
||         |        |        |        | v <= 0 | Invalid | T36("111122223333","11112,"22223","33334";error) |       |
||         |       | c = 4 | w > 0 | v > 0 | Invalid | T37("111122223333","11112","22223","3333";error) |       |
||         |       |       |       | v <= 0 | Invalid | T38("111122223333","11112","22223","3333";error) |       |
||        |        |        | w <= 0 | v > 0 | Invalid | T39("111122223333","11112,"22223","3333";error) |       |
||        |        |        |        | v <= 0 | Invalid | T40("111122223333","11112,"22223","3333";error) |       |
||        | r = 4 | c != 4 | w > 0 | v > 0 | Invalid | T41("111122223333","11112,"2222","33334";error) |       |
||        |       |        | w > 0 | v <= 0 | Invalid | T42("111122223333","11112,"2222","33334";error) |       |
||         |        |        | w <= 0 | v > 0 | Invalid | T43("111122223333","11112,"2222","33334";error) |       |
||         |        |        | w <= 0 | v <= 0 | Invalid | T44("111122223333","11112,"2222","33334";error) |       |
||         |       | c = 4 | w > 0 | v > 0 | Invalid | T45("111122223333","11112","2222","3333";error) |       |
||         |       |       |       | v <= 0 | Invalid | T46("111122223333","11112","2222","3333";error) |       |
||        |        |        | w <= 0 | v > 0 | Invalid | T47("111122223333","11112,"2222","3333";error) |       |
||        |        |        |        | v <= 0 | Invalid | T48("111122223333","11112,"2222","3333";error) |       |
|| a = 4 | r != 4 | c != 4 | w > 0 | v > 0 | Invalid | T49("111122223333","1111,"22222","33333";error) |       |
||        |        |        |        | v <= 0 | Invalid | T50("111122223333","1111,"22222","33333";error) |       |
||         |        |        | w <= 0 | v > 0 | Invalid | T51("111122223333","1111,"22222","33333";error) |       |
||         |        |        |        | v <= 0 | Invalid | T52("111122223333","1111,"22222","33333";error) |       |
||         |       | c = 4 | w > 0 | v > 0 | Invalid | T53("111122223333","1111","22222","3333";error) |       |
||         |       |       |       | v <= 0 | Invalid | T54("111122223333","1111","22222","3333";error) |       |
||        |        |        | w <= 0 | v > 0 | Invalid | T55("111122223333","1111,"22222","3333";error) |       |
||        |        |        |        | v <= 0 | Invalid | T56("111122223333","1111,"22222","3333";error) |       |
||        | r = 4 | c != 4 | w > 0 | v > 0 | Invalid | T57("11122223333","1111,"2222","33333";error) |       |
||        |       |        | w > 0 | v <= 0 | Invalid | T58("111122223333","1111,"2222","33333";error) |       |
||         |        |        | w <= 0 | v > 0 | Invalid | T59("111122223333","1111,"2222","33333";error) |       |
||         |        |        | w <= 0 | v <= 0 | Invalid | T60("111122223333","1111,"2222","33333";error) |       |
||         |       | c = 4 | w > 0 | v > 0 | Valid | T61("111122223333","1111","2222","3333";Position Changed) |       |
||         |       |       |       | v <= 0 | Invalid | T62("111122223333","1111","2222","3333";error) |       |
||        |        |        | w <= 0 | v > 0 | Invalid | T63("111122223333","1111,"2222","3333";error) |       |
||        |        |        |        | v <= 0 | Invalid | T64("111122223333","1111,"2222","3333";error) |       |



 ### **Class *PositionDB* - method *changePositionID***



**Criteria for method *changePositionID*:**

 - position ID Length
 - new Position ID Length




**Predicates for method *changePositionID*:**


| Criteria | Predicate |
| -------- | --------- |
|     Position ID Length     |     p = 12      |
|     New Position ID Length     |     n = 12      |




**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     positionID Length     |        p > 12         |
|          |        p < 12         |
|          |        p = 12         |
|     newPositionID Length     |        n > 12         |
|          |        n < 12         |
|          |        n = 12         |



**Combination of predicates**:


| positionID Length | newPositionID Length | Valid/Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
| p > 12 | n > 12 | Invalid | T1("1111222233334","1111222244445";error) |
|| n < 12 | Invalid | T2("1111222233334","11112222444";error) |
|| n = 12 | Invalid | T3("1111222233334","111122224444";error) |
| p < 12 | n > 12 | Invalid | T4("11112222333","1111222244445";error) |
|| n < 12 | Invalid | T5("11112222333","11112222444";error) |
|| n = 12 | Invalid | T6("11112222333","111122224444";error) |
| p = 12 | n > 12 | Invalid | T4("111122223333","1111222244445";error) |
|| n < 12 | Invalid | T5("111122223333","11112222444";error) |
|| n = 12 | Valid | T6("111122223333","111122224444";"111122224444") |



 ### **Class *PositionDB* - method *deletePosition***



**Criteria for method *deletePosition*:**
	

 - Position ID Length



**Predicates for method *deletePosition*:**


| Criteria | Predicate |
| -------- | --------- |
|     Position ID Length     |     p = 12      |




**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     Position ID Length     |        p > 12         |
|          |        p = 12         |
|          |        p < 12         |



**Combination of predicates**:


| Position ID Length | Valid/Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| p > 12 | Invalid | T1("1111222233334";error) |
| p < 12 | Invalid | T2("11112222333";error) |
| p = 12 | Valid | T3("111122223333";Position Deleted) |





  ### **Class *RestockOrderDB* - method *getRestockOrder***



**Criteria for method *getRestockOrder*:**
	

 - Restock Order ID



**Predicates for method *getRestockOrder*:**


| Criteria | Predicate |
| -------- | --------- |
|     Restock Order ID     |     i >= 0      |




**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     Restock Order ID     |        i >= 0         |
|          |        i < 0         |



**Combination of predicates**:


| Restock Order ID | Valid/Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| i >= 0 | Valid | T1(1111;Restock Order Returned) |  |
| i < 0 | Invalid | T2(-1111;error) |  |




  ### **Class *RestockOrderDB* - method *createRestockOrder***



**Criteria for method *createRestockOrder*:**
	

 - Issue Date
 - Products
 - Supplier ID



**Predicates for method *createRestockOrder*:**


| Criteria | Predicate |
| -------- | --------- |
|     Issue Date     |     WF      |
|     Products     |     WF      |
|     Supplier ID     |     i >= 0      |




**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     Issue Date     |     WF      |
|          |        not WF         |
|     Products     |     WF      |
|          |       not WF         |
|     Supplier ID     |     i >= 0      |
|          |        i < 0         |




**Combination of predicates**:


| Issue Date | Products | Supplier ID | Valid/Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
|   WF  |   WF   | i >= 0 | Valid | T1("2021/11/29 09:33",WF,11;Restock Order Created) |  |
|       |        | i < 0 | Invalid | T1("2021/11/29 09:33",WF,-1;error) |  |
|       |   not WF   | i >= 0 | Invalid | T1("2021/11/29 09:33",not WF,1;error) |  |
|       |        | i < 0 | Invalid | T1("2021/11/29 09:33",not WF,-1;error) |  |
|   not WF  |   WF   | i >= 0 | Valid | T1("2021-11-29 09:33",WF,11;error) |  |
|       |        | i < 0 | Invalid | T1("2021-11-29 09:33",WF,-1;error) |  |
|       |   not WF   | i >= 0 | Invalid | T1("2021-11-29 09:33",not WF,1;error) |  |
|       |        | i < 0 | Invalid | T1("2021-11-29 09:33",not WF,-1;error) |  |





  ### **Class *RestockOrderDB* - method *changeState***



**Criteria for method *changeState*:**
	

 - Restock Order ID
 - New State



**Predicates for method *changeState*:**


| Criteria | Predicate |
| -------- | --------- |
|     Restock Order ID     |     i >= 0      |
|     New State     |      WF      |




**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     Restock Order ID     |        i >= 0         |
|          |        i < 0         |
|     New State     |        WF         |
|          |        not WF         |




**Combination of predicates**:


| Restock Order ID | New State | Valid/Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
| i >= 0 | WF | Valid | T1(1111;State Changed) |  |
|        | not WF | Invalid | T2(1111;error) |  |
| i < 0 | WF | Invalid | T3(-1111;error) |  |
|       | not WF | Invalid | T4(1111;error) |  |




  ### **Class *RestockOrderDB* - method *addSKUItems***



**Criteria for method *addSKUItems*:**
	

 - Restock Order ID
 - SKU Items
 - Restock Order



**Predicates for method *addSKUItems*:**


| Criteria | Predicate |
| -------- | --------- |
|     Restock Order ID     |     i >= 0      |
|     SKU Items     |     WF      |
|     Restock Order     |     WF      |




**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     Restock Order ID     |        i >= 0         |
|          |        i < 0         |
|     SKU Items     |        WF         |
|          |        not WF         |
|     Restock Order     |        WF         |
|          |        not WF         |



**Combination of predicates**:


| SKU Items | Restock Order | Restock Order ID | Valid/Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
|   WF  |   WF   | i >= 0 | Valid | T1(WF,WF,11;SKU Item Added) |  |
|       |        | i < 0 | Invalid | T1(WF,WF,-1;error) |  |
|       |   not WF   | i >= 0 | Invalid | T1(WF,not WF,1;error) |  |
|       |        | i < 0 | Invalid | T1(WF,not WF,-1;error) |  |
|   not WF  |   WF   | i >= 0 | Valid | T1(not WF,WF,11;error) |  |
|       |        | i < 0 | Invalid | T1(not WF,WF,-1;error) |  |
|       |   not WF   | i >= 0 | Invalid | T1(not WF,not WF,1;error) |  |
|       |        | i < 0 | Invalid | T1(not WF,not WF,-1;error) |  |





  ### **Class *RestockOrderDB* - method *addTransportNote***



**Criteria for method *addTransportNote*:**
	

 - Restock Order ID
 - Transport Note



**Predicates for method *addTransportNote*:**


| Criteria | Predicate |
| -------- | --------- |
|     Restock Order ID     |     i >= 0      |
|     Transport Note     |      WF      |




**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     Restock Order ID     |        i >= 0         |
|          |        i < 0         |
|     Transport Note     |        WF         |
|          |        not WF         |



**Combination of predicates**:


| Restock Order ID | Transport Note | Valid/Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
| i >= 0 | WF | Valid | T1(11,WF;Transport Note Added) |  |
|        | not WF | Invalid | T2(11, not WF;error) |  |
| i < 0 | WF | Invalid | T3(-11,WF;error) |  |
|       | not WF | Invalid | T4(-11, not WF;error) |  |




 ### **Class *RestockOrderDB* - method *deleteRestockOrder***



**Criteria for method *deleteRestockOrder*:**
	

 - Range of ID



**Predicates for method *deleteRestockOrder*:**


| Criteria | Predicate |
| -------- | --------- |
|     Range of ID     |     i >= 0      |




**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     Range of ID     |        i >= 0         |
|          |        i < 0         |



**Combination of predicates**:


| Range of ID | Valid/Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| i >= 0 | Valid | T1("1111";Restock Order Deleted) |
| i < 0 | Invalid | T2(-1111;error) |




  ### **Class *ReturnOrdersDB* - method *getReturnOrder***



**Criteria for method *getReturnOrder*:**
	

 - Return Order ID



**Predicates for method *getReturnOrder*:**


| Criteria | Predicate |
| -------- | --------- |
|     Return Order ID     |     i >= 0      |




**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     Return Order ID     |        i >= 0         |
|          |        i < 0         |



**Combination of predicates**:


| Return Order ID | Valid/Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| i >= 0 | Valid | T1(1111;Return Order Returned) |  |
| i < 0 | Invalid | T2(-1111;error) |  |




 ### **Class *ReturnOrdersDB* - method *createReturnOrder***



**Criteria for method *createReturnOrder*:**
	

 - Return Date
 - Products
 - Restock Order ID



**Predicates for method *createReturnOrder*:**


| Criteria | Predicate |
| -------- | --------- |
|     Return Date     |     WF      |
|     Products     |     WF      |
|     Restock Order ID     |     i >= 0      |




**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     Return Date     |     WF      |
|          |        not WF         |
|     Products     |     WF      |
|          |       not WF         |
|     Restock Order ID     |     i >= 0      |
|          |        i < 0         |




**Combination of predicates**:


| Return Date | Products | Restock Order ID | Valid/Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
|   WF  |   WF   | i >= 0 | Valid | T1("2021/11/29 09:33",WF,11;Return Order Created) |  |
|       |        | i < 0 | Invalid | T1("2021/11/29 09:33",WF,-1;error) |  |
|       |   not WF   | i >= 0 | Invalid | T1("2021/11/29 09:33",not WF,1;error) |  |
|       |        | i < 0 | Invalid | T1("2021/11/29 09:33",not WF,-1;error) |  |
|   not WF  |   WF   | i >= 0 | Valid | T1("2021-11-29 09:33",WF,11;error) |  |
|       |        | i < 0 | Invalid | T1("2021-11-29 09:33",WF,-1;error) |  |
|       |   not WF   | i >= 0 | Invalid | T1("2021-11-29 09:33",not WF,1;error) |  |
|       |        | i < 0 | Invalid | T1("2021-11-29 09:33",not WF,-1;error) |  |




 ### **Class *ReturnOrderDB* - method *deleteReturnOrder***



**Criteria for method *deleteReturnOrder*:**
	

 - Range of ID



**Predicates for method *deleteReturnOrder*:**


| Criteria | Predicate |
| -------- | --------- |
|     Range of ID     |     i >= 0      |




**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     Range of ID     |        i >= 0         |
|          |        i < 0         |



**Combination of predicates**:


| Range of ID | Valid/Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| i >= 0 | Valid | T1("1111";Return Order Deleted) |
| i < 0 | Invalid | T2(-1111;error) |




 ### **Class *SKUsDB* - method *getSKUById***



**Criteria for method *getSKUById*:**
	

 - SKU ID



**Predicates for method *getSKUById*:**


| Criteria | Predicate |
| -------- | --------- |
|     SKU ID     |     i >= 0      |




**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     SKU ID     |        i >= 0         |
|          |        i < 0         |



**Combination of predicates**:


| SKU ID | Valid/Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| i >= 0 | Valid | T1("1111";SKU Returned) |  |
| i < 0 | Invalid | T2(-1111;error) |  |




 ### **Class *SKUsDB* - method *createSKU***



**Criteria for method *createSKU*:**
	

 - Description
 - Weight
 - Volume
 - Notes
 - Price
 - Available Quantity



**Predicates for method *createSKU*:**


| Criteria | Predicate |
| -------- | --------- |
|     Description     |     WF      |
|     Weight     |     w >= 0      |
|     Volume     |     v >= 0      |
|     Notes     |     WF      |
|     Price     |     p >= 0      |
|     Available Quantity     |     q >= 0      |




**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     Description     |     WF      |
|          |     WF      |
|     Weight     |     w >= 0      |
|          |     w < 0      |
|     Volume     |     v >= 0      |
|          |     v < 0      |
|     Notes     |     WF      |
|          |     WF      |
|     Price     |     p >= 0      |
|          |     p < 0      |
|     Available Quantity     |     q >= 0      |
|          |     q < 0      |





**Combination of predicates**:


| Description | Weight | Volume | Notes | Price | Available Quantity | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|-------|
|   WF  | w >= 0 | v >= 0 |   WF   | p >= 0 | q >= 0 | Valid | T1(WF,1,2,WF,3,4;SKU Created) |  |
|       |        |        |        |        | q < 0 | Invalid | T2(WF,1,2,WF,3,-4;error) |  |
|       |        |        |        | p < 0 | q >= 0 | Invalid | T3(WF,1,2,WF,-3,4;error) |  |
|       |        |        |        |        | q < 0 | Invalid | T4(WF,1,2,WF,-3,-4;error) |  |
|       |        |        |   not WF   | p >= 0 | q >= 0 | Invalid | T5(WF,1,2,not WF,3,4;error) |  |
|       |        |        |        |        | q < 0 | Invalid | T6(WF,1,2,not WF,3,-4;error) |  |
|       |        |        |        | p < 0 | q >= 0 | Invalid | T7(WF,1,2,not WF,-3,4;error) |  |
|       |        |        |        |        | q < 0 | Invalid | T8(WF,1,2,not WF,-3,-4;error) |  |
|       |        | v < 0 |   WF   | p >= 0 | q >= 0 | Invalid | T9(WF,1,-2,WF,3,4;error) |  |
|       |        |        |        |        | q < 0 | Invalid | T10(WF,1,-2,WF,3,-4;error) |  |
|       |        |        |        | p < 0 | q >= 0 | Invalid | T11(WF,1,-2,WF,-3,4;error) |  |
|       |        |        |        |        | q < 0 | Invalid | T12(WF,1,-2,WF,-3,-4;error) |  |
|       |        |        |   not WF   | p >= 0 | q >= 0 | Invalid | T13(WF,1,-2,not WF,3,4;error) |  |
|       |        |        |        |        | q < 0 | Invalid | T14(WF,1,-2,not WF,3,-4;error) |  |
|       |        |        |        | p < 0 | q >= 0 | Invalid | T15(WF,1,-2,not WF,-3,4;error) |  |
|       |        |        |        |        | q < 0 | Invalid | T16(WF,1,-2,not WF,-3,-4;error) |  |
|       | w < 0 | v >= 0 |   WF   | p >= 0 | q >= 0 | Invalid | T17(WF,-1,2,WF,3,4;error) |  |
|       |        |        |        |        | q < 0 | Invalid | T18(WF,-1,2,WF,3,-4;error) |  |
|       |        |        |        | p < 0 | q >= 0 | Invalid | T19(WF,-1,2,WF,-3,4;error) |  |
|       |        |        |        |        | q < 0 | Invalid | T20(WF,-1,2,WF,-3,-4;error) |  |
|       |        |        |   not WF   | p >= 0 | q >= 0 | Invalid | T21(WF,-1,2,not WF,3,4;error) |  |
|       |        |        |        |        | q < 0 | Invalid | T22(WF,-1,2,not WF,3,-4;error) |  |
|       |        |        |        | p < 0 | q >= 0 | Invalid | T23(WF,-1,2,not WF,-3,4;error) |  |
|       |        |        |        |        | q < 0 | Invalid | T24(WF,-1,2,not WF,-3,-4;error) |  |
|       |        | v < 0 |   WF   | p >= 0 | q >= 0 | Invalid | T25(WF,-1,-2,WF,3,4;error) |  |
|       |        |        |        |        | q < 0 | Invalid | T26(WF,-1,-2,WF,3,-4;error) |  |
|       |        |        |        | p < 0 | q >= 0 | Invalid | T27(WF,-1,-2,WF,-3,4;error) |  |
|       |        |        |        |        | q < 0 | Invalid | T28(WF,-1,-2,WF,-3,-4;error) |  |
|       |        |        |   not WF   | p >= 0 | q >= 0 | Invalid | T29(WF,-1,-2,not WF,3,4;error) |  |
|       |        |        |        |        | q < 0 | Invalid | T30(WF,-1,-2,not WF,3,-4;error) |  |
|       |        |        |        | p < 0 | q >= 0 | Invalid | T31(WF,-1,-2,not WF,-3,4;error) |  |
|       |        |        |        |        | q < 0 | Invalid | T32(WF,-1,-2,not WF,-3,-4;error) |  |
|   not WF  | w >= 0 | v >= 0 |   WF   | p >= 0 | q >= 0 | Valid | T33(not WF,1,2,WF,3,4;error) |  |
|       |        |        |        |        | q < 0 | Invalid | T34(not WF,1,2,WF,3,-4;error) |  |
|       |        |        |        | p < 0 | q >= 0 | Invalid | T35(not WF,1,2,WF,-3,4;error) |  |
|       |        |        |        |        | q < 0 | Invalid | T36(not WF,1,2,WF,-3,-4;error) |  |
|       |        |        |   not WF   | p >= 0 | q >= 0 | Invalid | T37(not WF,1,2,not WF,3,4;error) |  |
|       |        |        |        |        | q < 0 | Invalid | T38(not WF,1,2,not WF,3,-4;error) |  |
|       |        |        |        | p < 0 | q >= 0 | Invalid | T39(not WF,1,2,not WF,-3,4;error) |  |
|       |        |        |        |        | q < 0 | Invalid | T40(not WF,1,2,not WF,-3,-4;error) |  |
|       |        | v < 0 |   WF   | p >= 0 | q >= 0 | Invalid | T41(not WF,1,-2,WF,3,4;error) |  |
|       |        |        |        |        | q < 0 | Invalid | T42(not WF,1,-2,WF,3,-4;error) |  |
|       |        |        |        | p < 0 | q >= 0 | Invalid | T43(not WF,1,-2,WF,-3,4;error) |  |
|       |        |        |        |        | q < 0 | Invalid | T44(not WF,1,-2,WF,-3,-4;error) |  |
|       |        |        |   not WF   | p >= 0 | q >= 0 | Invalid | T45(not WF,1,-2,not WF,3,4;error) |  |
|       |        |        |        |        | q < 0 | Invalid | T46(not WF,1,-2,not WF,3,-4;error) |  |
|       |        |        |        | p < 0 | q >= 0 | Invalid | T47(not WF,1,-2,not WF,-3,4;error) |  |
|       |        |        |        |        | q < 0 | Invalid | T48(not WF,1,-2,not WF,-3,-4;error) |  |
|       | w < 0 | v >= 0 |   WF   | p >= 0 | q >= 0 | Invalid | T49(not WF,-1,2,WF,3,4;error) |  |
|       |        |        |        |        | q < 0 | Invalid | T50(not WF,-1,2,WF,3,-4;error) |  |
|       |        |        |        | p < 0 | q >= 0 | Invalid | T51(not WF,-1,2,WF,-3,4;error) |  |
|       |        |        |        |        | q < 0 | Invalid | T52(not WF,-1,2,WF,-3,-4;error) |  |
|       |        |        |   not WF   | p >= 0 | q >= 0 | Invalid | T53(not WF,-1,2,not WF,3,4;error) |  |
|       |        |        |        |        | q < 0 | Invalid | T54(not WF,-1,2,not WF,3,-4;error) |  |
|       |        |        |        | p < 0 | q >= 0 | Invalid | T55(not WF,-1,2,not WF,-3,4;error) |  |
|       |        |        |        |        | q < 0 | Invalid | T56(not WF,-1,2,not WF,-3,-4;error) |  |
|       |        | v < 0 |   WF   | p >= 0 | q >= 0 | Invalid | T57(not WF,-1,-2,WF,3,4;error) |  |
|       |        |        |        |        | q < 0 | Invalid | T58(not WF,-1,-2,WF,3,-4;error) |  |
|       |        |        |        | p < 0 | q >= 0 | Invalid | T59(not WF,-1,-2,WF,-3,4;error) |  |
|       |        |        |        |        | q < 0 | Invalid | T60(not WF,-1,-2,WF,-3,-4;error) |  |
|       |        |        |   not WF   | p >= 0 | q >= 0 | Invalid | T61(not WF,-1,-2,not WF,3,4;error) |  |
|       |        |        |        |        | q < 0 | Invalid | T62(not WF,-1,-2,not WF,3,-4;error) |  |
|       |        |        |        | p < 0 | q >= 0 | Invalid | T63(not WF,-1,-2,not WF,-3,4;error) |  |
|       |        |        |        |        | q < 0 | Invalid | T64(not WF,-1,-2,not WF,-3,-4;error) |  |




  ### **Class *SKUsDB* - method *setSKUPosition***



**Criteria for method *getSKUById*:**
	

 - SKU ID
 - Position ID



**Predicates for method *getSKUById*:**


| Criteria | Predicate |
| -------- | --------- |
|     SKU ID     |     i >= 0      |
|     Position ID     |     i >= 0      |




**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     SKU ID     |        i >= 0         |
|          |        i < 0         |
|     Position ID     |        p >= 0         |
|          |        p < 0         |



**Combination of predicates**:


| SKU ID |Position ID| Valid/Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
| i >= 0 | p > 0 | Valid | T1(1111,22;SKU Position Set) |  |
|       | p <= 0 | Invalid | T2(-1111,-2;error) |  |
| i < 0 | p > 0 | Invalid | T2(-1111,22;error) |  |
|       | p <= 0 | Invalid | T2(-1111,-2;error) |  |



 ### **Class *SKUsDB* - method *deleteSKU***



**Criteria for method *deleteSKU*:**
	

 - Range of ID



**Predicates for method *deleteSKU*:**


| Criteria | Predicate |
| -------- | --------- |
|     Range of ID     |     i >= 0      |




**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     Range of ID     |        i >= 0         |
|          |        i < 0         |



**Combination of predicates**:


| Range of ID | Valid/Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| i >= 0 | Valid | T1(1111;SKU Deleted) |
| i < 0 | Invalid | T2(-1111;error) |




  ### **Class *SKUItemsDB* - method *getAvailableSKUItemsBySKUId***



**Criteria for method *getAvailableSKUItemsBySKUId*:**
	

 - SKU ID



**Predicates for method *getAvailableSKUItemsBySKUId*:**


| Criteria | Predicate |
| -------- | --------- |
|     SKU ID     |     i >= 0      |




**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     SKU ID     |        i >= 0         |
|          |        i < 0         |



**Combination of predicates**:


| SKU ID | Valid/Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| i >= 0 | Valid | T1("1111";Available SKU Item Returned) |  |
| i < 0 | Invalid | T2(-1111;error) |  |




  ### **Class *SKUItemsDB* - method *getSKUItemByRFID***



**Criteria for method *getSKUItemByRFID*:**
	

 - RFID Length



**Predicates for method *getSKUItemByRFID*:**


| Criteria | Predicate |
| -------- | --------- |
|     RFID Length     |     r = 32      |




**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     RFID Length     |        r = 32         |
|          |        r != 32         |



**Combination of predicates**:


| RFID Length | Valid/Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| r = 32 | Valid | T1(11111111222222223333333344444444;SKU Item Returned) |  |
| r != 32 | Invalid | T2(1111;error) |  |



 ### **Class *SKUItemsDB* - method *createSKUItem***



**Criteria for method *createSKUItem*:**
	

 - RFID Length
 - SKUId
 - Availability
 - Stock Date



**Predicates for method *createSKUItem*:**


| Criteria | Predicate |
| -------- | --------- |
|     RFID Length     |     WF      |
|     SKUId     |     s >= 0      |
|     Availability     |     true      |
|     Stock Date     |     WF      |





**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     RFID Length     |     WF      |
|          |        not WF         |
|     SKUId     |     s >= 0      |
|          |       s < 0         |
|     Availability     |     true      |
|          |        false         |
|     Stock Date     |     WF      |
|          |     not WF      |






**Combination of predicates**:


| RFID Length | SKUId | Availability | Stock Date | Valid/Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|
|  WF | s >= 0 | true | WF |  Valid | T1(WF,11,true,WF;SKU Item Created) |  |
|         |        |      | not WF |  Invalid | T1(WF,11,true,not WF;error) |  |
|         |        | false | WF |  Invalid | T1(WF,11,false,WF;error) |  |
|         |        |       | not WF |  Invalid | T1(WF,11,false,not WF;error) |  |
|         | s < 0 | true | WF |  Valid | T1(WF,-11,true,WF;error) |  |
|         |        |      | not WF |  Invalid | T1(WF,-11,true,not WF;error) |  |
|         |        | false | WF |  Invalid | T1(WF,-11,false,WF;error) |  |
|         |        |       | not WF |  Invalid | T1(WF,-11,false,not WF;error) |  |
|  not WF | s >= 0 | true | WF |  Valid | T1(not WF,11,true,WF;SKU Item Created) |  |
|         |        |      | not WF |  Invalid | T1(not WF,11,true,not WF;error) |  |
|         |        | false | WF |  Invalid | T1(not WF,11,false,WF;error) |  |
|         |        |       | not WF |  Invalid | T1(not WF,11,false,not WF;error) |  |
|         | s < 0 | true | WF |  Valid | T1(not WF,-11,true,WF;error) |  |
|         |        |      | not WF |  Invalid | T1(not WF,-11,true,not WF;error) |  |
|         |        | false | WF |  Invalid | T1(not WF,-11,false,WF;error) |  |
|         |        |       | not WF |  Invalid | T1(not WF,-11,false,not WF;error) |  |




 ### **Class *SKUItemsDB* - method *modifySKUItem***



**Criteria for method *modifySKUItem*:**
	

 - New RFID Length
 - New Availability
 - New Stock Date
 - Old RFID Length



**Predicates for method *modifySKUItem*:**


| Criteria | Predicate |
| -------- | --------- |
|     Neww RFID Length     |     WF      |
|     New Availability     |     true      |
|     New Stock Date     |     s >= 0      |
|     Old RFID Length     |     WF      |





**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     New RFID Length     |     WF      |
|          |        not WF         |
|     New Availability     |     true      |
|          |        false         |
|     New Stock Date     |     WF      |
|          |     not WF      |
|     Old RFID Length     |     WF      |
|          |       not WF        |






**Combination of predicates**:


| New RFID Length | Old RFID Length | New Availability | New Stock Date | Valid/Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|
|  WF | WF | true | WF |  Valid | T1(WF,WF,true,WF;SKU Item Created) |  |
|         |        |      | not WF |  Invalid | T2(WF,WF,true,not WF;error) |  |
|         |        | false | WF |  Invalid | T3(WF,WF,false,WF;error) |  |
|         |        |       | not WF |  Invalid | T4(WF,WF,false,not WF;error) |  |
|         | not WF | true | WF |  Invalid | T5(WF,not WF,true,WF;error) |  |
|         |        |      | not WF |  Invalid | T6(WF,not WF,true,not WF;error) |  |
|         |        | false | WF |  Invalid | T7(WF,not WF,false,WF;error) |  |
|         |        |       | not WF |  Invalid | T8(WF,not WF,false,not WF;error) |  |
|  not WF | WF | true | WF |  Invalid | T9(not WF,WF,true,WF;error) |  |
|         |        |      | not WF |  Invalid | T10(not WF,WF,true,not WF;error) |  |
|         |        | false | WF |  Invalid | T11(not WF,WF,false,WF;error) |  |
|         |        |       | not WF |  Invalid | T12(not WF,WF,false,not WF;error) |  |
|         | not WF | true | WF |  Invalid | T13(not WF,not WF,true,WF;error) |  |
|         |        |      | not WF |  Invalid | T14(not WF,not WF,true,not WF;error) |  |
|         |        | false | WF |  Invalid | T15(not WF,not WF,false,WF;error) |  |
|         |        |       | not WF |  Invalid | T16(not WF,not WF,false,not WF;error) |  |




  ### **Class *SKUItemsDB* - method *deleteSKUItem***



**Criteria for method *deleteSKUItem*:**
	

 - RFID Length



**Predicates for method *deleteSKUItem*:**


| Criteria | Predicate |
| -------- | --------- |
|     RFID Length     |     r = 32      |




**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     RFID Length     |        r = 32         |
|          |        r != 32         |



**Combination of predicates**:


| RFID Length | Valid/Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| r = 32 | Valid | T1(11111111222222223333333344444444;SKU Item Deleted) |  |
| r != 32 | Invalid | T2(1111;error) |  |





 ### **Class *TestDescriptorDB* - method *createTestDescriptor***



**Criteria for method *createTestDescriptor*:**
	

 - Test Descriptor Name
 - Procedure Description
 - SKU ID



**Predicates for method *createTestDescriptor*:**


| Criteria | Predicate |
| -------- | --------- |
|     Test Descriptor Name     |     Ascii      |
|     Procedure Description     |     Ascii      |
|     SKU ID     |     i >= 0      |




**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     Test Descriptor Name     |        Ascii         |
|          |        not Ascii         |
|     Procedure Description     |        Ascii         |
|          |        not Ascii         |
|     SKU     |        i >= 0         |
|          |        i < 0         |



**Combination of predicates**:


| Test Descriptor Name | Procedure Description | SKU ID | Valid/Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| Ascii | Ascii | i >= 0 | Valid | T1(11,"name","descriptor",22; Test Descriptor Created) |  |
|       |       | i < 0 | Invalid | T2(11,"name","descriptor",-2; error) |  |
|       | not Ascii | i >= 0 | Invalid | T3(11,"name","££",22; error) |  
|       |       | i < 0 | Invalid | T4(11,"name","££",-2; error) |  |
| not Ascii | Ascii | i >= 0 | Invalid | T5(11,"¢¢","descriptor",22; error) |  |
|       |       | i < 0 | Invalid | T6(11,"¢¢","descriptor",-2; error) |  |
|       | not Ascii | i >= 0 | Invalid | T7(11,"¢¢","££",22; error) |  |
|       |       | i < 0 | Invalid | T8(11,"¢¢","££",-2; error) |  |




 ### **Class *TestDescriptorDB* - method *getTestDescriptor***



**Criteria for method *getTestDescriptor*:**
	

 - Range of ID



**Predicates for method *getTestDescriptor*:**


| Criteria | Predicate |
| -------- | --------- |
|     Range of ID     |     i >= 0      |




**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     Range of ID     |        i >= 0         |
|          |        i < 0         |



**Combination of predicates**:


| Range of ID | Valid/Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| i >= 0 | Valid | T1("11";Test Descriptor Returned) |  |
| i < 0 | Invalid | T2("-11";error) |  |



 ### **Class *TestDescriptorDB* - method *changeName***



**Criteria for method *changeName*:**
	

 - Test Descriptor ID
 - Test Descriptor Name



**Predicates for method *changeName*:**


| Criteria | Predicate |
| -------- | --------- |
|     Test Descriptor ID     |     i >= 0      |
|     Test Descriptor Name     |     Ascii      |





**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     Test Descriptor ID       |        i >= 0         |
|          |        i < 0         |
|     Test Descriptor Name     |        Ascii         |
|          |        not Ascii         |



**Combination of predicates**:


| Test Descriptor ID | Test Descriptor Name | Valid/Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
| i >= 0 | Ascii | Valid | T1("11";Name Changed) |  |
|        | not Ascii | Invalid | T2("11"و"¢¢";error) |  |
| i < 0 | Ascii | Invalid | T3("-1";error) |  |
|        | not Ascii | Invalid | T4("-1"و"¢¢";error) |  |



 ### **Class *TestDescriptorDB* - method *changeProcedure***



**Criteria for method *changeProcedure*:**
	

 - Test Descriptor ID
 - Procedure Description



**Predicates for method *changeProcedure*:**


| Criteria | Predicate |
| -------- | --------- |
|     Test Descriptor ID     |     i >= 0      |
|     Procedure Description     |     Ascii      |




**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     Test Descriptor ID       |        i >= 0         |
|          |        i < 0         |
|     Procedure Description     |        Ascii         |
|          |        not Ascii         |



**Combination of predicates**:


| Test Descriptor ID | Procedure Description | Valid/Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
| i >= 0 | Ascii | Valid | T1("11","ProDes";Procedure Changed) |  |
|        | not Ascii | Invalid | T2("11";error) |  |
| i < 0 | Ascii | Invalid | T3("-1","ProDes";error) |  |
|        | not Ascii | Invalid | T4("-1";error) |  |




 ### **Class *TestDescriptorDB* - method *changeIdSKU***



**Criteria for method *changeIdSKU*:**
	

 - Range of ID
 - SKU ID Range



**Predicates for method *changeIdSKU*:**


| Criteria | Predicate |
| -------- | --------- |
|     Test Descriptor ID     |     i >= 0      |
|     SKU ID Range     |     i >= 0      |




**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     Test Descriptor ID     |        i >= 0         |
|          |        i < 0         |
|     SKU ID Range     |        i >= 0         |
|          |        i < 0         |



**Combination of predicates**:


| Test Descriptor ID | SKU ID Range | Valid/Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
| i >= 0 | i >= 0 | Valid | T1(11,22;SKU ID Changed) |  |
|        | i < 0 | Invalid | T2(11,-2;error) |  |
| i < 0 | i >= 0 | Invalid | T3(-11,22;error) |  |
|        | i < 0 | Invalid | T4(-11,-2;error) |  |



 ### **Class *TestDescriptorDB* - method *deleteIdSKU***



**Criteria for method *deleteIdSKU*:**
	

 - Range of ID



**Predicates for method *deleteIdSKU*:**


| Criteria | Predicate |
| -------- | --------- |
|     Range of ID     |     i >= 0      |




**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     Range of ID     |        i >= 0         |
|          |        i < 0         |



**Combination of predicates**:


| Range of ID | Valid/Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| i >= 0 | Valid | T1(1111;SKU ID Deleted) |
| i < 0 | Invalid | T2(-1111;error) |




 ### **Class *TestResultDB* - method *createTestResult***



**Criteria for method *createTestResult*:**
	

 - RFID Length
 - Test Descriptor ID
 - Test Result
 - Test Date



**Predicates for method *createTestResult*:**


| Criteria | Predicate |
| -------- | --------- |
|     RFID Length     |     WF      |
|     Test Descriptor ID     |     t >= 0      |
|     Test Result     |     true      |
|     Test Date     |     WF      |





**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     RFID Length     |     WF      |
|          |        not WF         |
|     Test Descriptor ID     |     t >= 0      |
|          |       t < 0         |
|     Test Result     |     true      |
|          |        false         |
|     Test Date     |     WF      |
|          |     not WF      |





**Combination of predicates**:


| RFID Length | Test Descriptor ID | Test Result | Test Date | Valid/Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|
|  WF | t >= 0 | true | WF |  Valid | T1(WF,11,true,WF;Test Result Created) |  |
|         |        |      | not WF |  Invalid | T2(WF,11,true,not WF;error) |  |
|         |        | false | WF |  Invalid | T3(WF,11,false,WF;error) |  |
|         |        |       | not WF |  Invalid | T4(WF,11,false,not WF;error) |  |
|         | t < 0 | true | WF |  Invalid | T5(WF,-11,true,WF;error) |  |
|         |        |      | not WF |  Invalid | T6(WF,-11,true,not WF;error) |  |
|         |        | false | WF |  Invalid | T7(WF,-11,false,WF;error) |  |
|         |        |       | not WF |  Invalid | T8(WF,-11,false,not WF;error) |  |
|  not WF | t >= 0 | true | WF |  Invalid | T9(not WF,11,true,WF;error) |  |
|         |        |      | not WF |  Invalid | T10(not WF,11,true,not WF;error) |  |
|         |        | false | WF |  Invalid | T11(not WF,11,false,WF;error) |  |
|         |        |       | not WF |  Invalid | T12(not WF,11,false,not WF;error) |  |
|         | t < 0 | true | WF |  Invalid | T13(not WF,-11,true,WF;error) |  |
|         |        |      | not WF |  Invalid | T14(not WF,-11,true,not WF;error) |  |
|         |        | false | WF |  Invalid | T15(not WF,-11,false,WF;error) |  |
|         |        |       | not WF |  Invalid | T16(not WF,-11,false,not WF;error) |  |




  ### **Class *TestResultDB* - method *getTestResultsByRfid***



**Criteria for method *getTestResultsByRfid*:**
	

 - RFID Length



**Predicates for method *getTestResultsByRfid*:**


| Criteria | Predicate |
| -------- | --------- |
|     RFID Length     |     r = 32      |




**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     RFID Length     |        r = 32         |
|          |        r != 32         |



**Combination of predicates**:


| RFID Length | Valid/Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| r = 32 | Valid | T1(11111111222222223333333344444444;Test Result Returned) |  |
| r != 32 | Invalid | T2(1111;error) |  |



  ### **Class *TestResultDB* - method *getTestResultsByIdAndRfid***



**Criteria for method *getTestResultsByIdAndRfid*:**
	

 - Test Result ID
 - RFID



**Predicates for method *getTestResultsByIdAndRfid*:**


| Criteria | Predicate |
| -------- | --------- |
|     Test Result ID     |     t >= 0      |
|     RFID     |     r = 32      |




**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     Test Result ID     |        t >= 0         |
|          |        t < 0         |
|     RFID     |        r = 0         |
|          |        r != 0         |



**Combination of predicates**:


| Test Result ID | RFID | Valid/Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
| t >= 0 | r = 32 | Valid | T1(11,11111111222222223333333344444444;Test Result Returned) |  |
|       | r != 32 | Invalid | T2(11,1111111122222222333333334444;error) |  |
| t < 0 | r = 32 | Invalid | T3(-11,11111111222222223333333344444444;error) |  |
|       | r != 32 | Invalid | T4(-11,1111111122222222333333334444;error) |  |



 ### **Class *TestResultDB* - method *changeTestResult***



**Criteria for method *changeTestResult*:**
	

 - RFID Length
 - Test Descriptor ID
 - New Test Descriptor ID
 - Test Result
 - Test Date



**Predicates for method *changeTestResult*:**


| Criteria | Predicate |
| -------- | --------- |
|     RFID Length     |     WF      |
|     Test Descriptor ID     |     t >= 0      |
|     New Test Descriptor ID     |     n >= 0      |
|     Test Result     |     true      |
|     Test Date     |     WF      |





**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     RFID Length     |     WF      |
|          |        not WF         |
|     Test Descriptor ID     |     n >= 0      |
|          |       n < 0         |
|     New Test Descriptor ID     |     n >= 0      |
|          |       n < 0         |
|     Test Result     |     true      |
|          |        false         |
|     Test Date     |     WF      |
|          |     not WF      |





**Combination of predicates**:


| RFID Length | Test Descriptor ID | New Test Descriptor ID | Test Result | Test Date | Valid/Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|-------|
|  WF | t >= 0 | n >= 0 | true | WF |  Valid | T1(WF,11,22,true,WF;Test Result Created) |  |
|         |        |    |      | not WF |  Invalid | T2(WF,11,22,true,not WF;error) |  |
|         |        |    | false | WF |  Invalid | T3(WF,11,22,false,WF;error) |  |
|         |        |    |       | not WF |  Invalid | T4(WF,11,22,false,not WF;error) |  |
|     |        | n < 0 | true | WF |  Invalid | T1(WF,11,-22,true,WF;error) |  |
|         |        |    |      | not WF |  Invalid | T2(WF,11,-22,true,not WF;error) |  |
|         |        |    | false | WF |  Invalid | T3(WF,11,-22,false,WF;error) |  |
|         |        |    |       | not WF |  Invalid | T4(WF,11,-22,false,not WF;error) |  |
|     | t < 0 | n >= 0 | true | WF |  Invalid | T1(WF,-11,22,true,WF;error) |  |
|         |        |    |      | not WF |  Invalid | T2(WF,-11,22,true,not WF;error) |  |
|         |        |    | false | WF |  Invalid | T3(WF,-11,22,false,WF;error) |  |
|         |        |    |       | not WF |  Invalid | T4(WF,-11,22,false,not WF;error) |  |
|     |        | n < 0 | true | WF |  Invalid | T1(WF,-11,-22,true,WF;error) |  |
|         |        |    |      | not WF |  Invalid | T2(WF,-11,-22,true,not WF;error) |  |
|         |        |    | false | WF |  Invalid | T3(WF,-11,-22,false,WF;error) |  |
|         |        |    |       | not WF |  Invalid | T4(WF,-11,-22,false,not WF;error) |  |
|  not WF | t >= 0 | n >= 0 | true | WF |  Invalid | T1(not WF,11,22,true,WF;error) |  |
|         |        |    |      | not WF |  Invalid | T2(not WF,11,22,true,not WF;error) |  |
|         |        |    | false | WF |  Invalid | T3(not WF,11,22,false,WF;error) |  |
|         |        |    |       | not WF |  Invalid | T4(not WF,11,22,false,not WF;error) |  |
|     |        | n < 0 | true | WF |  Invalid | T1(not WF,11,-22,true,WF;error) |  |
|         |        |    |      | not WF |  Invalid | T2(not WF,11,-22,true,not WF;error) |  |
|         |        |    | false | WF |  Invalid | T3(not WF,11,-22,false,WF;error) |  |
|         |        |    |       | not WF |  Invalid | T4(not WF,11,-22,false,not WF;error) |  |
|     | t < 0 | n >= 0 | true | WF |  Invalid | T1(not WF,-11,22,true,WF;error) |  |
|         |        |    |      | not WF |  Invalid | T2(not WF,-11,22,true,not WF;error) |  |
|         |        |    | false | WF |  Invalid | T3(not WF,-11,22,false,WF;error) |  |
|         |        |    |       | not WF |  Invalid | T4(not WF,-11,22,false,not WF;error) |  |
|     |        | n < 0 | true | WF |  Invalid | T1(not WF,-11,-22,true,WF;error) |  |
|         |        |    |      | not WF |  Invalid | T2(not WF,-11,-22,true,not WF;error) |  |
|         |        |    | false | WF |  Invalid | T3(not WF,-11,-22,false,WF;error) |  |
|         |        |    |       | not WF |  Invalid | T4(not WF,-11,-22,false,not WF;error) |  |



  ### **Class *TestResultDB* - method *deleteTestResult***



**Criteria for method *deleteTestResult*:**
	

 - Test Result ID
 - RFID



**Predicates for method *deleteTestResult*:**


| Criteria | Predicate |
| -------- | --------- |
|     Test Result ID     |     t >= 0      |
|     RFID     |     r = 32      |




**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     Test Result ID     |        t >= 0         |
|          |        t < 0         |
|     RFID     |        r = 0         |
|          |        r != 0         |



**Combination of predicates**:


| Test Result ID | RFID | Valid/Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
| t >= 0 | r = 32 | Valid | T1(11,11111111222222223333333344444444;Test Result Deleted) |  |
|       | r != 32 | Invalid | T2(11,1111111122222222333333334444;error) |  |
| t < 0 | r = 32 | Invalid | T3(-11,11111111222222223333333344444444;error) |  |
|       | r != 32 | Invalid | T4(-11,1111111122222222333333334444;error) |  |



  ### **Class *UsersDB* - method *createUser***



**Criteria for method *createUser*:**
	

 - Username
 - Name
 - Surname
 - Password
 - User Type



**Predicates for method *createUser*:**


| Criteria | Predicate |
| -------- | --------- |
|     Username     |     WF      |
|     Name     |     WF      |
|     Surname     |     WF     |
|     Password     |     WF      |
|     User Type     |     WF      |




**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     Username     |     WF      |
|          |     not WF      |
|     Name     |     WF      |
|          |     not WF      |
|     Surname     |     WF     |
|          |     not WF     |
|     Password     |     WF      |
|          |     not WF      |
|     User Type     |     WF      |
|          |     not WF      |




**Combination of predicates**:


| Username | Name | Surname | Password | User Type | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|
| WF | WF | WF | WF | WF | Valid | T1(WF,WF,WF,WF,WF;User Created) |  |
|    |    |    |    | not WF | Invalid | T2(WF,WF,WF,WF,not WF;error) |  |
|    |    |    | not WF | WF | Invalid | T3(WF,WF,WF,not WF,WF;error) |  |
|    |    |    |    | not WF | Invalid | T4(WF,WF,WF,WF,not WF;error) |  |
|    |    | not WF | WF | WF | Invalid | T5(WF,WF,not WF,WF,WF;error) |  |
|    |    |    |    | not WF | Invalid | T6(WF,WF,not WF,WF,not WF;error) |  |
|    |    |    | not WF | WF | Invalid | T7(WF,WF,not WF,not WF,WF;error) |  |
|    |    |    |    | not WF | Invalid | T8(WF,WF,not WF,WF,not WF;error) |  |
|    | not WF | WF | WF | WF | Invalid | T9(WF,not WF,WF,WF,WF;error) |  |
|    |    |    |    | not WF | Invalid | T10(WF,not WF,WF,WF,not WF;error) |  |
|    |    |    | not WF | WF | Invalid | T11(WF,not WF,WF,not WF,WF;error) |  |
|    |    |    |    | not WF | Invalid | T12(WF,not WF,WF,WF,not WF;error) |  |
|    |    | not WF | WF | WF | Invalid | T13(WF,not WF,not WF,WF,WF;error) |  |
|    |    |    |    | not WF | Invalid | T14(WF,not WF,not WF,WF,not WF;error) |  |
|    |    |    | not WF | WF | Invalid | T15(WF,not WF,not WF,not WF,WF;error) |  |
|    |    |    |    | not WF | Invalid | T16(WF,not WF,not WF,WF,not WF;error) |  |
| not WF | WF | WF | WF | WF | Invalid | T17(not WF,WF,WF,WF,WF;error) |  |
|    |    |    |    | not WF | Invalid | T18(not WF,WF,WF,WF,not WF;error) |  |
|    |    |    | not WF | WF | Invalid | T19(not WF,WF,WF,not WF,WF;error) |  |
|    |    |    |    | not WF | Invalid | T20(not WF,WF,WF,WF,not WF;error) |  |
|    |    | not WF | WF | WF | Invalid | T21(not WF,WF,not WF,WF,WF;error) |  |
|    |    |    |    | not WF | Invalid | T22(not WF,WF,not WF,WF,not WF;error) |  |
|    |    |    | not WF | WF | Invalid | T23(not WF,WF,not WF,not WF,WF;error) |  |
|    |    |    |    | not WF | Invalid | T24(not WF,WF,not WF,WF,not WF;error) |  |
|    | not WF | WF | WF | WF | Invalid | T25(not WF,not WF,WF,WF,WF;error) |  |
|    |    |    |    | not WF | Invalid | T26(not WF,not WF,WF,WF,not WF;error) |  |
|    |    |    | not WF | WF | Invalid | T27(not WF,not WF,WF,not WF,WF;error) |  |
|    |    |    |    | not WF | Invalid | T28(not WF,not WF,WF,WF,not WF;error) |  |
|    |    | not WF | WF | WF | Invalid | T29(not WF,not WF,not WF,WF,WF;error) |  |
|    |    |    |    | not WF | Invalid | T30(not WF,not WF,not WF,WF,not WF;error) |  |
|    |    |    | not WF | WF | Invalid | T31(not WF,not WF,not WF,not WF,WF;error) |  |
|    |    |    |    | not WF | Invalid | T32(not WF,not WF,not WF,WF,not WF;error) |  |



  ### **Class *UsersDB* - method *login***



**Criteria for method *login*:**
	

 - Username
 - Password
 - User Type



**Predicates for method *login*:**


| Criteria | Predicate |
| -------- | --------- |
|     Username     |     WF      |
|     Password     |     WF      |
|     User Type     |     WF      |




**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     Username     |     WF      |
|          |     not WF      |
|     Password     |     WF      |
|          |     not WF      |
|     User Type     |     WF      |
|          |     not WF      |




**Combination of predicates**:


| Username | Password | User Type | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
| WF | WF | WF | Valid | T1(WF,WF,WF;User Created) |  |
|    |    | not WF | Invalid | T2(WF,WF,not WF;error) |  |
|    |  not WF  | WF | Invalid | T3(WF,not WF,WF;error) |  |
|    |    | not WF | Invalid | T4(WF,WF,not WF;error) |  |
| not WF | WF | WF | Invalid | T5(WF,WF,WF;error) |  |
|    |    | not WF | Invalid | T6(WF,WF,not WF;error) |  |
|    |  not WF  | WF | Invalid | T7(WF,not WF,WF;error) |  |
|    |    | not WF | Invalid | T8(WF,WF,not WF;error) |  |



  ### **Class *UsersDB* - method *updateRight***



**Criteria for method *updateRight*:**
	

 - Username
 - New User Type



**Predicates for method *updateRight*:**


| Criteria | Predicate |
| -------- | --------- |
|     Username     |     WF      |
|     New User Type     |     WF      |




**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     Username     |     WF      |
|          |     not WF      |
|     New User Type     |     WF      |
|          |     not WF      |




**Combination of predicates**:


| Username | New User Type | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| WF | WF | Valid | T1(WF,WF;Right Updated) |  |
|    | not WF | Invalid | T2(WF,not WF;error) |  |
| not WF | WF | Invalid | T3(WF,WF;error) |  |
|    | not WF | Invalid | T4(WF,not WF;error) |  |



  ### **Class *UsersDB* - method *deleteUser***



**Criteria for method *deleteUser*:**
	

 - Username
 - User Type



**Predicates for method *deleteUser*:**


| Criteria | Predicate |
| -------- | --------- |
|     Username     |     WF      |
|     User Type     |     WF      |




**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     Username     |     WF      |
|          |     not WF      |
|     User Type     |     WF      |
|          |     not WF      |




**Combination of predicates**:


| Username | User Type | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| WF | WF | Valid | T1(WF,WF;User Deleted) |  |
|    | not WF | Invalid | T2(WF,not WF;error) |  |
| not WF | WF | Invalid | T3(WF,WF;error) |  |
|    | not WF | Invalid | T4(WF,not WF;error) |  |




# White Box Unit Tests

### Test cases definition
    
    
    <Report here all the created Jest test cases, and the units/classes under test >
    <For traceability write the class and method name that contains the test case>


| Unit name | Jest test case |
|--|--|
|||
|||
||||

### Code coverage report

    <Add here the screenshot report of the statement and branch coverage obtained using
    the coverage tool. >


### Loop coverage analysis

    <Identify significant loops in the units and reports the test cases
    developed to cover zero, one or multiple iterations >

|Unit name | Loop rows | Number of iterations | Jest test case |
|---|---|---|---|
|||||
|||||
||||||



