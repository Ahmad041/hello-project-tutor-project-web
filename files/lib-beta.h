#ifndef LIB_BETA_H
#define LIB_BETA_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <windows.h>
#include <conio.h>
#include <ctype.h>
#include <wchar.h>

#define ENTER 13
#define ESC 27
#define BACKSPACE 8
#define SPACE 32

#define UP_ARROW 72
#define DOWN_ARROW 80
#define LEFT_ARROW 75
#define RIGHT_ARROW 77

/* shortcut: offset +1000 memisahkan scan code 2-byte dari ASCII 0..255, ganti ke struct KeyEvent jika butuh modifier Shift/Ctrl */
#define KEY_UP 1072
#define KEY_DOWN 1080
#define KEY_LEFT 1075
#define KEY_RIGHT 1077

#define COLOR_BLACK 0
#define COLOR_BLUE 1
#define COLOR_GREEN 2
#define COLOR_CYAN 3
#define COLOR_RED 4
#define COLOR_MAGENTA 5
#define COLOR_YELLOW 6
#define COLOR_WHITE 7
#define COLOR_GRAY 8
#define COLOR_LIGHT_BLUE 9
#define COLOR_LIGHT_GREEN 10
#define COLOR_LIGHT_CYAN 11
#define COLOR_LIGHT_RED 12
#define COLOR_LIGHT_MAGENTA 13
#define COLOR_LIGHT_YELLOW 14
#define COLOR_BRIGHT_WHITE 15

static void setCursorVisible(BOOL visible) {
    HANDLE h = GetStdHandle(STD_OUTPUT_HANDLE);
    CONSOLE_CURSOR_INFO info;
    if (GetConsoleCursorInfo(h, &info)) {
        info.bVisible = visible;
        SetConsoleCursorInfo(h, &info);
    }
}

void hideCursor(void) { setCursorVisible(FALSE); }
void showCursor(void) { setCursorVisible(TRUE); }

void fullscreen(void) {
    ShowWindow(GetConsoleWindow(), SW_MAXIMIZE);
    keybd_event(VK_MENU, 0x42, 0, 0);
    keybd_event(VK_RETURN, 0x1c, 0, 0);
    keybd_event(VK_RETURN, 0x1c, KEYEVENTF_KEYUP, 0);
    keybd_event(VK_MENU, 0x42, KEYEVENTF_KEYUP, 0);
}

void remove_scrollbar(void) {
    HANDLE h = GetStdHandle(STD_OUTPUT_HANDLE);
    CONSOLE_SCREEN_BUFFER_INFO info;
    if (GetConsoleScreenBufferInfo(h, &info)) {
        COORD sz = {
            (SHORT)(info.srWindow.Right - info.srWindow.Left + 1),
            (SHORT)(info.srWindow.Bottom - info.srWindow.Top + 1)
        };
        SetConsoleScreenBufferSize(h, sz);
    }
}

void gotoxy(int x, int y) {
    COORD coord = { (SHORT)x, (SHORT)y };
    SetConsoleCursorPosition(GetStdHandle(STD_OUTPUT_HANDLE), coord);
}

void gotoPrintChar(int x, int y, int dec) {
    gotoxy(x, y);
    printf("%c", dec);
}

void gotoPrintString(int x, int y, const char *text) {
    if (text == NULL) return;
    gotoxy(x, y);
    printf("%s", text);
}

void setConsoleFont(int fontSize, const wchar_t *fontName) {
    HANDLE hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
    CONSOLE_FONT_INFOEX fontInfo = {0};
    fontInfo.cbSize = sizeof(CONSOLE_FONT_INFOEX);
    if (!GetCurrentConsoleFontEx(hConsole, FALSE, &fontInfo)) return;
    fontInfo.dwFontSize.X = 0;
    fontInfo.dwFontSize.Y = (SHORT)fontSize;
    if (fontName != NULL) {
        size_t len = wcslen(fontName);
        if (len >= LF_FACESIZE) len = LF_FACESIZE - 1;
        wmemcpy(fontInfo.FaceName, fontName, len);
        fontInfo.FaceName[len] = L'\0';
    }
    SetCurrentConsoleFontEx(hConsole, FALSE, &fontInfo);
}

void PrintTxt(int x, int y, const char *txtFile) {
    char text[255];
    int row = 0;
    FILE *file = (txtFile != NULL) ? fopen(txtFile, "r") : NULL;
    if (file == NULL) return;
    while (fgets(text, (int)sizeof(text), file) != NULL) {
        gotoxy(x, y + row++);
        printf("%s", text);
    }
    fclose(file);
}

void setColor(int textColor, int bgColor) {
    WORD attr = (WORD)(((bgColor & 0x0F) << 4) | (textColor & 0x0F));
    SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), attr);
}

void resetColor(void) { setColor(COLOR_WHITE, COLOR_BLACK); }

void gotoPrintCenter(int x, int y, int width, const char *text) {
    if (text == NULL) return;
    if (width <= 0) { gotoPrintString(x, y, text); return; }
    int len = (int)strlen(text);
    gotoxy(x + (len < width ? (width - len) / 2 : 0), y);
    printf("%.*s", width, text);
}

void gotoPrintRight(int x, int y, int width, const char *text) {
    if (text == NULL) return;
    if (width <= 0) { gotoPrintString(x, y, text); return; }
    int len = (int)strlen(text);
    gotoxy(x + (len < width ? width - len : 0), y);
    printf("%.*s", width, text);
}

void formatMoney(int nilai, char *output, size_t outputSize) {
    char digits[32], formatted[64];
    unsigned int absVal = (nilai < 0) ? (0u - (unsigned int)nilai) : (unsigned int)nilai;
    size_t len, pos = 0, copyLen;
    if (output == NULL || outputSize == 0) return;
    snprintf(digits, sizeof(digits), "%u", absVal);
    len = strlen(digits);
    if (nilai < 0) formatted[pos++] = '-';
    formatted[pos++] = 'R';
    formatted[pos++] = 'p';
    formatted[pos++] = ' ';
    for (size_t i = 0; i < len; i++) {
        if (i > 0 && (len - i) % 3 == 0) formatted[pos++] = '.';
        formatted[pos++] = digits[i];
    }
    formatted[pos] = '\0';
    copyLen = (pos < outputSize - 1) ? pos : (outputSize - 1);
    memcpy(output, formatted, copyLen);
    output[copyLen] = '\0';
}

void gotoPrintMoney(int x, int y, int nilai) {
    char buf[64];
    formatMoney(nilai, buf, sizeof(buf));
    gotoPrintString(x, y, buf);
}

void horizontalLine(int x, int y, int lebar) {
    for (int i = 0; i < lebar; ++i) gotoPrintChar(x + i, y, 196);
}

void horizontalDoubleLine(int x, int y, int lebar) {
    for (int i = 0; i < lebar; ++i) gotoPrintChar(x + i, y, 205);
}

void verticalLine(int x, int y, int tinggi) {
    for (int i = 0; i < tinggi; ++i) gotoPrintChar(x, y + i, 179);
}

void borderDoubleLine(int x, int y, int lebar, int tinggi) {
    horizontalDoubleLine(x + 1, y, lebar - 1);
    horizontalDoubleLine(x + 1, y + tinggi, lebar - 1);
    for (int i = y + 1; i < y + tinggi; ++i) {
        gotoPrintChar(x, i, 186);
        gotoPrintChar(x + lebar, i, 186);
    }
    gotoPrintChar(x, y, 201);
    gotoPrintChar(x + lebar, y, 187);
    gotoPrintChar(x, y + tinggi, 200);
    gotoPrintChar(x + lebar, y + tinggi, 188);
}

void borderLine(int x, int y, int lebar, int tinggi) {
    horizontalLine(x + 1, y, lebar - 1);
    horizontalLine(x + 1, y + tinggi, lebar - 1);
    verticalLine(x, y + 1, tinggi - 1);
    verticalLine(x + lebar, y + 1, tinggi - 1);
    /* shortcut: sudut memakai kode garis ganda (201,187,200,188) agar identik dengan lib.h video tutorial */
    gotoPrintChar(x, y, 201);
    gotoPrintChar(x + lebar, y, 187);
    gotoPrintChar(x, y + tinggi, 200);
    gotoPrintChar(x + lebar, y + tinggi, 188);
}

void borderClear(int x, int y, int lebar, int tinggi) {
    for (int i = x; i <= x + lebar; ++i) {
        gotoPrintChar(i, y, ' ');
        gotoPrintChar(i, y + tinggi, ' ');
    }
    for (int j = y + 1; j < y + tinggi; ++j) {
        gotoPrintChar(x, j, ' ');
        gotoPrintChar(x + lebar, j, ' ');
    }
}

void clearArea(int x, int y, int width, int height) {
    hideCursor();
    for (int i = 0; i < height; i++) {
        gotoxy(x, y + i);
        for (int j = 0; j < width; j++) printf(" ");
    }
    showCursor();
}

int readKey(void) {
    int key = getch();
    if (key == 0 || key == 224) {
        int ext = getch();
        if (ext == UP_ARROW) return KEY_UP;
        if (ext == DOWN_ARROW) return KEY_DOWN;
        if (ext == LEFT_ARROW) return KEY_LEFT;
        if (ext == RIGHT_ARROW) return KEY_RIGHT;
        return 1000 + ext;
    }
    return key;
}

static void scanBuf(int x, int y, char *buf, int maxChar, int mode) {
    int ch, i = 0, hasDot = 0;
    gotoxy(x, y);
    showCursor();
    for (;;) {
        ch = readKey();
        if (ch >= 1000) continue;
        if (ch == ENTER) { buf[i] = '\0'; break; }
        if (ch == BACKSPACE) {
            if (i > 0) {
                if (buf[--i] == '.' && mode == 4) hasDot = 0;
                buf[i] = '\0';
                printf("\b \b");
            }
        } else if (i < maxChar) {
            int ok = (mode == 0) ? isprint((unsigned char)ch)
                   : (mode == 1) ? ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || ch == SPACE || ch == '0')
                   : (mode == 2) ? ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || (ch >= '0' && ch <= '9') || ch == '_' || ch == SPACE)
                   : (mode == 3) ? (ch >= '0' && ch <= '9')
                   : ((ch >= '0' && ch <= '9') || (ch == '.' && !hasDot));
            if (ok) {
                if (mode == 4 && ch == '.') hasDot = 1;
                buf[i] = (char)ch;
                gotoxy(x + i, y);
                printf("%c", mode == 2 ? '*' : ch);
                i++;
            }
        }
    }
}

void scanInputString(int x, int y, char *text, int maxChar) {
    if (text == NULL || maxChar <= 0) { if (text != NULL) text[0] = '\0'; return; }
    scanBuf(x, y, text, maxChar, 0);
}

void scanInputText(int x, int y, char *text, int maxChar) {
    if (text == NULL || maxChar <= 0) { if (text != NULL) text[0] = '\0'; return; }
    scanBuf(x, y, text, maxChar, 1);
}

void scanInputPassword(int x, int y, char *text, int maxChar) {
    if (text == NULL || maxChar <= 0) { if (text != NULL) text[0] = '\0'; return; }
    scanBuf(x, y, text, maxChar, 2);
}

void scanInputNumber(int x, int y, int *num, int maxChar) {
    char text[50] = {0};
    if (num == NULL || maxChar <= 0) return;
    if (maxChar > (int)(sizeof(text) - 1)) maxChar = (int)(sizeof(text) - 1);
    scanBuf(x, y, text, maxChar, 3);
    /* shortcut: atoi/int muat sampai 2.147.483.647, upgrade ke strtoll/int64_t jika nominal transaksi > 2 miliar */
    *num = (text[0] != '\0') ? atoi(text) : 0;
}

void scanInputFloat(int x, int y, float *num, int maxChar) {
    char text[64] = {0};
    if (num == NULL || maxChar <= 0) return;
    if (maxChar > (int)(sizeof(text) - 1)) maxChar = (int)(sizeof(text) - 1);
    scanBuf(x, y, text, maxChar, 4);
    *num = (text[0] != '\0') ? (float)atof(text) : 0.0f;
}

void scanInputMoney(int x, int y, int *nilai, int min, int max) {
    char input[225] = {0};
    int ch, i, n = 0;
    if (nilai == NULL) return;
    if (max > (int)(sizeof(input) - 1)) max = (int)(sizeof(input) - 1);
    if (min < 0) min = 0;
    gotoxy(x, y);
    showCursor();
    for (;;) {
        int redraw = 0;
        ch = readKey();
        if (ch >= 1000) continue;
        if (ch == BACKSPACE) {
            if (n > 0) {
                input[--n] = '\0';
                printf("\b \b");
                if (n > 0 && n % 3 == 0) printf("\b \b");
                redraw = 1;
            }
        } else if (ch == ENTER) {
            if (n < min) printf("\a");
            else { input[n] = '\0'; break; }
        } else if (isprint((unsigned char)ch) && n < max) {
            if (isdigit((unsigned char)ch)) {
                input[n++] = (char)ch;
                redraw = 1;
            } else {
                printf("\a");
            }
        }
        if (redraw) {
            gotoxy(x, y);
            for (i = 0; i < n; i++) {
                printf("%c", input[i]);
                if (i < n - 1 && (n - 1 - i) % 3 == 0) printf(".");
            }
        }
    }
    /* shortcut: atoi/int muat sampai 2.147.483.647, upgrade ke strtoll/int64_t jika nominal transaksi > 2 miliar */
    *nilai = (n > 0) ? atoi(input) : 0;
}

void typeText(int x, int y, const char *text, int delayMs) {
    if (text == NULL) return;
    if (delayMs < 0) delayMs = 0;
    gotoxy(x, y);
    for (int i = 0; text[i] != '\0'; ++i) {
        printf("%c", text[i]);
        fflush(stdout);
        if (delayMs > 0) Sleep((DWORD)delayMs);
    }
}

void loadingBar(int x, int y, int width, int delayMs) {
    if (width <= 0) return;
    if (delayMs < 0) delayMs = 0;
    hideCursor();
    /* shortcut: Sleep() memblokir thread utama selama animasi, pindahkan ke timer non-blocking jika butuh input paralel */
    for (int step = 0; step <= width; ++step) {
        gotoxy(x, y);
        for (int i = 0; i < width; ++i) printf("%c", (i < step) ? 219 : 176);
        printf(" %3d%%", (step * 100) / width);
        fflush(stdout);
        if (delayMs > 0 && step < width) Sleep((DWORD)delayMs);
    }
}

#endif /* LIB_BETA_H */
