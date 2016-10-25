

#### UNION
```
SELECT 1 
UNION ALL
SELECT 2 
UNION ALL
SELECT 2
```

####NOTE:  __Domain__ of a variable is all the possible values 
  * ex: integer - there is a max and a min 
  * you can say i only want odd so you decreased the domain to only odd - you can do this with the constraint 
  * most common - not null

#### CONSTRAINTS
* Not null
* Unique
* Primary key - implies it has to be unique and not null [this is where you say a particular column is not null]
* Refrences
  * if you have a table with a column and you say use this column as a refrence,  it means if someone tries to input data into another column in another table that doesn't exist in the column that is the refrence it won't let you
  * to do a refrence that is constrained by the comination of two columns: 
    ```
      CREATE TABLE Ties (
        colorID1,
        colorID2,
        material,
        Foreign Key(colorID1, colorID2) References colors(ID1, ID2)
      )
      
      where CID1 and CID2 are from another table 
    ```
* Checks

__NOTE: don't keep checks/constraints in the front end on bad data, just don't allow it in the database in the first place - always better to enforce constraints in the database not elsewhere because otherwise you will be checking on the front end for the rest of the data's life - longer than your life__

#### INDEXES:
* create unique index ...
* a db uses an index so it is alway ssorted and it can perform a binary search (it will keep multiple copies of itself if you have multiple unique IDs so that it can always perform a binary search on the unique keys for optimization - indexes are the unseen (to us) keys that it uses for this)

* you can put your own index on a tabe which is the only way to have a sorted database
* db don't sort the individual columns 

```
CREATE index name ON table (
  col1,
  col2
)

this will sort col1 and then look at col2
```


```
SQL
CREATE TABLE schema.table
(
    col1 Datatype column_constraint
)

column_constraint:
[NOT] NULL
CHECK (test_involving_this_column)
UNIQUE
PRIMARY KEY
REFERENCES other_table (col1, col2)
```
```
SQL
CREATE TABLE schema.table
(#### Table Constraints
All of the column constraints (except not null) have equivalent table constraints.
    col1 Datatype,
    table_constraint
)
table_constraint:
[CONSTRAINT name] the_rest

the_rest:
CHECK (test_involving_any_columns)
UNIQUE (local_col1, local_col2, ...)
PRIMARY KEY (local_col1, local_col2, ...)
FOREIGN KEY (local_col1, local_col2, ...) REFERENCES other_table (foreign_col1, foreign_col2, ...)
```
```
SQL
CREATE [UNIQUE] INDEX index_name ON table_name (col1, col2);
```

#### DATABASE DIAGRAMS
1. Chen Diagram 
  entities, attributes, relations
  * this one is nice because it has a label on the relations
  * `is` says i am doing something to link the two tables (doesn't have to be explicit in the diagram) but it is almost certainly the IDs

2. Crows Foot diagram 
  * Primary Key (view photo in phone) is an index key with two columns
  * you could do the primary key and then create another index that was just materialID so you could look for that faster


#### NORMALIZATION
_note: dependecies: ex. i can give you the city based on a zip code you give me_ 
1. rows aren't ordered, cols aren't ordered, no duplicates, each cell has only one key, and there is a primary key
 * you have dependence tables that link to things instead of having multiple values in a cell, has a primary key
2. Composit candidate key, possible to predict a value of a column from any part of that key - you are not in second normalized form
(2nd normal form also encompasses 1st normal form)
3. if you can use any non-key col to predict any other non-ley col it is not third normal form 

* the idea is to keep information seperate when possible - better to have two tables where you can get an id and relate that to another table then if you have to update one table you don't have to touch the other one 
(try not to duplicate data essentially)
* Third normal form is great if you are doing constant updates  

#### DE-Normalization
* When you directly ignore these forms intentionally

__Feels like normalization__
4. data warehouses which support a particular type of schema
  * Group by every dimension and sum every amount - very simple but not a good form for more complex data 

## TONIGHT'S ASSIGNMENT:
1. Run the first two queries.

```SQL
SELECT neighborhood
INTO TEMP t
FROM crimedataraw
GROUP BY neighborhood

SELECT neighborhood
INTO TEMP t2
FROM crimedataraw
WHERE major_offense_type = 'Runaway'
GROUP BY neighborhood
```

Next, rewrite this query without using any inner or outer joins.

```SQL
SELECT *
FROM t LEFT OUTER JOIN t2
    ON t.neighborhood = t2.neighborhood
```
_hint: use a cross join and a union all_

A: 
```SQL
SELECT neighborhood, neighborhood
FROM t2
UNION
(SELECT neighborhood, null
FROM t EXCEPT SELECT neighborhood, null FROM t2) 
```

2. Select the crime types and counts into a temp table.  Select 1 record from this table and then delete that record.  Make sure that your select/delete queries will work the second and third time they're executed.  How do you know that you deleted the correct record?

3. Create a CTE to join crimedataraw and the two related tables.  Select all of the data from it.  How long did it take?  Run it several times and right down how long it takes.

4. Create primary key constraints on all appropriate columns for 3 crime data tables.

5. Create foreign key constraints on all appropriate columns for crime data tables.

6. How long does the CTE query take now?

7. Create a timestamp column that combines the time and date.  Call it report_time_date.

8. Use a correlated subquery to select all of the information on each crime plus the crime type of the previous crime committed in the same neighborhood.  Do not use a windowing function here.  How long does the query take.  Execute it several times and write down how long it takes.

9. Add an index for that subquery.  How long does the query take now?

10. Create a new varchar column called test_column on crimedataraw.  Run an update statement to assign the value 'value' to the test column for every row.  Write down how long it took.  Run the update several times.  Write down the execution time for each run.  Create 3 new indexes on crimedataraw that include the column test_column.  How long does the update take now?

11. Draw an ERD for our crime data.  What would you change to make it 3rd normal form?  Do it.  What would you change to make it more useful for our queries?`
