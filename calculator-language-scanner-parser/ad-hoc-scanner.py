# assign −> :=
# plus −> +
# minus -> -
# times -> *
# div -> /
# lparen -> (
# rparen -> )
# id -> letter ( letter | digit )* # except for read and write
# number -> digit digit * | digit * ( . digit | digit . ) digit *
# comment -> /* ( non-* | * non-/ )* *+ /
# comment -> // ( non-newline )* newline

"""
I extracted out the stream function for fun. 

I suppose a reason to do this, is that, scanner sounds like an object
that just receives letters. 
"""


import sys

token_map = {"(": "left paren", ")": "right paren", "+": "plus", "/": "div", "*": "mult", ":=": "assign"}

def scanner(file_name: str):
    file = open(file_name, mode="r", encoding="utf8")
    characters = file.read()
    i = 0
    while i < len(characters):
        letter = characters[i]
        if letter in [" ", "\t", "\n"]:
            i += 1
            continue
        elif letter in ["(", ")", "+", "-", "*"]:
            yield token_map[
                letter
            ]  # TODO: Does yield also continue from current while?
        elif letter == ":":
            next_char = characters[i+1] if i+1 < len(characters) else ''
            if next_char == '=': 
                yield token_map[':=']
                i+=2 
                continue
            else: raise Exception
        elif letter == '/': 
            next_char = characters[i+1] if i+1 < len(characters) else ''
            if next_char == '*':
                # read until you get to */
                i += 2
                while i < len(characters):
                    if characters[i-1:i+1] == "*/": 
                        break
                    i += 1
            elif next_char == '/':
                # read until we get to newline
                i += 1
                while i < len(characters):
                    if characters[i] == '\n': 
                        break 
                    i += 1
                pass
            else: 
                yield token_map['/']
        elif letter == '.':
            # read next char
            # if digit, read any additional digits, return number 
            # else error 
            pass 
        elif letter.isdigit(): 
            # read additional digits and at most one decimal point
            i += 1 
            noDecimalYet = True
            while i < len(characters):
                if characters[i].isdigit(): 
                    i+=1 
                elif characters[i] == '.': 
                    if noDecimalYet: 
                        i+=1
                        noDecimalYet = False
                    else: raise Exception
                else: 
                    yield "digit"
                    break 
            continue
        elif letter.isalpha():
            start = i
            i += 1
            # read any additional letters and digits
            while i < len(characters) and (characters[i].isdigit() or characters[i].isalpha()):
                i+=1 
            # if "read" or "write", return them, else return "id"
            if characters[start:i] in ["read", "write"]:
                yield characters[start:i]
            else: 
                yield "id"
            
        else: 
            print(letter, "Context: ", characters[i-5:i+5])
            raise Exception
        
        i += 1
    file.close()

if __name__ == "__main__":
    if len(sys.argv) < 1:
        print("Must supply a calculator code file!")
        exit(1)

    res = scanner(sys.argv[1])
    print(list(res))
