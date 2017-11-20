GAUGE_JS_LATEST_NIGHTLY=`curl -w "%{url_effective}\n" -L -s -S https://bintray.com/gauge/gauge-js/Nightly/_latestVersion -o /dev/null`

GAUGE_JS_LATEST_NIGHTLY_VERSION=`echo $GAUGE_JS_LATEST_NIGHTLY | sed 's/.*\///'`

GAUGE_FILE_NAME="gauge-js-$GAUGE_JS_LATEST_NIGHTLY_VERSION.zip"

GAUGE_DOWNLOAD_URL="https://bintray.com/gauge/gauge-js/download_file?file_path=$GAUGE_FILE_NAME"

wget -O $GAUGE_FILE_NAME $GAUGE_DOWNLOAD_URL

gauge install js -f ./$GAUGE_FILE_NAME
