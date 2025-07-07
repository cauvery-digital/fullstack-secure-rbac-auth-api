# Vim Editor Commands

Vim, a powerful text editor, uses distinct modes for editing and navigation. In normal mode, you can navigate using h, j, k, l (left, down, up, right) and enter insert mode with i or replace mode with r. Saving is done with :w, quitting with :q, and saving and quitting with :wq.

Key Commands:

1. Navigation:
   1. h: Move cursor left.
   1. j: Move cursor down.
   1. k: Move cursor up.
   1. l: Move cursor right.
   1. w: Move cursor to the beginning of the next word.
   1. b: Move cursor to the beginning of the current word.
   1. 0 or ^: Move to the beginning of the line.
   1. $: Move to the end of the line.
   1. G: Move to the end of the file.
   1. gg: Move to the beginning of the file.
   1. :n: Jump to line number n.

1. Editing:
   1. i: Enter insert mode before the cursor.
   1. a: Enter insert mode after the cursor.
   1. o: Open a new line below and enter insert mode.
   1. O: Open a new line above and enter insert mode.
   1. r: Replace a single character.
   1. R: Replace multiple characters.
   1. dd: Delete the current line.
   1. yy: Yank (copy) the current line.
   1. p: Paste the yanked/deleted text.
   1. u: Undo the last action.
   1. Ctrl-r: Redo.
   1. :%s/old/new/g: Replace all instances of "old" with "new".

1. Saving and Quitting:
   1. :w: Save the file.
   1. :q: Quit (only if no changes).
   1. :q!: Quit without saving.
   1. :wq or ZZ: Save and quit.

1. Searching:
   1. /pattern: Search forward for pattern.
   1. ?pattern: Search backward for pattern.
   1. n: Go to the next match.
   1. N: Go to the previous match.

1. Other:
   1. :!command: Execute a shell command.
   1. v: Enter visual mode for text selection.
   1. V: Enter linewise visual mode.
   1. :%: Go to the matching parenthesis, bracket, or brace.
   1. 1G=G or gg=G: Format and indent the entire file.
   1. x: Delete a character under the cursor.
   1. dw: Delete the current word.
   1. dG: Delete from the current line to the end of the file.
   1. yw: Yank (copy) a word.
   1. y: Yank using visual selection.
