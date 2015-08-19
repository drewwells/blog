server:
	hugo server -w -t slim --buildDrafts --config=config.toml
sync:
	git submodule update --init --recursive
