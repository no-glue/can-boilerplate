cd "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

node -e "require('grunt').cli({ base:'./', gruntfile:'gruntfiles/minify-media.js' })"