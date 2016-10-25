
#### Going through the Vagrantfile & the basic_provision_script.sh

##### Vagrant file
sync folder: ./home/vagrant/proj => is a folder that lives on your Host OS (your machine) and is accessible through your guest host (the virtual machine thought vagrant)

use vagrant directly in amazon host services

##### basic_provision_script.sh
apt-get (learn more about this)

line 12 fixes the problem of if you get an error message that says your system doesnt match the vagrant system (or something like that)

---
##### BASH COMMANDS

* HEAD - first 10 rows of a file 
* info & man are similar 
* exit --> try if you end up somewhere you are unhappy
* sudo = hall pass for the operating system
* sudo su <somebody else> => pretend you are somebody else
* > :: ex ls > <file> list contents of directory into that file
* < :: less < file hand file contents to less to show on the screen
* ls | less  takes contents of directory and pipes to less formatting 
* firefox & 

```
Dear Algebra,
  Please stop asking us to find your x.
  She's not coming back
```

apt-cache search <something>     look in your list of things you know how to install and search for the <something> -> you can pipe this into a file to be more readable but basically you want to see what options you have for install and then 

`vagrant destroy` destroys virtual box config

---
#### Why Databases?
*  because if you're doing complicated things while searching a text file you have to write complex parsing skills
*  also when you add things to the file and you have 500 places looking at the file, you need to rewrite 500 files
*  bad queries which result in destroyed data

Ex.
What is the average response time of emergency responders?
* better to have the database do the work and then send the client the results so you aren't transferring a ton of data across, potentially, the world

sudo su postgres

when you (s)witch (u)ser to postgres or pgadmin you will now be in a different environment 

pgadmin3 to get pgadmin running --> this is our graphical interface

now we will add a server `file -> add server`

logged into guest os as vagrant user, use psql command and type gunzip _ <filename & tab>

if pgadmin3 ever needs a password it is `vagrant`
