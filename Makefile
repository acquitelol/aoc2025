DAY ?= 01
INPUT ?= sample.txt

all:
	@$(foreach file, $(shell find . -mindepth 1 -type d -exec basename {} \; | sort -n), \
		echo "Day $(file)"; \
	    make day DAY=$(file); \
	)

day: $(DAY)/solution
	@./$(DAY)/solution $(DAY)/$(INPUT)

$(DAY)/solution: $(DAY)/solution.le
	@ellec $(DAY)/solution.le -o $(DAY)/solution -z -O3

time:
	hyperfine --warmup 3 './$(DAY)/solution ./$(DAY)/input.txt' 'pypy3 $(DAY)/solution.py $(DAY)/input.txt'

.PHONY: clean
clean:
	rm -f $(DAY)/solution