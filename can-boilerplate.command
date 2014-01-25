cd "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd vendors

node -e "require('grunt').cli({ base:'./', gruntfile:'gruntfiles/Gruntfile.js' })"