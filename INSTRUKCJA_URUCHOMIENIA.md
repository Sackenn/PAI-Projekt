## Wymagania wstępne
1. **Java 11**
2. **Maven**
3. **MySQL**
4. **Node.js i npm**

## Konfiguracja bazy danych

1. Upewnij się, że serwer MySQL jest uruchomiony na porcie 3306
2. Otwórz plik `src\main\resources\application.properties`
3. Uzupełnij pola username i password swoimi danymi dostępowymi do MySQL:
   spring.datasource.username=twoja_nazwa_użytkownika
   spring.datasource.password=twoje_hasło
4. Baza danych `taskmanager` zostanie utworzona automatycznie przy pierwszym uruchomieniu aplikacji

## Uruchomienie backendu

1. Otwórz terminal
2. Przejdź do głównego katalogu projektu
3. Wykonaj polecenie Maven: mvn spring-boot:run
4. Backend zostanie uruchomiony na porcie 8080 (http://localhost:8080)
5. 
## Uruchomienie frontendu
1. Otwórz nowy terminal/wiersz poleceń
2. Przejdź do katalogu frontendu: cd src\main\frontend
3. Zainstaluj zależności (tylko przy pierwszym uruchomieniu): npm install
4. Uruchom aplikację frontendową: npm start
5. Frontend zostanie uruchomiony na porcie 3000 (http://localhost:3000)
