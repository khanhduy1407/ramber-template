#!/bin/bash
cd "$(dirname "$0")"

if [ "$CI" ]; then
	(umask 0077; echo "$SSH_KEY" > ~/ssh_key; echo "$SSH_KEY_ROLLUP" > ~/ssh_key_rollup; echo "$SSH_KEY_WEBPACK" > ~/ssh_key_webpack)
	git config user.email 'kn145660@gmail.com'
	git config user.name 'khanhduy1407'
fi

# branch names
ROLLUP=rollup
WEBPACK=webpack

./create-branches.sh $ROLLUP $WEBPACK

# force push rollup and webpack branches and repos
GIT_SSH_COMMAND='ssh -o StrictHostKeyChecking=accept-new -i ~/ssh_key' git push git@github.com:hamberjs/ramber-template.git $ROLLUP $WEBPACK -f
GIT_SSH_COMMAND='ssh -o StrictHostKeyChecking=accept-new -i ~/ssh_key_rollup' git push git@github.com:hamberjs/ramber-template-rollup.git $ROLLUP:master -f
GIT_SSH_COMMAND='ssh -o StrictHostKeyChecking=accept-new -i ~/ssh_key_webpack' git push git@github.com:hamberjs/ramber-template-webpack.git $WEBPACK:master -f
