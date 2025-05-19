# Struktura Projektu

## Komponenty Backendu

- **Models**: Definiują strukturę danych
  - User: Reprezentuje użytkowników aplikacji
  - Board: Reprezentuje projekt lub tablicę zadań
  - BoardList: Reprezentuje listę w tablicy
  - Card: Reprezentuje kartę zadania w liście
  - Task: Reprezentuje podzadanie w karcie
  - Label: Reprezentuje kolorową etykietę, która może być dołączona do karty

- **Controllers**: Obsługują żądania HTTP
  - AuthController: Obsługuje rejestrację i uwierzytelnianie użytkowników
  - UserController: Zarządza profilami użytkowników
  - BoardController: Zarządza tablicami
  - BoardListController: Zarządza listami w tablicach
  - CardController: Zarządza kartami w listach
  - TaskController: Zarządza zadaniami w kartach
  - LabelController: Zarządza globalnymi etykietami

- **Repositories**: Interfejs z bazą danych
  - UserRepository: Zarządza danymi użytkowników
  - BoardRepository: Zarządza danymi tablic
  - BoardListRepository: Zarządza danymi list
  - CardRepository: Zarządza danymi kart
  - TaskRepository: Zarządza danymi zadań
  - LabelRepository: Zarządza danymi etykiet


## Endpointy API

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

### Obsługa Błędów
Backend zwraca odpowiednie kody statusu HTTP i komunikaty o błędach:
- 400 Bad Request: Nieprawidłowe dane wejściowe
- 403 Forbidden: Użytkownik nie ma uprawnień
- 404 Not Found: Zasób nie istnieje
- 500 Internal Server Error: Błąd po stronie serwera
