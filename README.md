# PushEngage-App1

## Assumptions:
1.  Mongo Shard server is running on localhost on port 27017 with no security (for simplicity).
2.  Application uses PM2 as its process manager. So PM2 is required to run it.
3.  Browser sends "notification_id", "site_id" and "subscriber_id" every time it wants the backend to record the views/clicks data.

**Basic PM2 commands:**
```$xslt
pm2 start ecosystem.config.js --env staging // start the application in staging mode (give --env production to run in production mode)
pm2 list // list all the running applications
pm2 stop PushEngage-app1 // to stop the application
pm2 kill // to kill all the running applications
pm2 logs // to tail and follow logs on to the terminal
```

***This application runs in cluster mode with:***
1.  Automatic re-spawning of dead workers.
2.  Graceful restarts and shutdowns.
3.  Communication between master and workers.
4.  In staging mode only 3 workers will be spawned.
5.  In production mode number of workers spawned = number of available logical CPUs.

Basic API versioning is also done.

## Postman collection link:
https://www.getpostman.com/collections/d0755b9b8b223df45508

All the API are self explanatory
**Code is also documented to ease the understanding**


## DB DESIGN:

Main collection is: "NotificationViewClickHistory" which stores the notification views and clicks data sent from the browser
Sample document:
```$xslt
{
	"_id" : ObjectId("5de2604177e368ac7113a443"), // id of the document
	"notification_id" : ObjectId("5349b4ddd2781d08c09890f8"),
	"site_id" : ObjectId("5349b4ddd2781d08c09890f5"),
	"subscriber_id" : ObjectId("5349b4ddd2781d08c09890f4"),
	"viewed_on" : ISODate("2019-11-30T12:27:45.187Z"), // date-time at which "notification view" api was called
	"clicked_on" : ISODate("2019-11-30T12:38:49.785Z") // date-time at which "notification click" api was called
}
```

Indexes are:
```$xslt
1.  {"notification_id" : 1,"subscriber_id" : 1} //compound index
2.  {site_id: 1}
```

__why this index {"notification_id" : 1,"subscriber_id" : 1}:__ 
-   This index is made so that the document can be updated as fast as possible when a view or click api is hit.
-   And fetching data from notification id will also use this index


__why this index {site_id: 1}:__ 
-   This index is made to fetch data by site id because frontend asks for site view/clicks


This collection needs to be sharded to handle heavy load.
-   We will use __Ranged Sharding__ to shard this collection.
-   __Shard key should be {"notification_id" : 1,"subscriber_id" : 1}__ because:
    -   Different subscriber_id on the same notification_id will distribute my write requests among multiple shards.
    -   Since data of one notification or one site is kept on multiple shards, read request can be run parallelly on multiple shards in order to fulfil a query and result can be merged back on the Mongo shard server. 
