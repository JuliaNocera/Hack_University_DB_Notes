# Fourth Night (Wed. Oct. 19th) ~ Talking Functions

Distinct is a key word that ... ?

if you don't know why your query doesn't work without DISTINCT then your query is WRONG for sure no question

##### Aggregate Functions:
* count(*) --> how many rows
* count(column) --> how many rows without null
* most reliable aggregate function when dealing with nulls
* count(*)
* count(neighborhood)
* count(distinct neighborhood)

* sum & Average will ignore nulls (avg does sum and then divides by # of columns that are not null)

##### Window Functions:
* about a decade old 
* check them out here : https://www.postgresql.org/docs/current/static/functions-window.html
* window functions parse out a section of data and then perform a function on that data

* you can also use RANK in ORDER BY 
* show previous row works with order by and rank
* you can filter by rank as well so you can say tell me the top one or the third one

```
EX:
SELECT major_offense_type, neighborhood, id, count(*) OVER (PARTITION BY neighborhood, major_offense_type)
FROM crimedata.crimedataraw
WHERE neighborhood <> '' // Take the neighborhood chunks out and then perform count(*)
LIMIT 10

// HAS a very COOL output that shows you the totals as well as the individual chunks of data
// pulls back major offense type for every row
---
### IMPORTANT THINGS TO NOTE:
you can put all logic in WHERE as well as SELECT if you want to filter on something there but you should also have 
```

#### JOINS
* CROSS JOIN: `,` is the same as CROSS JOIN in terms of syntax
* INNER JOIN: basically starts with a cross join and then put a where clause (where the position in the alphabet of table 2 matches the number in table 1)
* OUTER JOINS: what numbers in T1 don't have a match in T2 --> does an inner join and then includes the things that didn't have a match between the tables
    * LEFT: includes all things from table 1
    * RIGHT: all things from 2nd table
    * FULL: all things from both 

```
EX:
FROM t1 INNER JOIN t2     // this is a cross join if only this line
  ON ti.ID = t2.Foreign_id  // this is exactly like a where clause  (the ON is indented due to style preference)

FULL EX:
SELECT *
FROM t1 LEFT OUTER JOIN t2
 ON t1.ID = t2.Foreign_id
WHERE t1.name = 'zeke';

since this is a left join 
  if t1.ID doesn't have a match in t2.Foreign_id
  AND doesn't have aname of zeke
    it won't be shown 

  if it doesn't have a match 
  and DOES have a name zeke
    it will be shown


create a new colum as subquery that will be passed into the outer query 

SELECT *
FROM (SELECT ID, neighborhood
    FROM table) subquery_alias; // you would use this alias in your select if you had a join or in ON or WHERE


Pull back all the crimes where the neighborhood is in the list
SELECT *                       // gets all the data
FROM crimedata.crimedataraw
WHERE neighborhood IN (SELECT neighborhood FROM crimedata.crimedataraw WHERE major_offense_type = 'Runaway'); // where the neighborhood includes the crime 'Runaway'
but give me all that data about the not just the data about the Runaway

SELECT *
FROM crimedata.crimedataraw o
WHERE o.neighborhood = (SELECT neighborhood
            FROM crimedata.crimedataraw
            GROUP BY Neighborhood
            ORDER BY COUNT(*) DESC
            LIMIT 1)
LIMIT 100;

NOTE: you MUST alias when you are in the FROM clause

Correlated or not correlated:
for each crime go check and see if there exists this condition (go row by row):
SELECT neighborhood
FROM crimedata.crimedataraw o
WHERE EXISTS (SELECT 1 FROM crimedata.crimedataraw i WHERE i.neighborhood = o.neighborhood AND i.major_offense_type = 'Runaway')
GROUP BY neighborhood;

SELECT neighborhood, CASE WHEN (    SELECT 1
                    FROM crimedata.crimedataraw i
                    WHERE i.neighborhood = o.neighborhood AND i.major_offense_type = 'Runaway'
                    LIMIT 1) IS NOT NULL THEN 'has' ELSE 'doesn't have' END || ' runaway'
FROM crimedata.crimedataraw o
GROUP BY neighborhood;

-- This is syntactic sugar to using a subquery --
WITH alias_for_subquery AS
(
    SELECT * FROM crimedata.crimedataraw
)
SELECT *
FROM alias_for_subquery;


```

#### ADDING DATA 
```
CREATE TABLE schema.name
(
    col1 type,
    col2 type,
    col3 type
);


Temporary Tables: good for calculations
CREATE TEMP TABLE name
(
    col1 type,
    col2 type,
    col3 type
);


Change the table structure
ALTER TABLE TABLE ADD col1 type;    


You can make a query and then send the query results into a new table that you name below
SELECT *
INTO schema.tablename
FROM table


Put this stuff into the table for as many cols as you like 
INSERT INTO schema.table (col1)  // must be a defined column
SELECT col1
FROM TABLE;


You can specify the values to insert
INSERT INTO TABLE (col1)
VALUES (1),      // inside each paren is one row
    (2),
    (3);


Update your table
UPDATE schema.table SET col1 = val
FROM other_TABLE --this clause is optional
WHERE join_criteria; --this clause is optional

// deletes the data but not the table
DELETE FROM schema.table
WHERE neighborhood = 'Brooklyn';

Destroys the table
DROP TABLE schema.table;

```

__NOTE: You never change the schema in production, you constantly change the structure__

---
### Assignment

1. For each crime type, count the number of neighborhoods where it happened.
```
SELECT major_offense_type, count(distinct neighborhood)
FROM crimedata.crimedataraw
GROUP BY major_offense_type;
```

2. Create sentences for the different crime types saying "<crime type> isn't ok."
```
SELECT distinct major_offense_type || ' isn't ok.' crimes
FROM crimedata.crimedataraw
GROUP BY crimes;
```

3. Extract distinct crime types from crimedataraw using SELECT INTO and then add an id column.  Name the table crime_types.
```
SELECT distinct major_offense_type
   INTO crimedata.crime_types
FROM crimedata.crimedataraw;

ALTER TABLE crimedata.crime_types
ADD ID serial;
```

4. Add appropriate crime type id to crimedataraw.
```
UPDATE crimedata.crimedataraw raw SET crime_type_id = types.id
FROM crimedata.crime_types types
WHERE raw.major_offense_type = types.major_offense_type;
```
5. Repeat for neighborhood names using CREATE TABLE and not altering the table after.  Name the table neighborhoods.
create table empty and then fill it in

```
CREATE OR REPLACE FUNCTION neighborhoodTable() 
RETURNS TABLE(neighborhood varchar, NID int) AS '
    BEGIN
        RETURN QUERY 
            CREATE TABLE crimedata.neighborhoods2 AS (SELECT distinct neighborhood FROM crimedata.crimedataraw);
            ALTER TABLE crimedata.neighborhoods2 ADD NID serial;
    END;
    ' LANGUAGE plpgsql;

SELECT neighborhoodTable()
```

6. Pull back the number of each crime type committed per neighborhood (0 if there were 0).
```
SELECT neighborhood, major_offense_type, count(major_offense_type)
FROM crimedata.crimedataraw
WHERE neighborhood <> ''
GROUP BY neighborhood, major_offense_type
ORDER BY neighborhood

-- this doesn't account for the 0s so you should do a cross join of the two previously created tables and then you can use counts to find for 0s and add in any crime that has a 0

-OR-

SELECT neighborhood, major_offense_type, count(major_offense_type)
FROM crimedata.crimedataraw
GROUP BY neighborhood, major_offense_type

-OR-
--FOR A SENTENCE--
SELECT format('In %s there were %s incidents of %s', 
          CASE 
            when neighborhood!='' then initcap(neighborhood) 
            when neighborhood='' then 'an unknown neighborhood' 
          END, 
          count(major_offense_type), lower(major_offense_type)) 
FROM crimedata.crimedataraw
GROUP BY neighborhood, major_offense_type
```

7. Assuming that each neighborhood is square and lines up with the coordinate system, which neighborhood has the highest crime rate per square foot?  Can you do it with one query?
```
SELECT neighborhood, crime_num/area as crime_rate
FROM (
   SELECT neighborhood,count(*) as crime_num, abs(max(xcoordinate)-min(xcoordinate))*abs(max(ycoordinate)-min(ycoordinate)) as area
   FROM crimedata.crimedataraw
   GROUP BY neighborhood) as subq
WHERE area != 0 AND neighborhood != ''
ORDER BY crime_rate DESC;
```
* in subquery - selet neighborhood, count

--OR--

```
SELECT neighborhood, COUNT(*)
        / (2000+(MAX(x_coordinate) - MIN(x_coordinate)) * 
        (MAX(y_coordinate) MIN(y_coordinate)))
FROM crimedata.crimedataraw
GROUP BY neighborhood
HAVING (2000+(MAX(x_coordinate) - MIN(x_coordinate)) * 
        (MAX(y_coordinate) MIN(y_coordinate))) > 0
ORDER BY 2 DESC
```


#### Harder Questions

1. Which neighborhood has the highest rate of each type of crime?  Can you do it with one query?

2. List each crime and show the type of the previous crime committed in that same neighborhood.  

3. Modify crime type table to include cost_per_crime and populate with data similar to what's found at http://www.rand.org/jie/justice-policy/centers/quality-policingg/cost-of-crime.html.  Do the modification by inserting the new values into a temp table and then doing a join to allow a batch update to the major crime table.

4. Pull back total crimes and total crime cost for each neighborhood.

5. Which crime has the highest total cost by for each neighborhood.


