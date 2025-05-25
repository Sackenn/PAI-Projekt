# Endpointy API

## Lista Endpointów API

### Uwierzytelnianie
- `POST /api/auth/signup`: Rejestracja nowego użytkownika
- `POST /api/auth/signin`: Uwierzytelnianie użytkownika
- `POST /api/auth/signout`: Wylogowanie użytkownika

### Użytkownicy
- `GET /api/user/profile/{userId}`: Pobierz profil użytkownika
- `PUT /api/user/profile/{userId}/username`: Aktualizuj nazwę użytkownika
- `PUT /api/user/profile/{userId}/email`: Aktualizuj email użytkownika
- `PUT /api/user/profile/{userId}/password`: Aktualizuj hasło użytkownika
- `GET /api/user/all`: Pobierz wszystkich użytkowników

### Tablice
- `GET /api/boards/user/{userId}`: Pobierz wszystkie tablice dla użytkownika
- `POST /api/boards/user/{userId}`: Utwórz nową tablicę
- `GET /api/boards/{id}/user/{userId}`: Pobierz konkretną tablicę
- `PUT /api/boards/{id}/user/{userId}`: Aktualizuj tablicę
- `DELETE /api/boards/{id}/user/{userId}`: Usuń tablicę
- `POST /api/boards/{id}/owner/{ownerId}/members/{userId}`: Dodaj członka do tablicy
- `DELETE /api/boards/{id}/owner/{ownerId}/members/{userId}`: Usuń członka z tablicy
- `PUT /api/boards/{id}/owner/{currentOwnerId}/change-owner/{newOwnerId}`: Zmień właściciela tablicy

### Listy
- `GET /api/boards/{boardId}/lists`: Pobierz wszystkie listy dla tablicy
- `POST /api/boards/{boardId}/lists`: Utwórz nową listę
- `PUT /api/boards/{boardId}/lists/{listId}`: Aktualizuj listę
- `DELETE /api/boards/{boardId}/lists/{listId}`: Usuń listę

### Karty
- `GET /api/boards/{boardId}/lists/{listId}/cards`: Pobierz wszystkie karty dla listy
- `POST /api/boards/{boardId}/lists/{listId}/cards`: Utwórz nową kartę
- `GET /api/boards/{boardId}/lists/{listId}/cards/{cardId}`: Pobierz konkretną kartę
- `PUT /api/boards/{boardId}/lists/{listId}/cards/{cardId}`: Aktualizuj kartę
- `DELETE /api/boards/{boardId}/lists/{listId}/cards/{cardId}`: Usuń kartę
- `POST /api/boards/{boardId}/lists/{listId}/cards/{cardId}/members/{userId}`: Dodaj członka do karty
- `DELETE /api/boards/{boardId}/lists/{listId}/cards/{cardId}/members/{userId}`: Usuń członka z karty
- `PUT /api/boards/{boardId}/lists/{listId}/cards/{cardId}/dates`: Aktualizuj daty karty

### Zadania
- `GET /api/boards/{boardId}/lists/{listId}/cards/{cardId}/tasks`: Pobierz wszystkie zadania dla karty
- `POST /api/boards/{boardId}/lists/{listId}/cards/{cardId}/tasks`: Utwórz nowe zadanie
- `PUT /api/boards/{boardId}/lists/{listId}/cards/{cardId}/tasks/{taskId}`: Aktualizuj zadanie
- `DELETE /api/boards/{boardId}/lists/{listId}/cards/{cardId}/tasks/{taskId}`: Usuń zadanie

### Etykiety
- `POST /api/boards/{boardId}/lists/{listId}/cards/{cardId}/labels`: Dodaj etykietę do karty
- `POST /api/boards/{boardId}/lists/{listId}/cards/{cardId}/global-labels/{labelId}`: Dodaj globalną etykietę do karty
- `DELETE /api/boards/{boardId}/lists/{listId}/cards/{cardId}/labels/{labelId}`: Usuń etykietę z karty
- `GET /api/labels/global`: Pobierz wszystkie globalne etykiety
- `POST /api/labels/global`: Utwórz nową globalną etykietę
- `DELETE /api/labels/global/{id}`: Usuń globalną etykietę


## Opis Endpointów API

### POST /api/auth/signin
- **Opis**: Uwierzytelnia użytkownika i zwraca informacje o użytkowniku wraz z ciasteczkiem sesji
- **Treść żądania**: 
  - `username`: Nazwa użytkownika
  - `password`: Hasło użytkownika
- **Odpowiedź**: 
  - Sukces: Informacje o użytkowniku (id, nazwa użytkownika, email) oraz ciasteczko sesji
  - Błąd: Komunikat o błędzie

### POST /api/auth/signup
- **Opis**: Rejestruje nowego użytkownika
- **Treść żądania**: 
  - `username`: Nazwa nowego użytkownika
  - `email`: Email nowego użytkownika
  - `password`: Hasło nowego użytkownika
- **Odpowiedź**: 
  - Sukces: Komunikat o powodzeniu
  - Błąd: Komunikat o błędzie (np. nazwa użytkownika jest już zajęta)

### POST /api/auth/signout
- **Opis**: Wylogowuje użytkownika poprzez wyczyszczenie ciasteczka sesji
- **Odpowiedź**: 
  - Sukces: Komunikat o powodzeniu

## Endpointy Użytkownika

### GET /api/user/profile/{userId}
- **Opis**: Pobiera informacje o profilu użytkownika
- **Parametry ścieżki**:
  - `userId`: ID użytkownika
- **Odpowiedź**: 
  - Sukces: Informacje o użytkowniku (bez hasła)
  - Błąd: Komunikat o błędzie

### PUT /api/user/profile/{userId}/username
- **Opis**: Aktualizuje nazwę użytkownika
- **Parametry ścieżki**:
  - `userId`: ID użytkownika do aktualizacji
- **Treść żądania**: 
  - `username`: Nowa nazwa użytkownika
- **Odpowiedź**: 
  - Sukces: Komunikat o powodzeniu
  - Błąd: Komunikat o błędzie

### PUT /api/user/profile/{userId}/email
- **Opis**: Aktualizuje email użytkownika
- **Parametry ścieżki**:
  - `userId`: ID użytkownika do aktualizacji
- **Treść żądania**: 
  - `email`: Nowy email użytkownika
- **Odpowiedź**: 
  - Sukces: Komunikat o powodzeniu
  - Błąd: Komunikat o błędzie

### PUT /api/user/profile/{userId}/password
- **Opis**: Aktualizuje hasło użytkownika
- **Parametry ścieżki**:
  - `userId`: ID użytkownika do aktualizacji
- **Treść żądania**: 
  - `currentPassword`: Aktualne hasło użytkownika
  - `password`: Nowe hasło użytkownika
- **Odpowiedź**: 
  - Sukces: Komunikat o powodzeniu
  - Błąd: Komunikat o błędzie (np. niepoprawne aktualne hasło)

### GET /api/user/all
- **Opis**: Pobiera listę wszystkich użytkowników
- **Odpowiedź**: 
  - Sukces: Lista użytkowników z podstawowymi informacjami (id, nazwa użytkownika)
  - Błąd: Komunikat o błędzie


## Endpointy Tablicy

### GET /api/boards/user/{userId}
- **Opis**: Pobiera wszystkie tablice dla użytkownika (własne lub jako członek)
- **Parametry ścieżki**:
  - `userId`: ID użytkownika
- **Odpowiedź**: 
  - Sukces: Lista tablic
  - Błąd: Komunikat o błędzie

### POST /api/boards/user/{userId}
- **Opis**: Tworzy nową tablicę
- **Parametry ścieżki**:
  - `userId`: ID użytkownika tworzącego tablicę
- **Treść żądania**: 
  - `name`: Nazwa tablicy
- **Odpowiedź**: 
  - Sukces: Utworzona tablica
  - Błąd: Komunikat o błędzie

### GET /api/boards/{id}/user/{userId}
- **Opis**: Pobiera konkretną tablicę po ID
- **Parametry ścieżki**:
  - `id`: ID tablicy
  - `userId`: ID użytkownika żądającego tablicy
- **Odpowiedź**: 
  - Sukces: Szczegóły tablicy
  - Błąd: Komunikat o błędzie

### PUT /api/boards/{id}/user/{userId}
- **Opis**: Aktualizuje tablicę
- **Parametry ścieżki**:
  - `id`: ID tablicy
  - `userId`: ID użytkownika aktualizującego tablicę
- **Treść żądania**: 
  - `name`: Zaktualizowana nazwa tablicy
- **Odpowiedź**: 
  - Sukces: Zaktualizowana tablica
  - Błąd: Komunikat o błędzie

### DELETE /api/boards/{id}/user/{userId}
- **Opis**: Usuwa tablicę
- **Parametry ścieżki**:
  - `id`: ID tablicy
  - `userId`: ID użytkownika usuwającego tablicę
- **Odpowiedź**: 
  - Sukces: Komunikat o powodzeniu
  - Błąd: Komunikat o błędzie

### POST /api/boards/{id}/owner/{ownerId}/members/{userId}
- **Opis**: Dodaje członka do tablicy
- **Parametry ścieżki**:
  - `id`: ID tablicy
  - `ownerId`: ID właściciela tablicy
  - `userId`: ID użytkownika do dodania jako członka
- **Odpowiedź**: 
  - Sukces: Komunikat o powodzeniu
  - Błąd: Komunikat o błędzie

### DELETE /api/boards/{id}/owner/{ownerId}/members/{userId}
- **Opis**: Usuwa członka z tablicy
- **Parametry ścieżki**:
  - `id`: ID tablicy
  - `ownerId`: ID właściciela tablicy
  - `userId`: ID członka do usunięcia
- **Odpowiedź**: 
  - Sukces: Komunikat o powodzeniu
  - Błąd: Komunikat o błędzie

### PUT /api/boards/{id}/owner/{currentOwnerId}/change-owner/{newOwnerId}
- **Opis**: Zmienia właściciela tablicy
- **Parametry ścieżki**:
  - `id`: ID tablicy
  - `currentOwnerId`: ID aktualnego właściciela tablicy
  - `newOwnerId`: ID użytkownika, który ma zostać nowym właścicielem
- **Odpowiedź**: 
  - Sukces: Komunikat o powodzeniu
  - Błąd: Komunikat o błędzie

## Endpointy Listy Tablicy

### GET /api/boards/{boardId}/lists
- **Opis**: Pobiera wszystkie listy dla tablicy
- **Parametry ścieżki**:
  - `boardId`: ID tablicy
- **Parametry zapytania**:
  - `userId`: ID użytkownika żądającego list
- **Odpowiedź**: 
  - Sukces: Lista list tablicy
  - Błąd: Komunikat o błędzie

### POST /api/boards/{boardId}/lists
- **Opis**: Tworzy nową listę w tablicy
- **Parametry ścieżki**:
  - `boardId`: ID tablicy
- **Parametry zapytania**:
  - `userId`: ID użytkownika tworzącego listę
- **Treść żądania**: 
  - `name`: Nazwa listy
- **Odpowiedź**: 
  - Sukces: Utworzona lista
  - Błąd: Komunikat o błędzie

### PUT /api/boards/{boardId}/lists/{listId}
- **Opis**: Aktualizuje listę
- **Parametry ścieżki**:
  - `boardId`: ID tablicy
  - `listId`: ID listy
- **Parametry zapytania**:
  - `userId`: ID użytkownika aktualizującego listę
- **Treść żądania**: 
  - `name`: Zaktualizowana nazwa listy
  - `position`: Zaktualizowana pozycja listy (opcjonalne)
- **Odpowiedź**: 
  - Sukces: Zaktualizowana lista
  - Błąd: Komunikat o błędzie

### DELETE /api/boards/{boardId}/lists/{listId}
- **Opis**: Usuwa listę
- **Parametry ścieżki**:
  - `boardId`: ID tablicy
  - `listId`: ID listy
- **Parametry zapytania**:
  - `userId`: ID użytkownika usuwającego listę
- **Odpowiedź**: 
  - Sukces: Komunikat o powodzeniu
  - Błąd: Komunikat o błędzie


## Endpointy Karty

### GET /api/boards/{boardId}/lists/{listId}/cards
- **Opis**: Pobiera wszystkie karty w liście
- **Parametry ścieżki**:
  - `boardId`: ID tablicy
  - `listId`: ID listy
- **Parametry zapytania**:
  - `userId`: ID użytkownika żądającego kart
- **Odpowiedź**: 
  - Sukces: Lista kart
  - Błąd: Komunikat o błędzie

### POST /api/boards/{boardId}/lists/{listId}/cards
- **Opis**: Tworzy nową kartę w liście
- **Parametry ścieżki**:
  - `boardId`: ID tablicy
  - `listId`: ID listy
- **Parametry zapytania**:
  - `userId`: ID użytkownika tworzącego kartę
- **Treść żądania**: 
  - `title`: Tytuł karty
  - `description`: Opis karty
- **Odpowiedź**: 
  - Sukces: Utworzona karta
  - Błąd: Komunikat o błędzie

### GET /api/boards/{boardId}/lists/{listId}/cards/{cardId}
- **Opis**: Pobiera konkretną kartę po ID
- **Parametry ścieżki**:
  - `boardId`: ID tablicy
  - `listId`: ID listy
  - `cardId`: ID karty
- **Parametry zapytania**:
  - `userId`: ID użytkownika żądającego karty
- **Odpowiedź**: 
  - Sukces: Szczegóły karty
  - Błąd: Komunikat o błędzie

### PUT /api/boards/{boardId}/lists/{listId}/cards/{cardId}
- **Opis**: Aktualizuje kartę
- **Parametry ścieżki**:
  - `boardId`: ID tablicy
  - `listId`: ID listy
  - `cardId`: ID karty
- **Parametry zapytania**:
  - `userId`: ID użytkownika aktualizującego kartę
- **Treść żądania**: 
  - `title`: Zaktualizowany tytuł karty
  - `description`: Zaktualizowany opis karty
  - `position`: Zaktualizowana pozycja karty (opcjonalne)
- **Odpowiedź**: 
  - Sukces: Zaktualizowana karta
  - Błąd: Komunikat o błędzie

### DELETE /api/boards/{boardId}/lists/{listId}/cards/{cardId}
- **Opis**: Usuwa kartę
- **Parametry ścieżki**:
  - `boardId`: ID tablicy
  - `listId`: ID listy
  - `cardId`: ID karty
- **Parametry zapytania**:
  - `userId`: ID użytkownika usuwającego kartę
- **Odpowiedź**: 
  - Sukces: Komunikat o powodzeniu
  - Błąd: Komunikat o błędzie

### POST /api/boards/{boardId}/lists/{listId}/cards/{cardId}/members/{userId}
- **Opis**: Dodaje członka do karty
- **Parametry ścieżki**:
  - `boardId`: ID tablicy
  - `listId`: ID listy
  - `cardId`: ID karty
  - `userId`: ID użytkownika do dodania jako członka
- **Odpowiedź**: 
  - Sukces: Komunikat o powodzeniu
  - Błąd: Komunikat o błędzie

### DELETE /api/boards/{boardId}/lists/{listId}/cards/{cardId}/members/{userId}
- **Opis**: Usuwa członka z karty
- **Parametry ścieżki**:
  - `boardId`: ID tablicy
  - `listId`: ID listy
  - `cardId`: ID karty
  - `userId`: ID członka do usunięcia
- **Odpowiedź**: 
  - Sukces: Komunikat o powodzeniu
  - Błąd: Komunikat o błędzie

### PUT /api/boards/{boardId}/lists/{listId}/cards/{cardId}/dates
- **Opis**: Aktualizuje daty karty
- **Parametry ścieżki**:
  - `boardId`: ID tablicy
  - `listId`: ID listy
  - `cardId`: ID karty
- **Parametry zapytania**:
  - `userId`: ID użytkownika aktualizującego daty karty
- **Treść żądania**: 
  - `startDate`: Zaktualizowana data rozpoczęcia karty
  - `dueDate`: Zaktualizowana data zakończenia karty
- **Odpowiedź**: 
  - Sukces: Zaktualizowana karta
  - Błąd: Komunikat o błędzie

### POST /api/boards/{boardId}/lists/{listId}/cards/{cardId}/labels
- **Opis**: Dodaje etykietę do karty
- **Parametry ścieżki**:
  - `boardId`: ID tablicy
  - `listId`: ID listy
  - `cardId`: ID karty
- **Parametry zapytania**:
  - `userId`: ID użytkownika dodającego etykietę
- **Treść żądania**: 
  - `name`: Nazwa etykiety
  - `color`: Kolor etykiety
- **Odpowiedź**: 
  - Sukces: Komunikat o powodzeniu
  - Błąd: Komunikat o błędzie

### POST /api/boards/{boardId}/lists/{listId}/cards/{cardId}/global-labels/{labelId}
- **Opis**: Dodaje globalną etykietę do karty
- **Parametry ścieżki**:
  - `boardId`: ID tablicy
  - `listId`: ID listy
  - `cardId`: ID karty
  - `labelId`: ID globalnej etykiety
- **Parametry zapytania**:
  - `userId`: ID użytkownika dodającego globalną etykietę
- **Odpowiedź**: 
  - Sukces: Komunikat o powodzeniu
  - Błąd: Komunikat o błędzie

### DELETE /api/boards/{boardId}/lists/{listId}/cards/{cardId}/labels/{labelId}
- **Opis**: Usuwa etykietę z karty
- **Parametry ścieżki**:
  - `boardId`: ID tablicy
  - `listId`: ID listy
  - `cardId`: ID karty
  - `labelId`: ID etykiety do usunięcia
- **Parametry zapytania**:
  - `userId`: ID użytkownika usuwającego etykietę
- **Odpowiedź**: 
  - Sukces: Komunikat o powodzeniu
  - Błąd: Komunikat o błędzie

## Endpointy Zadania

### GET /api/boards/{boardId}/lists/{listId}/cards/{cardId}/tasks
- **Opis**: Pobiera wszystkie zadania dla karty
- **Parametry ścieżki**:
  - `boardId`: ID tablicy
  - `listId`: ID listy
  - `cardId`: ID karty
- **Parametry zapytania**:
  - `userId`: ID użytkownika żądającego zadań
- **Odpowiedź**: 
  - Sukces: Lista zadań
  - Błąd: Komunikat o błędzie

### POST /api/boards/{boardId}/lists/{listId}/cards/{cardId}/tasks
- **Opis**: Tworzy nowe zadanie dla karty
- **Parametry ścieżki**:
  - `boardId`: ID tablicy
  - `listId`: ID listy
  - `cardId`: ID karty
- **Parametry zapytania**:
  - `userId`: ID użytkownika tworzącego zadanie
- **Treść żądania**: 
  - `description`: Opis zadania
- **Odpowiedź**: 
  - Sukces: Utworzone zadanie
  - Błąd: Komunikat o błędzie

### PUT /api/boards/{boardId}/lists/{listId}/cards/{cardId}/tasks/{taskId}
- **Opis**: Aktualizuje zadanie
- **Parametry ścieżki**:
  - `boardId`: ID tablicy
  - `listId`: ID listy
  - `cardId`: ID karty
  - `taskId`: ID zadania
- **Parametry zapytania**:
  - `userId`: ID użytkownika aktualizującego zadanie
- **Treść żądania**: 
  - `description`: Zaktualizowany opis zadania (opcjonalne)
  - `completed`: Zaktualizowany status ukończenia zadania
- **Odpowiedź**: 
  - Sukces: Zaktualizowane zadanie
  - Błąd: Komunikat o błędzie

### DELETE /api/boards/{boardId}/lists/{listId}/cards/{cardId}/tasks/{taskId}
- **Opis**: Usuwa zadanie
- **Parametry ścieżki**:
  - `boardId`: ID tablicy
  - `listId`: ID listy
  - `cardId`: ID karty
  - `taskId`: ID zadania
- **Parametry zapytania**:
  - `userId`: ID użytkownika usuwającego zadanie
- **Odpowiedź**: 
  - Sukces: Komunikat o powodzeniu
  - Błąd: Komunikat o błędzie

## Endpointy Etykiety

### GET /api/labels/global
- **Opis**: Pobiera wszystkie globalne etykiety
- **Parametry zapytania**:
  - `userId`: ID użytkownika żądającego globalnych etykiet
- **Odpowiedź**: 
  - Sukces: Lista globalnych etykiet
  - Błąd: Komunikat o błędzie

### POST /api/labels/global
- **Opis**: Tworzy nową globalną etykietę
- **Parametry zapytania**:
  - `userId`: ID użytkownika tworzącego globalną etykietę
- **Treść żądania**: 
  - `name`: Nazwa globalnej etykiety
  - `color`: Kolor globalnej etykiety
- **Odpowiedź**: 
  - Sukces: Utworzona globalna etykieta
  - Błąd: Komunikat o błędzie

### DELETE /api/labels/global/{id}
- **Opis**: Usuwa globalną etykietę
- **Parametry ścieżki**:
  - `id`: ID globalnej etykiety
- **Parametry zapytania**:
  - `userId`: ID użytkownika usuwającego globalną etykietę
- **Odpowiedź**: 
  - Sukces: Komunikat o powodzeniu
  - Błąd: Komunikat o błędzie
