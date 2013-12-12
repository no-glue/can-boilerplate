#cd `dirname $0`

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

node -e "require('grunt').cli({ base:'./', gruntfile:'gruntfiles/compile.js' })"