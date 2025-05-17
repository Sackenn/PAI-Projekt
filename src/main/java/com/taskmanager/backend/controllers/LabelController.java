package com.taskmanager.backend.controllers;

import com.taskmanager.backend.models.Label;
import com.taskmanager.backend.payload.request.LabelRequest;
import com.taskmanager.backend.payload.response.MessageResponse;
import com.taskmanager.backend.repositories.LabelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/labels")
public class LabelController {
    @Autowired
    private LabelRepository labelRepository;

    /**
     * Pobierz wszystkie globalne etykiety
     * @param userId ID uzytkownika skladajacego zadanie
     * @return lista globalnych etykiet
     */
    @GetMapping("/global")
    public ResponseEntity<?> getGlobalLabels(@RequestParam Long userId) {
        List<Label> labels = labelRepository.findByGlobalTrue();
        return ResponseEntity.ok(labels);
    }

    /**
     * Utworz nowa globalna etykiete
     * @param labelRequest dane etykiety
     * @param userId ID uzytkownika skladajacego zadanie
     * @return utworzona etykieta
     */
    @PostMapping("/global")
    public ResponseEntity<?> createGlobalLabel(@Valid @RequestBody LabelRequest labelRequest, @RequestParam Long userId) {
        Label label = new Label(labelRequest.getName(), labelRequest.getColor());
        label.setGlobal(true);
        labelRepository.save(label);
        return ResponseEntity.ok(label);
    }

    /**
     * Usun globalna etykiete
     * @param id ID etykiety
     * @param userId ID uzytkownika skladajacego zadanie
     * @return komunikat o powodzeniu
     */
    @DeleteMapping("/global/{id}")
    public ResponseEntity<?> deleteGlobalLabel(@PathVariable Long id, @RequestParam Long userId) {
        Optional<Label> labelOptional = labelRepository.findById(id);
        if (!labelOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Etykieta nie znaleziona!"));
        }

        Label label = labelOptional.get();
        if (!label.isGlobal()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Etykieta nie jest globalna!"));
        }

        labelRepository.delete(label);
        return ResponseEntity.ok(new MessageResponse("Globalna etykieta usunieta pomyslnie!"));
    }
}
