# Plugin for esbuild

Use `c` preprocessor `cpp` for javascript or any files.


## Description

How to use in esbuild.config.js

```javascript
import * as esbuild from 'esbuild'
import { cppPlugin } from "./index.js"

await esbuild.build({
  entryPoints: ['test.input.js'],
  bundle: true,
  outfile: 'test.out.js',
  plugins: [cppPlugin(['DEBUG'])],
})
```

`cppPlugin` may accept optional parameter, array(string[]) of simple defined macros in code.  
This pass each word to `-D` option of `cpp`. In example above `'DEBUG'` is defined as `1`.


## Example of use

### Syntax improvements

```c
#define assert(x) if(!(x)) { throw new Error("Assertion failed: " + #x) }
```

Also, a `assert` macro can be `#ifdefed` away, so it can have no effect on production code.

### Inlining code

```c
#define ISCCW(P0, P1, P2) ((P1.x - P0.x) * (P2.y - P0.y) > (P2.x - P0.x) * (P1.y - P0.y))
```

### Reducing code size

```c
#ifdef DEBUG
     function LOG_OBJECT() { ... }
#endif // DEBUG
```

[Source: nongnu.org](https://www.nongnu.org/espresso/js-cpp.html) 

```c
#define repeat(x) for(let i = 0; i < x; i++)

function foo() {
  repeat(10) {
    console.log(i);
  }
}

/* Result */
function foo() {
  for(let i = 0; i < 10; i++) {
    console.log(i);
  }
}
```

[Source: stackoverflow.com](https://stackoverflow.com/questions/69845852/is-there-a-javascript-equivalent-to-c-preprocessor-macros#answer-70037342) 


## What is c preprocessor(cpp)

The C preprocessor, often known as cpp, is a macro processor that is used automatically by the C compiler to transform your program before compilation.  It is called a macro processor because it allows you to define macros, which are brief abbreviations for longer constructs.

### Include Syntax

`#include <file>`  
This variant is used for system header files. It searches for a file named file in
a standard list of system directories.

`#include "file"`  
This variant is used for header files of your own program. It searches for a file
named file first in the directory containing the current file, then in the quote
directories and then the same directories used for <file>. You can prepend
directories to the list of quote directories with the -iquote option.

There are a number of command-line options you can use to add additional directories to
the search path. The most commonly-used option is -Idir, which causes dir to be searched
after the current directory (for the quote form of the directive) and ahead of the standard
system directories. You can specify multiple -I options on the command line, in which case
the directories are searched in left-to-right order.

Note that you can also prevent the preprocessor from searching any of the default system
header directories with the -nostdinc option.

### Once-Only Headers

```c
/* File foo. */
#ifndef FILE_FOO_SEEN
#define FILE_FOO_SEEN
the entire file
#endif /* !FILE_FOO_SEEN */
```

The macro FILE_FOO_SEEN is called the controlling macro or guard macro.

### Computed Includes

Instead of writing a header name 
as the direct argument of ‘#include’, you simply put a macro name there instead:

```c
#define SYSTEM_H "system_1.h"
#include SYSTEM_H
```

`SYSTEM_H` will be expanded, and the preprocessor will look for system_1.h as if the
‘#include’ had been written that way originally. SYSTEM_H could be defined by your
Makefile with a `-D` option.

### Object-like Macros

```c
#define BUFFER_SIZE 1024

#define NUMBERS 1, \
        2, \
        3
int x[] = { NUMBERS };
    → int x[] = { 1, 2, 3 };

#define TABLESIZE BUFSIZE
#define BUFSIZE 1024
TABLESIZE
    → BUFSIZE
    → 1024

#define BUFSIZE 1020
#define TABLESIZE BUFSIZE
#undef BUFSIZE
#define BUFSIZE 37
```

### Function-like Macros

```c
#define lang_init() c_init()
lang_init()
    → c_init()
```

### Macro Arguments

```c
#define min(X, Y) ((X) < (Y) ? (X) : (Y))
x = min(a, b); → x = ((a) < (b) ? (a) : (b));
y = min(1, 2); → y = ((1) < (2) ? (1) : (2));
z = min(a + 28, *p); → z = ((a + 28) < (*p) ? (a + 28) : (*p));
```

You can leave macro arguments empty. ou cannot leave out arguments entirely;
if a macro takes two arguments, there must be exactly one comma at the top level of its
argument list.

```c
min(, b) → (( ) < (b) ? ( ) : (b))
min(a, ) → ((a ) < ( ) ? (a ) : ( ))
min(,) → (( ) < ( ) ? ( ) : ( ))
min((,),) → (((,)) < ( ) ? ((,)) : ( ))
min() error macro "min" requires 2 arguments, but only 1 given
min(,,) error macro "min" passed 3 arguments, but takes just 2
```

Macro parameters appearing inside string literals are not replaced by their corresponding
actual arguments.

```c
#define foo(x) x, "x"
foo(bar) → bar, "x"
```

### Stringizing

When a macro parameter is used with a leading ‘#’, the preprocessor replaces it
with the literal text of the actual argument, converted to a string constant.

```c
#define WARN_IF(EXP) \
do { if (EXP) \
    fprintf (stderr, "Warning: " #EXP "\n"); } \
while (0)
WARN_IF (x == 0);
    → do { if (x == 0)
        fprintf (stderr, "Warning: " "x == 0" "\n"); } while (0);
```

All leading and trailing whitespace in text being stringized is ignored. Any sequence of
whitespace in the middle of the text is converted to a single space in the stringized result.

If you want to stringize the result of expansion of a macro argument, you have to use
two levels of macros.

```c
#define xstr(s) str(s)
#define str(s) #s
#define foo 4
str (foo)
    → "foo"
xstr (foo)
    → xstr (4)
    → str (4)
    → "4"
```

### Concatenation

It is often useful to merge two tokens into one while expanding macros. This is called token
pasting or token concatenation. The ‘##’ preprocessing operator performs token pasting.
When a macro is expanded, the two tokens on either side of each ‘##’ operator are combined
into a single token, which then replaces the ‘##’ and the two original tokens in the macro
expansion.

```c
struct command
{
    char *name;
    void (*function) (void);
};
struct command commands[] =
{
    { "quit", quit_command },
    { "help", help_command },
};

define COMMAND(NAME) { #NAME, NAME ## _command }
struct command commands[] =
{
    COMMAND (quit),
    COMMAND (help),
};
```

### Variadic Macros

```c
#define eprintf(...) fprintf (stderr, __VA_ARGS__)
```

This kind of macro is called variadic. When the macro is invoked, all the tokens in its
argument list after the last named argument (this macro has none), including any commas,
become the variable argument. This sequence of tokens replaces the identifier __VA_ARGS__
in the macro body wherever it appears.

```c
eprintf ("%s:%d: ", input_file, lineno)
    → fprintf (stderr, "%s:%d: ", input_file, lineno)
```

You can have named arguments as well as variable arguments in a variadic macro. We
could define eprintf like this, instead:

```c
#define eprintf(format, ...) fprintf (stderr, format, __VA_ARGS__)
```

### Predefined Macros

__FILE__ and __LINE__ are useful in generating an error message to report an in-
consistency detected by the program; the message can state the source line at which the
inconsistency was detected. For example,

```c
fprintf (stderr, "Internal error: "
            "negative string length "
            "%d at %s, line %d.",
        length, __FILE__, __LINE__);
```

__DATE__, __TIME__  

### Common Predefined Macros

The common predefined macros are GNU C extensions.

`__COUNTER__`  
This macro expands to sequential integral values starting from 0. In conjunction
with the ## operator, this provides a convenient means to generate unique iden-
tifiers.

__BASE_FILE__, __FILE_NAME__

`__TIMESTAMP__`  
This macro expands to a string constant that describes the date and time of
the last modification of the current source file.

### Undefining and Redefining Macros

```c
#define FOO 4
x = FOO; → x = 4;
#undef FOO
x = FOO; → x = FOO;
```

### Misnesting

When a macro is called with arguments, the arguments are substituted into the macro body
and the result is checked, together with the rest of the input file, for more macro calls. It is
possible to piece together a macro call coming partially from the macro body and partially
from the arguments.

```c
#define twice(x) (2*(x))
#define call_with_1(x) x(1)
call_with_1 (twice)
    → twice(1)
    → (2*(1))
```

Macro definitions do not have to have balanced parentheses. By writing an unbalanced
open parenthesis in a macro body, it is possible to create a macro call that begins inside
the macro body but ends outside of it.

```c
#define strange(file) fprintf (file, "%s %d",
...
strange(stderr) p, 35)
    → fprintf (stderr, "%s %d", p, 35)
```

### Conditional Syntax

A conditional in the C preprocessor begins with a conditional directive: ‘#if’, ‘#ifdef’ or
‘#ifndef’.

#### Ifdef

```c
#ifdef MACRO
controlled text
#endif /* MACRO */
```

Sometimes you wish to use some code if a macro is not defined. You can do this by
writing ‘#ifndef’ instead of ‘#ifdef’.

#### If

The ‘#if’ directive allows you to test the value of an arithmetic expression.
If the value comes out to be nonzero, the ‘#if’ succeeds and the controlled text is included; otherwise it is skipped.

```c
#if expression
controlled text
#endif /* expression */
```

#### Else

```c
#if expression
text-if-true
#else /* Not expression */
text-if-false
#endif /* Not expression */
```

#### Elif

```c
#if X == 1
...
#elif X == 2
...
#else /* X != 2 and X != 1*/
...
#endif /* X != 2 and X != 1*/
```

### Deleted Code

Use an always-false conditional. Put #if 0 before the deleted code and #endif after it.

### Diagnostics

The directive ‘#error’ causes the preprocessor to report a fatal error. The tokens forming
the rest of the line following ‘#error’ are used as the error message.  
You would use ‘#error’ inside of a conditional that detects a combination of parameters
which you know the program does not properly support.

If you have several configuration parameters that must be set up by the installation in
a consistent way, you can use conditionals to detect an inconsistency and report it with
‘#error’. For example,

```c
#if !defined(FOO) && defined(BAR)
#error "BAR requires FOO."
#endif
```

The directive ‘#warning’ is like ‘#error’, but causes the preprocessor to issue a warn-
ing and continue preprocessing. The tokens following ‘#warning’ are used as the warning
message.

[Source: gcc.gnu.org](https://gcc.gnu.org/onlinedocs/cpp.pdf) 


## How use cpp in command line

```
cpp [-Dmacro[=defn]...] [-Umacro] [-Idir...] infile [[-o] outfile]
```

### Options

`-D name`  
Predefine name as a macro, with definition 1.

`-D name=definition`  
The contents of definition are tokenized and processed as if they appeared during translation phase three in a #define directive.  In particular, the definition is truncated by embedded newline characters.

`-U name`  
Cancel any previous definition of name, either built in or provided with a -D option.

`-I dir`  
Add the directory dir to the list of directories to be searched for header files during preprocessing.

`-P`  
Inhibit generation of linemarkers in the output from the preprocessor.  This might be useful when running the preprocessor on something that is not C code, and will be sent to a program which might be confused by the linemarkers.

[Source: man cpp](man cpp)

