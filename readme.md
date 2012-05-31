# [interiordelight.ro](http://www.interiordelight.ro)
…or **how to build a simple portfolio website** in Node.js using:
- [express](http://expressjs.com) web application framework;
- [jade](http://jade-lang.com/) html template engine;
- [stylus](http://learnboost.github.com/stylus/) css templates;
- [MongoDB](http://www.mongodb.org/) NoSQL database with [mongojs](https://github.com/gett/mongojs) module for simple data access and [connect-mongo](https://github.com/kcbanner/connect-mongo) for session storage;
- [Passport](http://passportjs.org/) authentication with [Passport-Google](https://github.com/jaredhanson/passport-google) strategy for the administration console;
- [async](https://github.com/caolan/async) module for asynchronous calls to MongoDB where necessary;
- [markdown-js](https://github.com/evilstreak/markdown-js) to process text;
- [jQuery](http://jquery.com/) and DocumentCloud's [Backbone](http://documentcloud.github.com/backbone/) framework for client-side programming;
- the excellent [NivoSlider](http://nivo.dev7studios.com/) and [FancyBox](http://fancyapps.com/fancybox/) jQuery plugins.

## Tools and environments used:
- [Sublime Text 2](http://www.sublimetext.com/2) editor on Mac OS X for writing code, [UglifyJS](https://github.com/mishoo/UglifyJS) to compress client-side js and [Stylus executable](http://learnboost.github.com/stylus/docs/executable.html) to generate css at build stage;
- [Heroku](http://www.heroku.com/) platform for application hosting, with [MongoLab](https://addons.heroku.com/mongolab) add-on for data storage and [Zerigo](https://addons.heroku.com/zerigo_dns) for painless DNS management.

## The gist
I needed a simple, clean, cheap-to-maintain yet easily extendable portfolio website to present the artist's interior design & 3D rendering related work. None of the PHP Wordpress-based solutions that we studied satisfied us, plus the website had to be multilingual \(English and Romanian to start with\) and the CMS modules offering multilingual support were way too heavy for what we needed. So, instead of choosing the route of using Wordpress/Joomla or other CMS out there and do lots of boring configuration work, I decided to build it "from scratch" as lightweight as possible in a new \(for me\) set of technologies.

Since most of the amazing work is presented as pictures, it made sense to use Google Picasa as a storage engine and to build a dead-simple administration tool to fetch the image details from Picasa and just insert their URLs and some basic meta-data into the website content \(basically the front-page gallery and the projects' descriptions\).

## The admin tool
The admin tool needed to to stay out of the way as much as possible so we decided to favor the idea of "convention-over-configuration" in the user workflow:
- **gallery album name**: the front page gallery feeds from the album named *[gallery] …*;
- **project naming**: the albums are fetched from Picasa based on the English project name; i.e. a project entitled *Cozy guesthouse* will get its pictures from the album *[project] Cozy guesthouse*;
- **project cover picture**: the first picture in the album is used;
- **multilingual picture caption**: each picture in Picasa can have a caption in the form *\[en\] description \[ro\] descriere*; the corresponding title is displayed in the website gallery depending on the selected language;
- **project description** is entered using [Markdown](http://daringfireball.net/projects/markdown/syntax) syntax, plus 2 optional custom tags:
	- \[end intro\] to indicate where the description intro ends \(useful for the project showing on the front page in *Latest Work* section\);
	- \[*n* pictures\] to insert a group of pictures at some point in the description \(by default all pictures are inserted at the end\).
A very simple authentication mechanism was necessary for the admin section and since Picasa is used as image repository it made sense to use Google with OpenID 2.0.

So in the end I came up with something that looks like this:
![Admin tool](https://lh5.googleusercontent.com/-6-DzIqXme1c/T8cto5ryNEI/AAAAAAAAGEg/fw6CBwqF5N0/s867/admin.png "Admin tool")

## REST
The admin tool communicates with the server through a small API that is not strictly REST specs compliant (i.e. it's using session-based authentication).

## Web asset compression/minification
This is performed with stylus and uglify-js during the "build stage"; there are 2 custom-configured "build systems" in my Sublime Text \(dev/prod\) that are calling build.sh  in the project root. Although there's a connect-based middleware to deal with Stylus-\>CSS conversion, I wanted to be able to have the assets in both readable and minified/compressed form and use them depending on NODE_ENV=development/production, and I found this to be the easiest way to do it.

## Picasa features
Here are some undocumented features I discovered playing around with [Picasa Data API](https://developers.google.com/picasa-web/docs/2.0/developers_guide_protocol):
- Each picture hosted on Picasa can be accessed through a direct URL of the form *http://lh6.ggpht.com/path\_prefix/**s1024**/file\_name.png*, where *s1024* is the width; the first time a picture is requested a version scaled exactly to the specified width is generated; subsequent requests to the same width are served from cache;
- Issuing a request to *http://lh6.ggpht.com/path\_prefix/**s100-c**/file\_name.png* will return a rectangular, center-cropped version of the image \(that's how the thumbnails are generated on our website\).

## Picasa challenges
The initial plan was to fetch & process the albums & picture info on the server-side, but it turned out there's no way of convincing their servers to give you the content up-to-date; you only get a cached snapshot \(which is, of course, understandable\). So practically this means your server won't know about changes/updates performed in the last few minutes, which is totally unpractical for an admin tool. The only circumstance when you do get live data is when you're the owner of the album\(s\) and the request is made from an authenticated browser session. Hence the solution to fetch the albums on the client-side…

## Final note
Building [interiordelight.ro](http://www.interiordelight.ro) with Node.js was overall a fun and interesting experience.
There's an impressive Javascript community and a huge code-base available out there \(actually [more than 20% of the projects on GitHub are written in it](https://github.com/languages)\), so if you need a particular module / piece of functionality in your project, chances are that somebody already built it, so you won't have to reinvent the wheel…

If you're new to Node.js and want to see a practical example of how to build a small project, I hope the source code available here will prove to be of assistance, so feel free to have a look at it. Be advised, though - although this project is a working website, it is after all **a small project** and it's missing features and/or not using design patterns that would be crucial for a heavy-load application.

This is still work-in-progress, not all code is well documented or explicit, so any suggestions would be more than welcome.
Thanks!
