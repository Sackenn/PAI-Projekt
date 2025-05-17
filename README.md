
## Struktura Projektu

### Komponenty Backendu

- **Modele**: Definiują strukturę danych
  - User: Reprezentuje użytkowników aplikacji
  - Board: Reprezentuje tablicę projektu lub zadań
  - BoardList: Reprezentuje listę w tablicy (np. "Do zrobienia", "W trakcie", "Zrobione")
  - Card: Reprezentuje kartę zadania w liście
  - Task: Reprezentuje podzadanie w karcie
  - Label: Reprezentuje kolorową etykietę, którą można dołączyć do karty

- **Kontrolery**: Obsługują żądania HTTP
  - AuthController: Obsługuje rejestrację i uwierzytelnianie użytkowników
  - UserController: Zarządza profilami użytkowników
  - BoardController: Zarządza tablicami
  - BoardListController: Zarządza listami w tablicach
  - CardController: Zarządza kartami w listach
  - TaskController: Zarządza zadaniami w kartach

- **Repozytoria**: Interfejs z bazą danych
  - UserRepository: Zarządza danymi użytkowników
  - BoardRepository: Zarządza danymi tablic
  - BoardListRepository: Zarządza danymi list
  - CardRepository: Zarządza danymi kart
  - TaskRepository: Zarządza danymi zadań

  
## Endpointy API

### Uwierzytelnianie
- `POST /api/auth/signup`: Rejestracja nowego użytkownika
- `POST /api/auth/signin`: Uwierzytelnianie użytkownika

### Użytkownicy
- `GET /api/user/profile/{userId}`: Pobierz profil użytkownika
- `PUT /api/user/profile/{userId}`: Aktualizuj profil użytkownika

### Tablice
- `GET /api/boards/user/{userId}`: Pobierz wszystkie tablice dla użytkownika
- `POST /api/boards/user/{userId}`: Utwórz nową tablicę
- `GET /api/boards/{id}/user/{userId}`: Pobierz konkretną tablicę
- `PUT /api/boards/{id}/user/{userId}`: Aktualizuj tablicę
- `DELETE /api/boards/{id}/user/{userId}`: Usuń tablicę
- `POST /api/boards/{id}/owner/{ownerId}/members/{userId}`: Dodaj członka do tablicy
- `DELETE /api/boards/{id}/owner/{ownerId}/members/{userId}`: Usuń członka z tablicy

### Listy
- `GET /api/boards/{boardId}/lists`: Pobierz wszystkie listy dla tablicy
- `POST /api/boards/{boardId}/lists`: Utwórz nową listę

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
- `DELETE /api/boards/{boardId}/lists/{listId}/cards/{cardId}/labels/{labelId}`: Usuń etykietę z karty

### Obsługa Błędów
Backend zwraca odpowiednie kody statusu HTTP i komunikaty o błędach:
- 400 Bad Request: Nieprawidłowe dane wejściowe
- 403 Forbidden: Użytkownik nie ma uprawnień
- 404 Not Found: Zasób nie istnieje
- 500 Internal Server Error: Błąd po stronie serwera
