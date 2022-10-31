#! /usr/bin/env python3

import os
import sys
import argparse
from operator import attrgetter
from collections import Counter
from heapq import heappush, heappushpop
from itertools import dropwhile

if __name__ == "__main__":
    parser = argparse.ArgumentParser(prog = 'bha', description='Bash history analyzer', epilog='By default, bha spits out the top 10 command names, the top 10 full commands, and the 10 shortest commands used from your ~/.bash_history')
    parser.add_argument('history_path', nargs='?', default=os.path.join("", os.path.expanduser(
        "~"), ".bash_history"), type=str, help="Specify bash history path. By default, this is ~/.bash_history.")
    parser.add_argument('-n', '--names', action='store', metavar='N', help='Generate top N command names', type=int)
    parser.add_argument('-fc', '--full_commands', metavar='N', action='store',
                        help='Generate top N command names', type=int)
    parser.add_argument('--first_k_keywords', metavar=('N', 'K'), action='store', nargs=2, type=int, help='Generate top N commands with keyword length = K')
    parser.add_argument('--shortest', metavar='N', action='store', type=int, help='Generate top N unique shortest commands')
    parser.add_argument('--longest', metavar='N', action='store',
                        type=int, help='Generate top N unique longest commands')
    parser.add_argument('-v', '--verbose_length', metavar='L', action='store',
                        type=int, help='Truncate command prints to L letters')

    args = parser.parse_args(sys.argv[1:])

    first_k_keywords, names, full_commands, shortest, longest, verbose_length, history_path = attrgetter(
        'first_k_keywords', 'names', 'full_commands', 'shortest', 'longest', 'verbose_length', 'history_path')(args)

    if (first_k_keywords, names, full_commands, shortest, longest) == (None, None, None, None, None): 
        names = 10 
        full_commands = 10 
        shortest = 10 
        first_k_keywords = [10, 2]
    
    if not verbose_length: 
        verbose_length = 20

    def nonEmpty(str: str) -> bool:
        return len(str) > 0

    def isSegmentEnvVar(segment: str):
        return '=' in segment

    def isSegmentDate(segment: str):
        return len(segment) > 0 and segment[0].isnumeric()

    raw_history = open(history_path, 'r', errors='ignore').read().splitlines()
    # remove blank lines and dates and env varibales
    history = list(map(lambda row: ' '.join(
        dropwhile(lambda segment: isSegmentDate(segment) or isSegmentEnvVar(segment), row.split())), raw_history
        ))
    history = list(filter(nonEmpty, history))

    def top_n_full_command(n: int):
        return Counter(history).most_common(n)

    def top_n_command_name(n: int):
        command_names = map(lambda row: row.split(" ")[0], history)
        return Counter(command_names).most_common(n)

    def top_n_k_keyword(n: int, k: int):
        keywords_list = [' '.join(row.split()[:k])
                          for row in history if len(row.split()) == k]
        return Counter(keywords_list).most_common(n)

    def top_k_unique_shortest(k: int):
        # Implementation: I use max heap to select top n shortest
        # This makes algo O(n log k)
        lengths_and_commands = set([(len(row), row) for row in history])
        pq = [] 
        for (length, command) in lengths_and_commands: 
            if len(pq) < k: 
                heappush(pq, (-length, command)) # (-) to make heappush a max-heap push
            else: 
                heappushpop(pq, (-length, command))
        normalized = [(-length, command) for length, command in pq]
        return sorted(normalized)
    
    def top_k_unique_longest(k: int):
        # Implementation: I use min heap to select top n longest
        # This makes algo O(n log k)
        lengths_and_commands = set([(len(row), row) for row in history])
        pq = []
        for item in lengths_and_commands:
            if len(pq) < k:
                heappush(pq, item) # python heappush is a min-heap push
            else:
                # briefly exceed pq's limits with one extra element 
                # then, pop the smallest
                heappushpop(pq, item)
        # Note that pq is a BST, so pq itself is not close to but not fully sorted
        # So, I issue a sorted
        return sorted(pq, reverse=True)

    def truncateTo(string: str, toLength: int) -> str: 
        if len(string) <= toLength:  
            return string
        return string[:toLength] + '...'
    
    if names and names > 0: 
        print(f"{names} most used command names and their frequencies:")
        print(' | '.join([f'{truncateTo(name, verbose_length)} : {count}' for (name, count) in top_n_command_name(names)]))
        print()

    if first_k_keywords and first_k_keywords: 
        n, k = first_k_keywords
        print(f"{n} most used commands with {k} words and their frequencies")
        print(' | '.join([f'{truncateTo(command, verbose_length)} : {count}' for (command, count) in top_n_k_keyword(n, k)]))
        print()

    if full_commands and full_commands > 0: 
        print(f"{full_commands} most used full commands and their frequencies:")
        print(' | '.join([f'{truncateTo(name, verbose_length)} : {count}' for (
            name, count) in top_n_full_command(full_commands)]))
        print()

    if shortest and shortest > 0: 
        print(f"{shortest} shortest commands used and their lengths:")
        print(' | '.join([f'{truncateTo(name, verbose_length)} : {length}' for (
            length, name) in top_k_unique_shortest(shortest)]))
        print()

    if longest and longest > 0: 
        print(f"{longest} longest commands used and their lengths:")
        print(' | '.join([f'{truncateTo(name, verbose_length)} : {length}' for (
            length, name) in top_k_unique_longest(longest)]))
        print()