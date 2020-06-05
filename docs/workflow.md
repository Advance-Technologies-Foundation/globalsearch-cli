## User workflow

* Setup global search
    * Install and run elasticsearch
    * Install and configure global search services
        * Select global search version
            * 2.0.0
            * 2.0.1
            * 2.0.2
        * Specify http elasticsearch path, like http://elasticsearch-public-ip:9200
        * Specify the path to the creatio application, like http://mysite.creatio.com
        * Select creatio DB type like 
            * postgres
                * login
                * password
                * server
                * dbname
                * port
            * mssql
                * login
                * password
                * server
                * dbname
                * port
            * oracle
                * Specify connection string
        * Would you like to automatically configure features and system settings in creatio?
            * yes
            * no
    * Get a link to detailed installation documentation
* Check global search settings (need run on "second" server with globalsearch services)
* Supporting
    * Make logs of the docker containers
* Change global search template 
    * Select searching template
        * default.json
        * ngram_2.json
        * ngram_3.json
        * without_ngram.json
