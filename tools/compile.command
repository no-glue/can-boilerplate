cd "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

node -e "require('grunt').cli({ base:'./', gruntfile:'gruntfiles/compile.js' })"