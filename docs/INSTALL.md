# INSTALLATION

This file describes how to
install `the-new-ZOMBS.io`.

## Clone the repo
You need a copy of the
repository to be able to
run it. As it uses `git`,
you need it installed. If
it isn't, [check this](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).
Then you can clone it
by executing the following
command in a terminal:
`git clone https://github.com/Jiankun-Huang/the-new-ZOMBS.io.git`.
Then enter the created directory
using `cd the-new-ZOMBS.io`.

## Install dependencies
This project uses Yarn as
package manager. If you don't
have it installed, [check this](https://yarnpkg.com/lang/en/docs/install/).

To install dependencies, you
need to execute the following
command in a terminal:
`yarn install`

## Configure
You need to configure some files
before being able to run it. First,
make a `.env` file in the project
root with the following content:
```sh
APP_NAME="ZOMBZ.io"
```
Also, check `src/server/config.yml`
and change properties as you wish.

## Run it
Once cloning the repo and
installing dependencies is
done, you can finally run
it. You can achieve this by
using the following command
in a terminal: `yarn run client`.
This will start a `webpack-dev-server`
process, which you can stop
by pressing `Ctrl+C` in the
current terminal.
You will also need another
terminal in order to run
server. Execute `yarn run server`
in it. It will start a
`nodemon` process, which
you can also exit by using
`Ctrl+C`.
