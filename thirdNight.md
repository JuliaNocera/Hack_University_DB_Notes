# Monday Oct 17, 2016 ~ Getting Query

#### Structured Vs Un-Structered Data 
* if you can break info into relateable segments its structured 
* a book is considered unstructured (exception is if you look at it as chapters, etc)


### Rules About Tables
* Tables are sets not lists 
* asking for first record in table is doesn't make sense
*  you can ask what is first record inserted in table though
* seperate words with underscores
* singular vs plural -> Choice (student table vs students table)
* but whatever you do, be consistent
* Column names should be singular 
* underlying structure of names 

DatabseName.SchemaName.ObjectName
Obj Name => ex: crimeDataRaw

we must have a unique identifier to be able to pull data out of a table -> Classic tool for this is __Candidate Key__
CandidateKey = any column that has no duplicate value 

ex: if Id has a duplicate but part number doesn't than id + part 2 is a candidate key

You can enforce a candidate key by not allowing a duplicate data in that table
Primary Key is your "favorite" candidate key
often the primary key is an interger ID column that increments automatically (you can use strings but you need to be careful)

#### Joins
a join is if you have a candidate key from one table in another table you don't have to store info for that key in a second table - you can just use it to refer to the table where the key came from 

#### Data Types: (find definitions in notes)
* input all money values with a type of Decimal
* key term: Digit of Precision
* char is good  ---  char (n) is not good

Optimize when queries are slow not before

#### Trinary Logic
* True, False, or Null
* you should explicitly know/say what null means in your db (classic - "_I don't know_")
* 1 + 1 = 2, 1 + "I don't know" = "I don't know"

#### Comments 
-- everything after this is a comment 
/* everything inside here is a comment */
---
### QUERIES
ex:
```
SELECT *  // select all of the columns (never do this in production)
FROM crimedata.crimedataraw  // source data (starting point) - in this case it is start with all data in crime data table
LIMIT 10;  // limit to 10 lines
```

```
SELECT major_offense_type  -- Column name
FROM crimedata.crimedataraw  
LIMIT 10;
```

```
SELECT table_alias.major_offense_type mot  // you can create an alias using table_alias.<column name> <alias name> -- you can also do table_alias.<column name> AS <alias name>
FROM crimedata.crimedataraw table_alias    // this shows as column header when you get results
LIMIT 10;
```

* You don't have to do uperrcase in your queries but it is nice to see visually and is slightly better
* Anything you can do in python you can do in postgres

##### Expressions
1. Concatenation : takes two strings or things that can be converted to strings and concatenates them
    - Ex. SELECT length(major_offense_type || neighborhood)
    - Length function gives you the length of the things
2. Like : % = any number of characters and _ for exactly one (You can use regEx in like to get exactly what you want)
    - RegExp is best tool for string manipulation which is what we usually do with databases
    - shortcut for word like is `~`
3. now() : you can often do arithmetic on dates using now() but you can also use it with SELECT as well so you can `SELECT now()`

 * Read everything up through string functions __https://www.postgresql.org/docs/current/static/functions.html__ -- this is the resource for finding out what you don't know how to solve
* you can get the number of non-nulls in a table!

##### ORDER BY
```
SELECT major_offense_type, count(*)
FROM crimedata.crimedataraw
ORDER BY id DESC, recod_id ASC
LIMIT 10;
```
* `order by` orders the whole result and then `limit` limits what is shown

##### GROUP BY
``` 
SELECT major_offense_type, count(*)
FROM crimedata.crimedataraw AS table_alias
GROUP BY major_offense_type 
HAVING count(*) > 100
LIMIT 10;
```
* `HAVING` is the same as WHERE except it happens after the GROUP BY and WHERE happens before the GROUP BY


---
## TONIGHT'S ASSIGNMENT: 
```
Assignment

   Select 5 rows
   Select date and neighborhood for 10 rows
   Select the hour of the day for 10 rows
   Select the second word of the neighborhood name
   Create a sentence describing what happened on each row for 100 rows (using a query)

harder problems

   Select the first row inserted.
   Select the last row inserted.
   Select the total crimes by neighborhood.
   Select the min and max coordinates by neighborhood.
   Which hour has the most crimes?
   Which day of week has the most crimes?
   Which season has the highest rate of crime
```

### MY ANSWERS: 
```
1. 
SELECT *
FROM crimedata.crimedataraw 
LIMIT 5; 

2. 
SELECT report_date, neighborhood
FROM crimedata.crimedataraw 
LIMIT 10;

3.
SELECT extract(hour from report_time)
FROM crimedata.crimedataraw 
LIMIT 10;

4.
SELECT split_part(neighborhood, '-', 2) || split_part(neighborhood, ' ', 2)
FROM crimedata.crimedataraw

5. 
SELECT concat('On ', report_date, ' at ', report_time, ' in ', neighborhood, ' Portland police precinct, ', police_precinct, ', reported an offense of type ', major_offense_type)  
FROM crimedata.crimedataraw

You can also solve the above with :
SELECT 'On ' || report_date || ' at ' || report_time || ' in ' || neighborhood || ' Portland police precinct, ' || police_precinct  || ', reported an offense of type ' || major_offense_type
FROM crimedata.crimedataraw

You can also use format which is like python string formatting (apparently) where you put a placeholder of %S in the string and then after you list off the properties that should fill in the S's in associated order

6. 
SELECT *  
FROM crimedata.crimedataraw
ORDER BY id ASC
LIMIT 1;

7. 
SELECT *  
FROM crimedata.crimedataraw
ORDER BY id DESC
LIMIT 1;

8. 
SELECT neighborhood, count(*)  
FROM crimedata.crimedataraw
GROUP by neighborhood

9.
SELECT neighborhood, min(xcoordinate) min_x, max(xcoordinate) max_x, min(ycoordinate) min_y, max(ycoordinate) max_y
FROM crimedata.crimedataraw 
GROUP BY neighborhood

10. 
SELECT extract(hour from report_time) as hour, count(*) crimes
FROM crimedata.crimedataraw 
Group By hour
ORDER BY crimes DESC

11.
SELECT extract(quarter from report_date) as season, count(*) crimes
FROM crimedata.crimedataraw 
Group By season
ORDER BY crimes DESC

__OR__

SELECT
CASE extract(quarter from report_date)
     when 1 then 'winter'
     when 2 then 'spring'
     when 3 then 'summer'
     when 4 then 'autumn'
end as seasons,
count(*) as crime_num
FROM crimedata.crimedataraw
GROUP BY seasons
ORDER BY crime_num DESC
```
