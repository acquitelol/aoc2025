DAY ?= 01
INPUT ?= sample.txt

default: day

all:
	@$(foreach file, $(shell find solutions -mindepth 1 -type d -exec basename {} \; | sort -n), \
		echo "Day $(file)"; \
	    make day DAY=$(file); \
	)

day: solutions/$(DAY)/solution
	@solutions/$(DAY)/solution solutions/$(DAY)/$(INPUT)

solutions/$(DAY)/solution: solutions/$(DAY)/solution.le
	@ellec solutions/$(DAY)/solution.le -o solutions/$(DAY)/solution -z -O3 --silent -r

time:
	hyperfine --warmup 100 'solutions/$(DAY)/solution solutions/$(DAY)/input.txt' -i -N

.PHONY: clean
clean:
	rm -f $(DAY)/solution