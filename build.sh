#!/bin/sh

########################################################################################################## config: paths

CSS_SRC=./assets/stylesheets
CSS_DST=./public/stylesheets
JS_SRC=./assets/javascripts
JS_DST=./public/javascripts

############################################################################################### init: clear output paths

echo "Deleting old assets..."

rm $CSS_DST/*.*
rm $JS_DST/*.*

############################################################################################################### Generics

echo "Creating new base assets..."

stylus -I $CSS_SRC < $CSS_SRC/base.styl > $CSS_DST/base.css
if [ $1 == "production" ]; then
  stylus -c -I $CSS_SRC < $CSS_SRC/base.styl > $CSS_DST/base.min.css
fi

stylus -I $CSS_SRC < $CSS_SRC/plugins.styl > $CSS_DST/plugins.css
if [ $1 == "production" ]; then
  stylus -c -I $CSS_SRC < $CSS_SRC/plugins.styl > $CSS_DST/plugins.min.css
fi

cat $JS_SRC/lib/nivoslider.js \
    $JS_SRC/lib/fancybox.js \
    $JS_SRC/lib/jquery.cookie.js \
    $JS_SRC/website.js \
    $JS_SRC/google.analytics.js \
  > $JS_DST/website.js

if [ $1 == "production" ]; then
  uglifyjs $JS_DST/website.js -o $JS_DST/website.min.js
fi

############################################################################################################ page: index

echo "Creating new css for index page..."

stylus -I $CSS_SRC < $CSS_SRC/index.styl > $CSS_DST/index.css

if [ $1 == "production" ]; then
  stylus -c -I $CSS_SRC < $CSS_SRC/index.styl > $CSS_DST/index.min.css
fi

######################################################################################################## page: portfolio

echo "Creating new css for portfolio page..."

stylus -I $CSS_SRC < $CSS_SRC/portfolio.styl > $CSS_DST/portfolio.css

if [ $1 == "production" ]; then
  stylus -c -I $CSS_SRC < $CSS_SRC/portfolio.styl > $CSS_DST/portfolio.min.css
fi

########################################################################################################## page: project

echo "Creating new css for project page..."

stylus -I $CSS_SRC < $CSS_SRC/project.styl > $CSS_DST/project.css

if [ $1 == "production" ]; then
  stylus -c -I $CSS_SRC < $CSS_SRC/project.styl > $CSS_DST/project.min.css
fi

########################################################################################################## page: contact

echo "Creating new css for contact page..."

stylus -I $CSS_SRC < $CSS_SRC/contact.styl > $CSS_DST/contact.css

if [ $1 == "production" ]; then
  stylus -c -I $CSS_SRC < $CSS_SRC/contact.styl > $CSS_DST/contact.min.css
fi

############################################################################################################## page: 404

echo "Creating new css for error page..."

stylus -I $CSS_SRC < $CSS_SRC/error.styl > $CSS_DST/error.css

if [ $1 == "production" ]; then
  stylus -c -I $CSS_SRC < $CSS_SRC/error.styl > $CSS_DST/error.min.css
fi

############################################################################################################ page: admin

echo "Creating new assets for admin page..."

stylus -I $CSS_SRC < $CSS_SRC/admin.styl > $CSS_DST/admin.css
if [ $1 == "production" ]; then
  stylus -c -I $CSS_SRC < $CSS_SRC/admin.styl > $CSS_DST/admin.min.css
fi

cat $JS_SRC/lib/underscore.js \
    $JS_SRC/lib/backbone.js \
    $JS_SRC/lib/deep-model.js \
    $JS_SRC/admin/init.js \
    $JS_SRC/admin/model/* \
    $JS_SRC/admin/collection/* \
    $JS_SRC/admin/view/* \
    $JS_SRC/admin/start.js \
  > $JS_DST/admin.js

if [ $1 == "production" ]; then
  uglifyjs $JS_DST/admin.js -o $JS_DST/admin.min.js
fi

############################################################################################################## IE Tweaks

echo "Creating IE tweaks assets..."

stylus -I $CSS_SRC < $CSS_SRC/includes/ie-sucks.styl > $CSS_DST/ie-sucks.css
stylus -I $CSS_SRC < $CSS_SRC/includes/ie-8-sucks.styl > $CSS_DST/ie-8-sucks.css
stylus -I $CSS_SRC < $CSS_SRC/unsupported.styl > $CSS_DST/unsupported.css

cp $JS_SRC/lib/html5shiv.js $JS_DST
