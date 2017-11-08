GAUGE_FILE_NAME="gauge-js-2.0.3.nightly-2017-11-07.zip"

GAUGE_DOWNLOAD_URL="https://bintray.com/gauge/gauge-js/download_file?file_path=$GAUGE_FILE_NAME"

wget -O $GAUGE_FILE_NAME $GAUGE_DOWNLOAD_URL

gauge install js -f ./$GAUGE_FILE_NAME