package com.forgesoft.guildboard.controller;

import tools.jackson.databind.json.JsonMapper;
import com.forgesoft.guildboard.dto.AdventurerResponse;
import com.forgesoft.guildboard.dto.CreateAdventurerRequest;
import com.forgesoft.guildboard.enums.CharacterClass;
import com.forgesoft.guildboard.service.AdventurerService;
import com.forgesoft.guildboard.service.AssignmentService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdventurerController.class)
class AdventurerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JsonMapper  objectMapper;

    @MockitoBean
    private AdventurerService adventurerService;

    @MockitoBean
    private AssignmentService assignmentService;

    @Test
    @DisplayName("GET /api/adventurers/{id} - Should return 200 OK")
    void getById_ShouldReturnAdventurer() throws Exception {

        AdventurerResponse response = new AdventurerResponse(1L, "Legolas", CharacterClass.MAGE, 5, 400, 150);
        given(adventurerService.getById(1L)).willReturn(response);

        mockMvc.perform(get("/api/adventurers/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Legolas"))
                .andExpect(jsonPath("$.characterClass").value("MAGE"));
    }

    @Test
    @DisplayName("POST /api/adventurers - Should create and return 201 Created")
    void create_ShouldReturn201() throws Exception {

        CreateAdventurerRequest request = new CreateAdventurerRequest("Gimli", CharacterClass.WARRIOR);
        AdventurerResponse response = new AdventurerResponse(2L, "Gimli", CharacterClass.WARRIOR, 1, 0, 0);

        given(adventurerService.create(any(CreateAdventurerRequest.class))).willReturn(response);

        mockMvc.perform(post("/api/adventurers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.name").value("Gimli"));
    }
}