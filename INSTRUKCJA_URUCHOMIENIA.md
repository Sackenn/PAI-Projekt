## Wymagania wstępne
1. **Java 11**
2. **Maven**
3. **MySQL**
4. **Node.js**

## Konfiguracja bazy danych

1. Upewnij się, że serwer MySQL jest uruchomiony na porcie 3306
2. Otwórz plik `src\main\resources\application.properties`
3. Uzupełnij pola username i password swoimi danymi dostępowymi do MySQL:
   `spring.datasource.username=twoja_nazwa_użytkownika`
   `spring.datasource.password=twoje_hasło`
4. Baza danych `taskmanager` zostanie utworzona automatycznie przy pierwszym uruchomieniu aplikacji

## Uruchomienie backendu
1. Otwórz terminal
2. Przejdź do głównego katalogu projektu
3. Wykonaj polecenie Maven: `mvn spring-boot:run`
4. Backend zostanie uruchomiony na porcie 8080

## Uruchomienie frontendu
1. Otwórz nowy terminal
2. Przejdź do katalogu frontendu: `cd src\main\frontend`
3. Zainstaluj zależności: `npm install`
4. Uruchom aplikację frontendową: `npm start`
5. Frontend zostanie uruchomiony na porcie 3000

## Instrukcja Użytkowania

### Rejestracja i Logowanie
1. Otwórz przeglądarkę i przejdź pod adres http://localhost:3000
2. Kliknij "Zarejestruj się", aby utworzyć nowe konto
3. Wypełnij formularz rejestracji (nazwa użytkownika, email, hasło) i kliknij "Zarejestruj"
4. Po rejestracji, zaloguj się używając nazwę użytkownika i hasła

### Zarządzanie Tablicami
1. Po zalogowaniu zobaczysz listę swoich tablic
2. Kliknij "Utwórz Nową Tablicę", aby utworzyć nową tablicę
3. Podaj nazwę i kliknij "Utwórz"
4. Pod nazwą tablicy znajdują się trzy przyciski:
   - "Zobacz tablicą" - przejście do strony tablicy
   - "Manage Members" - Zarządzanie członkami tablicy
   - "Delete" - usunięcie tablicy
5. Na stronie zarządzania członkami tablicy możesz:
   - Dodawać i usuwać członków tablicy
   - Zmieniać właściciela tablicy

### Zarządzanie Listami
1. Na stronie tablicy kliknij "Add List", aby utworzyć nową listę
2. Podaj nazwę i kliknij "Create List"
3. Kliknij "Edit" obok nazwy listy, aby zmienić jej nazwę
4. Kliknij "Delete" obok nazwy listy, aby usunąć listę

### Zarządzanie Kartami
1. Na liście kliknij "Add Card", aby utworzyć nową kartę
2. Podaj tytuł oraz opis(opcjonalne) i kliknij "Add Card"
3. Kliknij na kartę, aby przejść do jej szczegółów
4. Na stronie szczegółów karty możesz:
   - Edytować tytuł i opis karty
   - Ustawiać daty rozpoczęcia i zakończenia
   - Dodawać i usuwać etykiety
   - Dodawać, edytować i usuwać podzadania
   - Usuwać kartę

### Zarządzanie Zadaniami
1. Na stronie szczegółów karty kliknij "Nowe zadanie", aby utworzyć nowe podzadanie
2. Podaj nazwę i kliknij "Add Task"
3. Zaznacz checkbox obok zadania, aby oznaczyć je jako ukończone
4. Kliknij na ikonę usuwania zadania, aby je usunąć

### Zarządzanie Etykietami
1. Do karty możesz dodać istniejącą etykietę globalną lub utworzyć nową etykietę lokalną
2. Dla nowej etykiety wypełnij formularz (nazwa, kolor, parametr "Set as Global Label") i kliknij "Add Label"
3. Kliknij na krzyżyk obok etykiety na karcie, aby ją usunąć

### Zarządzanie Profilem
1. Na stronie głównej możesz:
   - Zmienić nazwę użytkownika
   - Zmienić adres email
   - Zmienić hasło

### Wylogowanie
1. Kliknij "Wyloguj" w nagłówku, aby wylogować się z konta