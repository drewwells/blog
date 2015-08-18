server:
	hugo server -t slim --buildDrafts --config=config.toml
sync:
	git submodules update --init --recursive
