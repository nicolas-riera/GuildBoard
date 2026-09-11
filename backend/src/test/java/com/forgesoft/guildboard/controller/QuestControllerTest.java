package com.forgesoft.guildboard.controller;

import tools.jackson.databind.json.JsonMapper;
import com.forgesoft.guildboard.dto.CreateQuestRequest;
import com.forgesoft.guildboard.dto.QuestAssignmentRequest;
import com.forgesoft.guildboard.dto.QuestResponse;
import com.forgesoft.guildboard.enums.Difficulty;
import com.forgesoft.guildboard.enums.QuestStatus;
import com.forgesoft.guildboard.service.QuestService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(QuestController.class)
class QuestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JsonMapper objectMapper;

    @MockitoBean
    private QuestService questService;

    @Test
    @DisplayName("GET /api/quests - Should return quest list")
    void getAll_ShouldReturnQuests() throws Exception {
        QuestResponse quest = new QuestResponse(1L, "Chase all the rats", "Chase all the rats in your grandma's basement", Difficulty.EASY, 1, 10, 50, QuestStatus.AVAILABLE);
        given(questService.getAll(null, null)).willReturn(List.of(quest));

        mockMvc.perform(get("/api/quests"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Chase all the rats"));
    }

    @Test
    @DisplayName("POST /api/quests - Should create a quest and return 201")
    void create_ShouldReturn201() throws Exception {
        CreateQuestRequest request = new CreateQuestRequest("Kill the dragon", "Kill the dragon deep in the mountain", Difficulty.HARD, 10, 500, 2000);
        QuestResponse response = new QuestResponse(1L, "Kill the dragon", "Kill the dragon deep in the mountain", Difficulty.HARD, 10, 500, 2000, QuestStatus.AVAILABLE);

        given(questService.create(any(CreateQuestRequest.class))).willReturn(response);

        mockMvc.perform(post("/api/quests")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Kill the dragon"));
    }

    @Test
    @DisplayName("POST /api/quests/{id}/assignment - Should assign a quest")
    void assign_ShouldReturn201() throws Exception {
        QuestAssignmentRequest request = new QuestAssignmentRequest(5L);

        mockMvc.perform(post("/api/quests/1/assignment")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }
}