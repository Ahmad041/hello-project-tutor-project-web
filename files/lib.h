#define ENTER 13
#define ESC 27
#define BACKSPACE 8
#define SPACE 32

#define UP_ARROW 72
#define DOWN_ARROW 80
#define LEFT_ARROW 75
#define RIGHT_ARROW 77


// Deklarasi prosedur untuk menyembunyikan kursor
void hideCursor() {
    HANDLE consoleHandle = GetStdHandle(STD_OUTPUT_HANDLE);
    CONSOLE_CURSOR_INFO cursorInfo;
    GetConsoleCursorInfo(consoleHandle, &cursorInfo);
    cursorInfo.bVisible = FALSE;
    SetConsoleCursorInfo(consoleHandle, &cursorInfo);
}

//----Fullscren Layar----
void fullscreen(){
    ShowWindow(GetConsoleWindow(), SW_MAXIMIZE);
    keybd_event(VK_MENU,0x42,0,0);
    keybd_event(VK_RETURN,0x1c,0,0);
    keybd_event(VK_RETURN,0x1c,KEYEVENTF_KEYUP,0);
    keybd_event(VK_MENU,0x42,KEYEVENTF_KEYUP,0);
}

//---Hapus Scrollbar---
void remove_scrollbar() {
    HANDLE handle = GetStdHandle(STD_OUTPUT_HANDLE);
    CONSOLE_SCREEN_BUFFER_INFO info;
    GetConsoleScreenBufferInfo(handle, &info);
    COORD new_size ={
        info.srWindow.Right - info.srWindow.Left + 1,
        info.srWindow.Bottom - info.srWindow.Top + 1
        };
    SetConsoleScreenBufferSize(handle, new_size);
}

// Deklarasi prosedur untuk menampilkan kursor
void showCursor() {
    HANDLE consoleHandle = GetStdHandle(STD_OUTPUT_HANDLE);
    CONSOLE_CURSOR_INFO cursorInfo;
    GetConsoleCursorInfo(consoleHandle, &cursorInfo);
    cursorInfo.bVisible = TRUE;
    SetConsoleCursorInfo(consoleHandle, &cursorInfo);
}

//========= untuk mengatur posisi =========
void gotoxy(int x, int y) {
    COORD coord = {0, 0};
    coord.X = x;
    coord.Y = y;
    SetConsoleCursorPosition(GetStdHandle(STD_OUTPUT_HANDLE), coord);
}

//========= Menampilkan Karakter dengan koordinat tertentu ==========
void gotoPrintChar(int x, int y, int dec){
    gotoxy(x,y);
    printf("%c",dec);
}

//======== Menampilkan String dengan koordinat tertentu =========
void gotoPrintString(int x, int y, char text[255]){
    gotoxy(x,y);
    printf("%s",text);
}

//==================== Mengubah Font Style ===========================
void setConsoleFont( int fontSize, const wchar_t* fontName) {
    HANDLE hConsole = GetStdHandle(STD_OUTPUT_HANDLE);

    CONSOLE_FONT_INFOEX fontInfo;
    fontInfo.cbSize = sizeof(CONSOLE_FONT_INFOEX);

    // Mendapatkan informasi font saat ini
    GetCurrentConsoleFontEx(hConsole, FALSE, &fontInfo);

    // Mengganti ukuran font
    fontInfo.dwFontSize.X = 0;
    fontInfo.dwFontSize.Y = fontSize;

    // Mengganti nama font
    wcscpy(fontInfo.FaceName, fontName);

    // Mengganti bentuk font
    SetCurrentConsoleFontEx(hConsole, FALSE, &fontInfo);
}

void PrintTxt(int x,int y,char txtFile[100]) {
    char text[255];
    int penambah = 0;

    FILE *file = fopen(txtFile, "r");

    while (fgets(text, sizeof(text), file)) {
        gotoxy(x,y+penambah);
        printf("%s", text);
        penambah++;
    }
    fclose(file);
}

//=========== Input Tipe Data String ==============
void scanInputString(int x, int y,char text[100],int maxChar) {
    char ch;
    int i = 0;
    gotoxy(x,y);
    showCursor();

    while (1) {
        ch = getch();
        if (ch == ESC && i < 0) {
            text[i] = ch;
            text[i+1] = '\0';
            break;
        }
        if (ch == ENTER) {
            text[i] = '\0';
            break;
        }
        if (ch == BACKSPACE) {
            if(i > 0) {
                text[i] = "";
                i--;
                printf("\b \b");
            }
        }else{
            if(i < maxChar) {
                text[i] = ch;
                i++;
                gotoxy(x+i,y);
                printf("%c",ch);
            }
        }
    }
}


//=========== Validasi Input Hanya Alphabet ===============
void scanInputText(int x, int y,char text[100],int maxChar) {
    char ch;
    int i = 0;
    gotoxy(x+1,y);
    showCursor();
    while (1) {
        ch = getch();
        if (ch == ENTER) {
            text[i] = '\0';
            break;
        }
        if (ch == BACKSPACE) {
            if(i > 0) {
                text[i] = "";
                i--;
                printf("\b \b");
            }
        }else if (ch >= 'a' && ch <= 'z' || ch >= 'A' && ch <= 'Z' || ch == SPACE || ch == '0') {
            if(i < maxChar) {
                text[i] = ch;
                i++;
                gotoxy(x+i,y);
                printf("%c",ch);
            }
        }
    }
}


//========= Validasi Ketika input tidak akan menampilkan huruf tapi * ========
void scanInputPassword(int x, int y,char text[100],int maxChar) {
    char ch;
    int i = 0;
    gotoxy(x+1,y);
    showCursor();
    while (1) {
        ch = getch();
        if (ch == ENTER) {
            text[i] = '\0';
            break;
        }
        if (ch == BACKSPACE) {
            if(i > 0) {
                text[i] = "";
                i--;
                printf("\b \b");
            }
        }else if(ch >= 'a' && ch <= 'z' || ch >= 'A' && ch <= 'Z' || ch >= '0' && ch <='9' || ch == '_' ||ch == SPACE){
            if(i < maxChar) {
                text[i] = ch;
                i++;
                gotoxy(x+i,y);
                printf("*");
            }
        }
    }
}

//=========== Input Tipe Data Integer ==============
void scanInputNumber(int x, int y,int *num,int maxChar) {
    char text[50];
    char ch;
    int i = 0;
    gotoxy(x+1,y);
    showCursor();

    while (1) {
        ch = getch();
        if (ch == ENTER) {
            text[i] = '\0';
            *num = atoi(text);
            break;
        }
        if (ch == BACKSPACE) {
            if(i > 0) {
                text[i] = "";
                i--;
                printf("\b \b");
            }
        }else if(ch >= '0' && ch <= '9'){
            if(i < maxChar) {
                text[i] = ch;
                i++;
                gotoxy(x+i,y);
                printf("%c",ch);
            }
        }
    }
}

//=========== Input Tipe Data Integer Dengan format rupiah saat ketik ==============
void scanInputMoney(int x, int y,int *nilai, int min, int max)
{
    char input[225];
    char inpkey;
    int i, n, m;
    n = 0;

    gotoxy(x,y);
    showCursor();
    do
    {
        inpkey = getch();
        if(inpkey == '\b' && n != 0)
        {
            n--;
            input[n] = '\0';

            m = n % 3;
            if((n - m) % 3 == 0 || n == m){
                printf("\b \b");
                printf("\b \b");
            }else{
                printf("\b \b");
            }
            gotoxy(x,y);
            for(i = 0; i < n; i++){
                if((i + 1) == m || (i + 1 - m) % 3 == 0){
                    printf("%c", input[i]);
                    if(i != (n - 1)){
                        printf(".");
                    }
                }else {
                    printf("%c", input[i]);
                }
            }
        }else if (isprint(inpkey)){
            if(n == max){
                continue;
            }else {
                if (isdigit(inpkey)){
                    gotoxy(x,y);
                    input[n]=inpkey;
                    n++;
                    m = n % 3;
                    for(i = 0; i < n; i++){
                        if((i+1) == m || (i+1-m) % 3 == 0){
                            printf("%c", input[i]);
                            if(i != (n-1)){
                                printf(".");
                            }
                        }else {
                            printf("%c", input[i]);
                        }
                    }
                }
                else printf("\a");
            }
        }
        else if(inpkey == 13)
        {
            if(n < min){
                printf("\a");
                inpkey = 0;
            }
            else input[n]='\0';
        }
    }
    while(inpkey != 13);

    *nilai = atoi(input);
}


//=================== Border Double Line =====================
void borderDoubleLine(int x,int y,int lebar, int tinggi) {
    //------Garis Atas------
    for (int i = x; i < lebar+x; ++i) {
        gotoPrintChar(i,y,205);
    }

    //------Garis Kanan------
    for (int i = y+1; i < tinggi+y; ++i) {
        gotoPrintChar(lebar+x,i,186);
    }

    //-------Garis Bawah-------
    for (int i = lebar+x-1; i > x; --i) {
        gotoPrintChar(i,tinggi+y,205);
    }

    //-------Garis Kiri-------
    for (int i = y+1; i < y+tinggi; ++i) {
        gotoPrintChar(x,i,186);
    }
    //<<<Pojok kanan atas>>>
    gotoPrintChar(lebar+x,y,187);

    //<<<Pojok Kanan Bawah>>>
    gotoPrintChar(lebar+x,tinggi+y,188);

    //<<Pojok Kiri Atas>>
    gotoPrintChar(x,y,201);

    //<<Pojok Kiri bawah>>
    gotoPrintChar(x,y+tinggi,200);

}

//================ Border Garis ===================
void borderLine(int x,int y,int lebar, int tinggi) {
    //------Garis Atas------
    for (int i = x; i < lebar+x; ++i) {
        gotoPrintChar(i,y,196);
    }

    //<<<Pojok kanan atas>>>
    gotoPrintChar(lebar+x,y,187);

    //------Garis Samping------
    for (int i = y+1; i < tinggi+y; ++i) {
        gotoPrintChar(lebar+x,i,179);
        gotoPrintChar(x,i,179);
    }

    //<<<Pojok Kanan Bawah>>>
    gotoPrintChar(lebar+x,tinggi+y,188);

    //------Garis Bawah-------
    for (int i =x; i < lebar+x; ++i) {
        gotoPrintChar(i,tinggi+y,196);
    }
    //<<Pojok Kiri Atas>>
    gotoPrintChar(x,y,201);

    //<<Pojok Kiri bawah>>
    gotoPrintChar(x,y+tinggi,200);

}

void borderClear(int x, int y, int lebar, int tinggi) {
    lebar += 1;
    tinggi += 1;
    // ========= garis atas
    for (int i = x; i < x + lebar; ++i) {
        gotoPrintChar(i, y, ' ');
    }

    // ========= Menggambar garis samping
    for (int j = y + 1; j < y + tinggi; ++j) {
        gotoPrintChar(x, j, ' ');
        gotoPrintChar(x + lebar - 1, j, ' ');
    }

    // ========= Menggambar garis bawah
    for (int i = x; i < x + lebar; ++i) {
        gotoPrintChar(i, y + tinggi - 1, ' ');
    }
}

//-----Untuk menghapus area tertentu------
void clearArea(int x, int y, int width, int height) {
    hideCursor();
    for (int i = 0; i < height; i++) {
        gotoxy(x, y + i);
        for (int j = 0; j < width; j++) {
            printf(" ");
        }
    }
    showCursor();
}