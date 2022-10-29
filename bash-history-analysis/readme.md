# Bash History Analyzer
What are your most used commands, the longest commands you have written...? Run the bash history analyzer to find out. Only works if you have a `~/.bash_history`, so, sorry, windows folks.

Here's the accompanying [blog post](https://unfooling.com/analyzing-my-11k-bash-commands/).

### Example input and output
Input: `python3 bha.py -n 10 --first_k_keywords 10 2`

Output: 
```
15 most used command names and their frequencies:
cd : 1522 | ls : 1446 | npm : 725 | sudo : 684 | python3 : 588 | git : 513 | cb-dev-kit : 449 | cb-cli : 444 | code : 396 | node : 296 | cat : 244 | gcc : 213 | stack : 173 | rm : 115 | curl : 105

10 most used commands with 2 words and their frequencies
cd .. : 324 | code . : 142 | npm start : 74 | cd packages/server/ : 71 | ls -R : 44 | cb-cli init : 43 | cd ../.. : 42 | stack build : 39 | cb-dev-kit generate : 38 | git push : 37
```

Run `python3 bha.py -h` to find out more options.

### Requirements
python >= 3.8.10 works perfectly. I think you would need at least python 3.2

