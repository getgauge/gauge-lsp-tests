GAUGE_FILE_NAME="gauge-js-2.0.3.nightly-2017-11-07.zip"

GAUGE_DOWNLOAD_URL="https://bintray.com/gauge/gauge-js/download_file?file_path=$GAUGE_FILE_NAME"

wget -O jsnightly.zip $GAUGE_DOWNLOAD_URL

/bin/bash gauge install js -f ./jsnightly.zip