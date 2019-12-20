NAME=xothebump/xo-thebumplayout-event-tracking-automation
VERSION=latest

test:
	npm test

install:
	@rm -rf ./node_modules
	npm install

docker-build:
	@docker build -t $(NAME) -f docker/Dockerfile .

docker-clean:
	docker ps -a -qf status=exited | xargs -I {} docker rm -v {}
	docker images -qf "dangling=true" | xargs -I {} docker rmi {}

run:docker-clean docker-build
	@docker-compose -f docker/docker-compose.yml run -e NODE_ENV=$(NODE_ENV) --rm nightmareTest

jenkins-nightmareTest:
	make docker-build
	docker-compose -f docker/docker-compose.yml run -e NODE_ENV=$(NODE_ENV) -e JOB_NAME=$(JOB_NAME) -e BUILD_NUMBER=$(BUILD_NUMBER) --rm nightmareTest

.PHONY: test test-prod install docker-build docker-clean jenkins-nightmareTest