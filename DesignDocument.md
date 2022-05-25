# Design Document 


Authors: 

Date:

Version:


 1.1 : Updated class diagram, "DatabaseHelper" renamed as "WarehouseDB", "DataImpl" renamed as "server" 


# Contents

- [High level design](#package-diagram)
- [Low level design](#class-diagram)
- [Verification traceability matrix](#verification-traceability-matrix)
- [Verification sequence diagrams](#verification-sequence-diagrams)

# Instructions

The design must satisfy the Official Requirements document, notably functional and non functional requirements, and be consistent with the APIs

# High level design 


The system is based on a central database that defines the data model, in a repository style. The architecture is also organized in a layered fashion, with the layers being the data on the database, the application logic and the GUI for the presentation/user interface.


![Package diagram](Images/PackageDiagram.jpg "PackageDiagram")






# Low level design


EzWarehouse backend
![Class diagram](Images/ClassDiagram.jpg "ClassDiagram")







The "server" class contains methods that mirror the APIs exposed to the front-end
# Verification traceability matrix


![Traceability matrix](Images/Verification_Traceability_Matrix_Subs_Included_page-0001.jpg "Traceability Matrix")









# Verification sequence diagrams 

In the scenarios that follow an iterative procedure, only a single iteration is shown

Scenario 1.2

![Scenario 1.2](Images/Scenario_1.2.jpg "Scenario 1.2")

Scenario 3.2

![Scenario 3.2](Images/Scenario_3.2.jpg "Scenario 3.2")

Scenario 5.1.1

![Scenario 5.1.1](Images/Scenario_5.1.1.jpg "Scenario 5.1.1")

Scenario 5.2.3

![Scenario 5.2.3](Images/Scenario_5.2.3.jpg "Scenario 5.2.3")

Scenario 5.3.3

![Scenario 5.3.3](Images/Scenario_5.3.3.jpg "Scenario 5.3.3")

Scenario 6.1

![Scenario 6.1](Images/Scenario_6.1.jpg "Scenario 6.1")

Scenario 9.2

![Scenario 9.2](Images/Scenario_9.2.png "Scenario 9.2")

Scenario 10.1

![Scenario 10.1](Images/Scenario_10.1.png "Scenario 10.1")

Scenario 11.1

![Scenario 11.1](Images/Scenario_11.1.png "Scenario 11.1")

Scenario 12.1

![Scenario 12.1](Images/Scenario_12.1.png "Scenario 12.1")



