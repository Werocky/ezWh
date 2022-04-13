# Project Estimation  
Date: 09/04/2022

Version: 1.1


# Estimation approach
Consider the EZWH  project as described in YOUR requirement document, assume that you are going to develop the project INDEPENDENT of the deadlines of the course
# Estimate by size
### 
|             | Estimate                        |             
| ----------- | ------------------------------- |  
| NC =  Estimated number of classes to be developed   |              35               |             
|  A = Estimated average size per class, in LOC       |              50            | 
| S = Estimated size of project, in LOC (= NC * A) | 1750 |
| E = Estimated effort, in person hours (here use productivity 10 LOC per person hour)  |               175                       |   
| C = Estimated cost, in euro (here use 1 person hour cost = 30 euro) | 5250 | 
| Estimated calendar time, in calendar weeks (Assume team of 4 people, 8 hours per day, 5 days per week ) |          1.1          |               

# Estimate by product decomposition
### 
|         component name    | Estimated effort (person hours)   |             
| ----------- | ------------------------------- | 
|requirement document    | 40 |
| GUI prototype |20|
|design document |60|
|code |175|
| unit tests |20|
| api tests |20|
| management documents  |10|



# Estimate by activity decomposition
### 
|         Activity name    | Estimated effort (person hours)   |             
| ----------- | ------------------------------- | 
| Write the requirement document|30 |
| Design the GUI prototype| 20 |
| Verify the requirements|10 |
| Write the design document| 50|
| Verify the design| 10 |
| Coding|175 |
| Unit testing| 20 |
| API testing|20 |
| Project management|15 |
| Configuration management|15 |

###
![Gantt](/Images/Gantt.jpg)

# Summary

Report here the results of the three estimation approaches. The  estimates may differ. Discuss here the possible reasons for the difference

|             | Estimated effort                        |   Estimated duration |          
| ----------- | ------------------------------- | ---------------|
| estimate by size |175 ph| 1.1 weeks
| estimate by product decomposition |335 ph |2.1 weeks
| estimate by activity decomposition |335 ph | 2.1 weeks or 3.4 weeks according to the Gantt chart

## Conclusion (to complete)
The estimate by size only considers the cumulative number of lines of code for each class to implement, ignoring the other parts of the project, while the other estimates consider every part of the project.



