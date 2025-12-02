DAY ?= 01
INPUT ?= sample.txt

all:
	@$(foreach file, $(shell find solutions -mindepth 1 -type d -exec basename {} \; | sort -n), \
		echo "Day $(file)"; \
	    make day DAY=$(file); \
	)

day: solutions/$(DAY)/solution
	@solutions/$(DAY)/solution solutions/$(DAY)/$(INPUT)

solutions/$(DAY)/solution: solutions/$(DAY)/solution.le
	@ellec solutions/$(DAY)/solution.le -o solutions/$(DAY)/solution -z -O3

time:
	hyperfine --warmup 3 'solutions/$(DAY)/solution solutions/$(DAY)/input.txt' -i

.PHONY: clean
clean:
	rm -f $(DAY)/solution