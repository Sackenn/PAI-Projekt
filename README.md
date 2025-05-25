# Dokumentacja Projektu Task Manager

## Projekt Wykonali
- **Oskar Serafińczuk 159845 (Sackenn)** - Lider zespołu, odpowiedzialny za serwer, API oraz bazę danych
- **Konrad Milewski 159826 (KonradM1L)** - Odpowiedzialny za frontend aplikacji
- **Jan Jesień 159817 (hardkoreJanusz)** - Odpowiedzialny za frontend aplikacji

## Temat Projektu
Task Manager to aplikacja webowa służąca do zarządzania zadaniami i projektami. Aplikacja umożliwia tworzenie tablic projektów, list zadań, kart zadań oraz podzadań, a także przypisywanie użytkowników do poszczególnych elementów. Inspiracją dla projektu były popularne narzędzia do zarządzania projektami, takie jak Trello czy Asana.

## Lista funkcjonalności

### Zarządzanie Użytkownikami
- Rejestracja nowych użytkowników
- Logowanie i wylogowywanie użytkowników
- Zarządzanie profilem użytkownika (zmiana nazwy użytkownika, adresu email, hasła)
- Przeglądanie listy wszystkich użytkowników

### Zarządzanie Tablicami
- Tworzenie nowych tablic projektów
- Przeglądanie, edycja i usuwanie tablic
- Dodawanie i usuwanie członków tablicy
- Zmiana właściciela tablicy

### Zarządzanie Listami
- Tworzenie nowych list w ramach tablicy
- Przeglądanie, edycja i usuwanie list

### Zarządzanie Kartami
- Tworzenie nowych kart zadań w ramach listy
- Przeglądanie, edycja i usuwanie kart
- Ustawianie dat rozpoczęcia i zakończenia zadania
- Dodawanie etykiet do kart
- Zmiana kolejności kart

### Zarządzanie Zadaniami
- Tworzenie podzadań w ramach karty
- Przeglądanie, edycja i usuwanie podzadań
- Oznaczanie podzadań jako ukończone

### Zarządzanie Etykietami
- Tworzenie lokalnych oraz globalnych etykiet
- Dodawanie oraz usuwanie etykiet z kart

## Założenia Architektoniczne

Aplikacja korzysta z architektury klient-serwer.

### Architektura Ogólna
- **Frontend**: Aplikacja React działająca w przeglądarce użytkownika
- **Backend**: Serwer Spring Boot udostępniający API REST
- **Baza danych**: MySQL przechowująca dane aplikacji

### Architektura Backendu
Backend aplikacji został zbudowany w oparciu o wzorzec MVC (Model-View-Controller), gdzie:
- **Model**: Klasy encji reprezentujące struktury danych (User, Board, BoardList, Card, Task, Label)
- **View**: Reprezentowane przez odpowiedzi JSON z API
- **Controller**: Kontrolery obsługujące żądania HTTP i zarządzające logiką biznesową

### Architektura Frontendu
Frontend aplikacji został zbudowany w oparciu o komponenty React, z wykorzystaniem:
- **Context API**: Do zarządzania stanem globalnym aplikacji (np. informacje o zalogowanym użytkowniku)
- **React Router**: Do nawigacji między różnymi widokami aplikacji
- **Axios**: Do komunikacji z API backendu

### Komunikacja
Komunikacja między frontendem a backendem odbywa się poprzez API REST, z wykorzystaniem formatu JSON do wymiany danych.

## Wykorzystanie Narzędzi Programowych

### Backend
- **Java 11**: Język programowania używany do implementacji backendu
- **Spring Boot**: Framework ułatwiający tworzenie aplikacji Spring
- **MySQL**: System zarządzania bazą danych
- **Maven**: Narzędzie do zarządzania zależnościami i budowania projektu

### Frontend
- **JavaScript/ES6+**: Język programowania używany do implementacji frontendu
- **React**: Biblioteka JavaScript do budowania interfejsów użytkownika
- **React Router**: Do obsługi nawigacji w aplikacji
- **Axios**: Biblioteka do wykonywania żądań HTTP
- **node.js**: Środowisko uruchomieniowe JavaScript

## Opis Techniczny

### Moduły Backendu

#### Moduł Models
Definiuje strukturę danych aplikacji:
- **User**: Reprezentuje użytkowników aplikacji. Przechowuje informacje o nazwie użytkownika, emailu i haśle. Posiada relacje z tablicami, listami, kartami i zadaniami (jako właściciel lub członek).
- **Board**: Reprezentuje tablicę projektów. Przechowuje nazwę tablicy i relacje z właścicielem, członkami i listami.
- **BoardList**: Reprezentuje listę w tablicy. Przechowuje nazwę listy, pozycję i relacje z tablicą, właścicielem, członkami i kartami.
- **Card**: Reprezentuje kartę zadania w liście. Przechowuje tytuł, opis, pozycję, daty rozpoczęcia i zakończenia oraz relacje z listą, właścicielem, członkami, zadaniami i etykietami.
- **Task**: Reprezentuje podzadanie w karcie. Przechowuje opis, status ukończenia i relacje z kartą, właścicielem i członkami.
- **Label**: Reprezentuje etykietę, która może być dołączona do karty. Przechowuje nazwę, kolor i relacje z kartami.

#### Moduł Controllers
Obsługuje żądania HTTP i implementuje logikę biznesową:
- **AuthController**: Obsługuje rejestrację, logowanie i wylogowywanie użytkowników.
- **UserController**: Zarządza profilami użytkowników (pobieranie, aktualizacja).
- **BoardController**: Zarządza tablicami (tworzenie, pobieranie, aktualizacja, usuwanie, zarządzanie członkami).
- **BoardListController**: Zarządza listami w tablicach (tworzenie, pobieranie, aktualizacja, usuwanie).
- **CardController**: Zarządza kartami w listach (tworzenie, pobieranie, aktualizacja, usuwanie, zarządzanie członkami i etykietami).
- **TaskController**: Zarządza zadaniami w kartach (tworzenie, pobieranie, aktualizacja, usuwanie).
- **LabelController**: Zarządza globalnymi etykietami (tworzenie, pobieranie, usuwanie).

#### Moduł Repositories
Zapewnia interfejs bazy danych:
- **UserRepository**: Zarządza danymi użytkowników.
- **BoardRepository**: Zarządza danymi tablic.
- **BoardListRepository**: Zarządza danymi list.
- **CardRepository**: Zarządza danymi kart.
- **TaskRepository**: Zarządza danymi zadań.
- **LabelRepository**: Zarządza danymi etykiet.

#### Moduł Config
Zawiera konfigurację aplikacji:
- **WebConfig**: Konfiguruje CORS i konwertery typów.

### Baza Danych
Baza danych MySQL przechowuje dane aplikacji w następujących tabelach:
- **users**: Przechowuje dane użytkowników.
- **boards**: Przechowuje dane tablic.
- **board_members**: Tabela łącząca dla relacji wiele-do-wielu między tablicami a użytkownikami (członkowie tablicy).
- **board_lists**: Przechowuje dane list.
- **board_list_members**: Tabela łącząca dla relacji wiele-do-wielu między listami a użytkownikami (członkowie listy).
- **cards**: Przechowuje dane kart.
- **card_members**: Tabela łącząca dla relacji wiele-do-wielu między kartami a użytkownikami (członkowie karty).
- **tasks**: Przechowuje dane zadań.
- **task_members**: Tabela łącząca dla relacji wiele-do-wielu między zadaniami a użytkownikami (członkowie zadania).
- **labels**: Przechowuje dane etykiet.
- **card_labels**: Tabela łącząca dla relacji wiele-do-wielu między kartami a etykietami.

### Moduły Frontendu

#### Moduł Components
Zawiera komponenty React używane w aplikacji:
- **Header**: Nagłówek aplikacji z menu nawigacyjnym.
- **Footer**: Stopka aplikacji.
- **BoardMembers**: Komponent do zarządzania członkami tablicy.
- **CardDetail**: Komponent do wyświetlania i edycji szczegółów karty.

#### Moduł Pages
Zawiera główne widoki aplikacji:
- **Home**: Strona główna aplikacji.
- **Login**: Strona logowania.
- **Register**: Strona rejestracji.
- **Boards**: Strona z listą tablic użytkownika.
- **BoardDetail**: Strona ze szczegółami tablicy.
- **NotFound**: Strona 404 (nie znaleziono).

#### Moduł Context
Zawiera konteksty React do zarządzania stanem globalnym:
- **AuthContext**: Przechowuje informacje o zalogowanym użytkowniku i udostępnia funkcje do logowania, wylogowywania i rejestracji.

#### Moduł Services
Zawiera usługi do komunikacji z API:
- **api.js**: Zawiera funkcje do wykonywania żądań HTTP do API backendu.