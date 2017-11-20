$gauge_latest_nightly_version=Invoke-WebRequest -Uri https://bintray.com/gauge/gauge-js/Nightly/_latestVersion -MaximumRedirection 0 -ErrorAction Ignore -UseBasicParsing | %{$_.Headers.Location} | Split-Path -Leaf

GAUGE_FILE_NAME="gauge-js-$($gauge_latest_nightly_version).zip"

GAUGE_DOWNLOAD_URL="https://bintray.com/gauge/gauge-js/download_file?file_path=$GAUGE_FILE_NAME"

wget -O $GAUGE_FILE_NAME $GAUGE_DOWNLOAD_URL

gauge install js -f ./$GAUGE_FILE_NAME
