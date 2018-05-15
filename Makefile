server:
	hugo server -w -t slim --buildDrafts --config=config.toml
sync:
	git submodule update --init --recursive
build:
	hugo -t slim --config=config.toml
deploy: rsync

rsync: build
	rsync -avz --delete public/* do:~/blog
