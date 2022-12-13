/* calculator grammar scanner specification */

/*definitions*/
assign :=
plus "+"
minus -
times "*"
div "/"
lparen "("
rparen ")" 
letter [a-zA-Z]
digit [0-9]
id {letter}({letter}|{digit})*
number ({digit}{digit}*)|({digit}*(\.{digit}|{digit}\.){digit}*)
comment "/*"((("*"[^/])?)|[^*])*"*/"|"//".*

%%
{assign} {printf("assign");}
{plus} {printf("plus");}
{minus} {printf("minus");}
{times} {printf("times");}
{div} {printf("div");}
{lparen} {printf("lparen");}
{rparen} {printf("rparen");}
{letter} {printf("letter");}
{digit} {printf("digit");}
{id}        printf( "identifier" );
{number}    printf( "number");
{comment}   printf(" ");
%%
int main( argc, argv )
int argc;
char **argv;
    {
    ++argv, --argc;  /* skip over program name */
    if ( argc > 0 )
            yyin = fopen( argv[0], "r" );
    else
            yyin = stdin;

    yylex();
    }